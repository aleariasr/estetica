import re

import requests
from django.conf import settings


class WhatsAppService:
    @staticmethod
    def normalize_phone_number(phone: str) -> str:
        if not phone:
            raise ValueError("El destinatario de WhatsApp está vacío.")

        digits = re.sub(r"\D", "", phone)

        if len(digits) == 8:
            digits = f"506{digits}"

        if not digits.startswith("506"):
            raise ValueError(
                "El número de WhatsApp debe tener código de país 506 o ser un número nacional de 8 dígitos."
            )

        return f"{digits}@c.us"

    @staticmethod
    def send_message(to: str, message: str) -> dict:
        if not settings.OPENWA_BASE_URL:
            raise ValueError("OPENWA_BASE_URL no está configurado.")

        if not settings.OPENWA_API_KEY:
            raise ValueError("OPENWA_API_KEY no está configurado.")

        if not settings.OPENWA_SESSION_ID:
            raise ValueError("OPENWA_SESSION_ID no está configurado.")

        if not message:
            raise ValueError("El mensaje de WhatsApp está vacío.")

        chat_id = WhatsAppService.normalize_phone_number(to)

        url = (
            f"{settings.OPENWA_BASE_URL}/sessions/"
            f"{settings.OPENWA_SESSION_ID}/messages/send-text"
        )

        payload = {
            "chatId": chat_id,
            "text": message,
        }

        headers = {
            "X-API-Key": settings.OPENWA_API_KEY,
            "Content-Type": "application/json",
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=20,
        )

        if response.status_code >= 400:
            raise ValueError(
                f"Error enviando WhatsApp por OpenWA: "
                f"{response.status_code} - {response.text}"
            )

        return response.json()
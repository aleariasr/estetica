from django.conf import settings
from sent_dm import Sent


class WhatsAppService:
    @staticmethod
    def send_message(to: str, message: str) -> dict:
        if not settings.SENT_DM_API_KEY:
            raise ValueError("SENT_DM_API_KEY no está configurado.")

        if not settings.SENT_DM_TEMPLATE_ID:
            raise ValueError("SENT_DM_TEMPLATE_ID no está configurado.")

        if not to:
            raise ValueError("El destinatario de WhatsApp está vacío.")

        client = Sent(
            api_key=settings.SENT_DM_API_KEY
        )

        response = client.messages.send(
            channel=["whatsapp"],
            template={
                "id": settings.SENT_DM_TEMPLATE_ID,
                "parameters": {
                    "var_1": message
                }
            },
            to=[to],
            sandbox=True
        )

        return response
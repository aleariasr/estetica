#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
OPENWA_DIR="$HOME/VisualStudioCode/OpenWA"

clear

echo "==========================================="
echo "      INICIANDO ESTETICAPRO"
echo "==========================================="

cd "$PROJECT_DIR" || exit 1

echo ""
echo "Ejecutando instalador/verificador..."
bash "$PROJECT_DIR/instalar.sh"

if [ $? -ne 0 ]; then
    echo ""
    echo "La instalación falló. Revise los errores anteriores."
    read -p "Presione Enter para cerrar..."
    exit 1
fi

echo ""
echo "Abriendo Docker Desktop..."
open -a Docker

echo "Esperando Docker..."

until docker info >/dev/null 2>&1; do
    sleep 3
done

echo "Docker está corriendo."

echo ""
echo "Iniciando OpenWA..."

if [ ! -d "$OPENWA_DIR" ]; then
    echo "ERROR: No existe OpenWA en $OPENWA_DIR"
    read -p "Presione Enter para cerrar..."
    exit 1
fi

cd "$OPENWA_DIR" || exit 1
docker compose up -d

echo ""
echo "Verificando OpenWA..."

for i in {1..30}; do
    if curl -s http://localhost:2785/api/health | grep -q "ok"; then
        echo "OpenWA está funcionando."
        break
    fi

    if [ "$i" -eq 30 ]; then
        echo "ERROR: OpenWA no respondió correctamente."
        read -p "Presione Enter para cerrar..."
        exit 1
    fi

    sleep 3
done

echo ""
echo "Iniciando sesión de WhatsApp en OpenWA..."

OPENWA_API_KEY=$(grep "^OPENWA_API_KEY=" "$PROJECT_DIR/backend/.env" | cut -d "=" -f2- | tr -d '"' | tr -d "'")
OPENWA_SESSION_ID=$(grep "^OPENWA_SESSION_ID=" "$PROJECT_DIR/backend/.env" | cut -d "=" -f2- | tr -d '"' | tr -d "'")

if [ -z "$OPENWA_API_KEY" ] || [ -z "$OPENWA_SESSION_ID" ]; then
    echo "ADVERTENCIA: Falta OPENWA_API_KEY u OPENWA_SESSION_ID en backend/.env"
else
    curl -s -X POST \
        "http://localhost:2785/api/sessions/$OPENWA_SESSION_ID/start" \
        -H "X-API-Key: $OPENWA_API_KEY" >/dev/null

    echo "Esperando a que WhatsApp quede listo..."

    WHATSAPP_READY=false

    for i in {1..30}; do
        SESSION_STATUS=$(curl -s \
            "http://localhost:2785/api/sessions" \
            -H "X-API-Key: $OPENWA_API_KEY")

        echo "$SESSION_STATUS"

        if echo "$SESSION_STATUS" | grep -q '"status":"ready"\|"status":"connected"\|"status":"active"'; then
            WHATSAPP_READY=true
            break
        fi

        sleep 3
    done

    if [ "$WHATSAPP_READY" = true ]; then
        echo "WhatsApp está listo."
    else
        echo "ADVERTENCIA: WhatsApp no quedó listo. Estado final:"
        echo "$SESSION_STATUS"
    fi
fi

echo ""
echo "Iniciando Redis..."

if command -v redis-cli >/dev/null 2>&1; then
    if redis-cli ping >/dev/null 2>&1; then
        echo "Redis ya está corriendo."
    else
        if command -v brew >/dev/null 2>&1; then
            brew services start redis
        else
            redis-server --daemonize yes
        fi
    fi
else
    echo "ADVERTENCIA: redis-cli no está disponible."
fi

echo ""
echo "Abriendo servicios en Terminal..."

osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/backend' && source venv/bin/activate && python manage.py runserver\""

osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/backend' && source venv/bin/activate && celery -A config worker -l info\""

osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/backend' && source venv/bin/activate && celery -A config beat -l info\""

osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/frontend' && npm run dev\""

echo ""
echo "Esperando a que React levante..."
sleep 8

echo ""
echo "Abriendo navegador..."
open "http://localhost:5173"

echo ""
echo "==========================================="
echo "      ESTETICAPRO INICIADO"
echo "==========================================="
echo ""
echo "Servicios iniciados:"
echo "- Django: http://127.0.0.1:8000"
echo "- React:  http://localhost:5173"
echo "- Redis"
echo "- Celery Worker"
echo "- Celery Beat"
echo "- OpenWA: http://localhost:2785/api/health"
echo ""
echo "IMPORTANTE:"
echo "- Docker Desktop debe quedar abierto."
echo "- WhatsApp debe seguir vinculado en OpenWA."
echo "- Si OpenWA queda en qr_ready, debe escanear QR otra vez."
echo ""
echo "Puede cerrar esta ventana si todo abrió correctamente."
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

for i in {1..20}; do
    if curl -s http://localhost:2785/api/health | grep -q "ok"; then
        echo "OpenWA está funcionando."
        break
    fi

    if [ "$i" -eq 20 ]; then
        echo "ERROR: OpenWA no respondió correctamente."
        read -p "Presione Enter para cerrar..."
        exit 1
    fi

    sleep 3
done

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
echo "- Si OpenWA pierde sesión, hay que escanear QR otra vez."
echo ""
echo "Puede cerrar esta ventana si todo abrió correctamente."
#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

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
echo ""
echo "Puede cerrar esta ventana si todo abrió correctamente."
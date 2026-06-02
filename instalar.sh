#!/bin/bash

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
OPENWA_DIR="$HOME/VisualStudioCode/OpenWA"

echo "==========================================="
echo "      INSTALANDO ESTETICAPRO"
echo "==========================================="

cd "$PROJECT_DIR"

echo ""
echo "Verificando archivo .env..."

if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    echo ""
    echo "ERROR: Falta backend/.env"
    echo "Cree el archivo backend/.env antes de continuar."
    echo "Puede basarse en backend/.env.example."
    exit 1
fi

echo ""
echo "Verificando Docker..."

if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: Docker no está instalado."
    echo "Instale Docker Desktop primero."
    exit 1
fi

echo "Docker instalado."

echo ""
echo "Verificando OpenWA..."

if [ ! -d "$OPENWA_DIR" ]; then
    echo "Clonando OpenWA..."
    mkdir -p "$HOME/VisualStudioCode"
    cd "$HOME/VisualStudioCode"
    git clone https://github.com/rmyndharis/OpenWA.git
else
    echo "OpenWA ya existe."
fi

echo ""
echo "Verificando Python..."
python3 --version

echo ""
echo "Preparando backend..."
cd "$PROJECT_DIR/backend"

if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
else
    echo "Entorno virtual ya existe."
fi

echo ""
echo "Activando entorno virtual..."
source venv/bin/activate

echo ""
echo "Actualizando pip..."
pip install --upgrade pip

echo ""
echo "Instalando dependencias Python..."
pip install -r requirements.txt

echo ""
echo "Aplicando migraciones..."
python manage.py migrate

echo ""
echo "Verificando Django..."
python manage.py check

echo ""
echo "Preparando frontend..."
cd "$PROJECT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias React..."
    npm install
else
    echo "Dependencias React ya instaladas."
fi

echo ""
echo "Verificando Redis..."

if command -v redis-cli >/dev/null 2>&1; then
    if redis-cli ping >/dev/null 2>&1; then
        echo "Redis ya está corriendo."
    else
        echo "Intentando iniciar Redis..."
        if command -v brew >/dev/null 2>&1; then
            brew services start redis
        else
            redis-server --daemonize yes
        fi
    fi
else
    echo "ADVERTENCIA: redis-cli no está disponible."
    echo "Instale Redis o inícielo manualmente."
fi

echo ""
echo "==========================================="
echo "      INSTALACION COMPLETADA"
echo "==========================================="
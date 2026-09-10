#!/bin/bash

# ─── Navegar a la carpeta del script ───
cd "$(dirname "$0")"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   🚀 Hites MKT — Iniciando Proyecto...      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ─── Verificar que Node.js está instalado ───
if ! command -v node &> /dev/null; then
    echo "❌ Node.js NO está instalado en este equipo."
    echo ""
    echo "Descárgalo desde: https://nodejs.org/"
    echo "Instala la versión LTS y reinicia tu computador."
    echo ""
    echo "Consulta el README.md para instrucciones detalladas."
    echo ""
    read -p "Presiona Enter para cerrar..."
    exit 1
fi

# ─── Mostrar versiones ───
echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado:     $(npm --version)"
echo ""

# ─── Instalar dependencias si no existe node_modules ───
if [ ! -d "node_modules" ]; then
    echo "📦 Primera vez: instalando dependencias..."
    echo "(Esto puede tardar 1-3 minutos según tu conexión)"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Error al instalar dependencias."
        echo "Revisa tu conexión a Internet o consulta el README.md"
        echo ""
        read -p "Presiona Enter para cerrar..."
        exit 1
    fi
    echo ""
    echo "✅ Dependencias instaladas correctamente."
    echo ""
fi

# ─── Levantar el servidor de desarrollo ───
echo "================================================"
echo "  Levantando servidor de desarrollo..."
echo "  La app se abrirá en: http://localhost:5173/"
echo "  Para detener el servidor, presiona Ctrl+C"
echo "================================================"
echo ""

npm run dev -- --open

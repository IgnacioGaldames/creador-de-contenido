import os
import sys
import shutil
import subprocess

def main():
    print("\n ========================================")
    print("   Hites MKT - Iniciando Proyecto...")
    print(" ========================================\n")

    # --- Verificar Node.js ---
    if not shutil.which("node"):
        print(" [ERROR] Node.js NO esta instalado en este equipo.\n")
        print(" Descargalo desde: https://nodejs.org/")
        print(" Instala la version LTS y reinicia tu computador.\n")
        print(" Consulta el README.md para instrucciones detalladas.\n")
        input("Presiona Enter para salir...")
        sys.exit(1)

    print(" [OK] Node.js encontrado:")
    subprocess.run(["node", "--version"], shell=True)
    print("\n [OK] npm encontrado:")
    subprocess.run(["npm", "--version"], shell=True)
    print("\n")

    # --- Instalar dependencias si no existe node_modules ---
    if not os.path.exists("node_modules"):
        print(" [INFO] Primera vez: instalando dependencias...")
        print(" (Esto puede tardar 1-3 minutos segun tu conexion)\n")
        
        try:
            subprocess.run(["npm", "install"], check=True, shell=True)
            print("\n [OK] Dependencias instaladas correctamente.\n")
        except subprocess.CalledProcessError:
            print("\n [ERROR] Fallo la instalacion de dependencias.")
            print(" Revisa tu conexion a Internet o consulta el README.md\n")
            input("Presiona Enter para salir...")
            sys.exit(1)

    # --- Iniciar el servidor de desarrollo ---
    print(" ========================================")
    print("   Levantando servidor de desarrollo...")
    print("   La app se abrira en: http://localhost:5173/")
    print("   Para detener el servidor presiona Ctrl+C en esta ventana")
    print(" ========================================\n")

    try:
        # Se usa shell=True porque npm en Windows es un archivo .cmd
        subprocess.run(["npm", "run", "dev", "--", "--open"], shell=True)
    except KeyboardInterrupt:
        # Permite salir limpiamente si el usuario presiona Ctrl+C
        pass

    print("\n Servidor detenido.")
    input("Presiona Enter para salir...")

if __name__ == "__main__":
    main()

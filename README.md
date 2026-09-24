# 🚀 Automatizador de Secciones HTML

Herramienta interna para generar bloques de HTML estático listos para copiar y pegar en el CMS de Hites. Pega datos desde Excel y obtén código HTML auto-contenido al instante.

**Stack:** React · TypeScript · Vite · Bootstrap 5

## 🎫 Rama exclusiva de cupones

La rama `ignaciogaldames-cupones-compartibles` muestra únicamente el generador de
cupones y está pensada para desplegarse en un Vercel separado. La rama conserva
la historia de `main`, por lo que los cambios futuros relacionados con cupones
se pueden incorporar sin mezclar las demás secciones:

```bash
git switch ignaciogaldames-cupones-compartibles
git fetch origin
git merge origin/main
```

Después del merge, conserva el `src/App.tsx` de esta rama para que la aplicación
siga mostrando solo cupones. Si `main` modificó archivos usados por cupones,
prueba el build y publica nuevamente en el proyecto de Vercel compartido.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#-requisitos-previos)
2. [Instalación de Node.js (paso a paso)](#-instalación-de-nodejs-paso-a-paso)
3. [Clonar el Proyecto con SourceTree](#-clonar-el-proyecto-con-sourcetree)
4. [Instalar Dependencias y Levantar la App](#-instalar-dependencias-y-levantar-la-app)
5. [Método Rápido: Script de 1 Clic](#-método-rápido-script-de-1-clic)
6. [Método Manual: Usando la Terminal](#-método-manual-usando-la-terminal)
7. [Estructura del Proyecto](#-estructura-del-proyecto)
8. [Procesador de imágenes](#-procesador-de-imágenes)
9. [Solución de Problemas Frecuentes](#-solución-de-problemas-frecuentes)

---

## 🔧 Requisitos Previos

Antes de empezar, necesitas tener instalados estos programas en tu computador:

| Programa | ¿Qué es? | ¿Dónde descargarlo? |
|----------|-----------|---------------------|
| **Node.js** (v20 LTS o superior) | Motor que ejecuta JavaScript fuera del navegador. Incluye **npm** (gestor de paquetes). | [nodejs.org](https://nodejs.org/) |
| **SourceTree** | App visual para trabajar con Git (clonar, hacer pull, push, etc.) sin usar comandos. | [sourcetreeapp.com](https://www.sourcetreeapp.com/) |
| **VS Code** *(opcional pero recomendado)* | Editor de código con autocompletado y vista previa. | [code.visualstudio.com](https://code.visualstudio.com/) |

> **💡 Nota:** Al instalar Node.js, **npm se instala automáticamente**. No necesitas instalar npm por separado.

---

## 📥 Instalación de Node.js (paso a paso)

### Windows
0. Instalar WSL `wsl --version`
1. luego ejecutar `wsl --install` o ejecutar desde PowerShell `wsl --update`
2. **Instalar Docker Desktop en:** [https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)
1. Ve a **[nodejs.org](https://nodejs.org/es/download/current)** en tu navegador.
2. Descarga la versión **LTS** (Long Term Support) — es el botón verde grande de la izquierda.

   ![Descarga Node](https://nodejs.org/es/download/current)

3. Abre el archivo `.msi` descargado.
4. Sigue el asistente de instalación:
   - Haz clic en **Next** en cada pantalla.
   - **No cambies** la ruta de instalación (déjala en `C:\Program Files\nodejs\`).
   - En la pantalla de "Tools for Native Modules", **marca la casilla** que dice _"Automatically install the necessary tools"_ si aparece.
   - Haz clic en **Install** y luego en **Finish**.
5. **Reinicia tu computador** (o al menos cierra y vuelve a abrir todas las ventanas de terminal / VS Code).

### macOS

1. Ve a **[nodejs.org](https://nodejs.org/)** en tu navegador.
2. Descarga la versión **LTS** (el botón verde grande).
3. Abre el archivo `.pkg` descargado.
4. Sigue el asistente haciendo clic en **Continuar** hasta completar la instalación.

### ✅ Verificar que la instalación fue exitosa

Abre una **terminal nueva** (en Windows: busca "PowerShell" en el menú Inicio; en Mac: abre la app "Terminal") y escribe estos comandos uno por uno:

```bash
node --version
```
Deberías ver algo como: `v20.12.0` (o una versión superior).

```bash
npm --version
```
Deberías ver algo como: `10.5.0` (o una versión superior).

> **⚠️ ¿Te dice "no se reconoce el comando" o "command not found"?**
> Eso significa que Node.js no se instaló correctamente o que necesitas reiniciar la terminal. Lee la sección de [Solución de Problemas](#-solución-de-problemas-frecuentes) más abajo.

---

## 📂 Clonar el Proyecto con SourceTree

Si ya tienes SourceTree instalado y configurado con tu cuenta de Bitbucket:

1. Abre **SourceTree**.
2. Haz clic en **+ New** → **Clone from URL**.
3. Pega la URL del repositorio de Bitbucket del proyecto.
4. En **Destination Path**, elige una carpeta en tu computador (ej: `C:\Users\TuNombre\Documents\sourcetree\creador-de-contenido`).
5. Haz clic en **Clone**.
6. Espera a que se descarguen todos los archivos.

¡Listo! Ya tienes el proyecto en tu máquina.

---

## ⚡ Instalar Dependencias y Levantar la App

Tienes **dos opciones**: el script automático (recomendado) o la vía manual por terminal.

---

### 🟢 Método Rápido: Script de 1 Clic

La forma más fácil. No necesitas abrir la terminal ni escribir ningún comando.

#### 🪟 Windows

1. Abre la carpeta del proyecto en el Explorador de Archivos.
2. Busca el archivo **`iniciar_proyecto.bat`**.
3. **Haz doble clic** en él.
4. Si es la primera vez:
   - El script detectará que no tienes las dependencias instaladas y ejecutará `npm install` automáticamente (esto puede tardar 1-2 minutos).
5. Una vez listo, se abrirá tu navegador en **http://localhost:5173** con la app funcionando.

> **⚠️ ¿Te aparece un mensaje de que Node.js no está instalado?**
> Cierra la ventana, haz **clic derecho** sobre `iniciar_proyecto.bat` → **"Ejecutar como administrador"**. El script intentará instalar Node.js por ti automáticamente.

#### 🍎 macOS

1. Abre la carpeta del proyecto en Finder.
2. Busca el archivo **`iniciar_proyecto.command`**.
3. **Haz doble clic** en él.
4. Si macOS te muestra un aviso de seguridad: haz **clic derecho** → **Abrir** → confirma.
5. Se abrirá la Terminal, instalará dependencias si es necesario, y levantará la app.

---

### 🔵 Método Manual: Usando la Terminal

Útil si el script no funciona o si prefieres tener más control.

#### Paso 1: Abrir la terminal en la carpeta del proyecto

**Windows (PowerShell):**
- Abre el **Explorador de Archivos** y navega hasta la carpeta del proyecto.
- Haz clic en la **barra de direcciones** (donde sale la ruta), escribe `powershell` y presiona **Enter**.
- Se abrirá PowerShell directamente en la carpeta del proyecto.

**macOS (Terminal):**
- Abre la app **Terminal**.
- Escribe `cd ` (con un espacio al final) y luego arrastra la carpeta del proyecto desde Finder hacia la ventana de Terminal. Presiona **Enter**.

#### Paso 2: Instalar las dependencias

```bash
npm install --verbose

git config --global url."https://github.com/".insteadOf "git@github.com:"

npm config set registry https://registry.npmjs.org/

npm config set strict-ssl false

npm cache clean --force

npm install --verbose
```


Este comando lee el archivo `package.json` y descarga todas las librerías necesarias (React, Vite, Bootstrap, etc.) en una carpeta llamada `node_modules`. Solo necesitas hacerlo **una vez** (o cuando alguien agregue una librería nueva).

> **⏱️ La primera vez tarda entre 1 y 3 minutos** dependiendo de tu conexión a Internet. Es normal ver mucho texto en la terminal.

#### Paso 3: Levantar el servidor de desarrollo

```bash
npm run dev
```

Verás un mensaje como este:

```
  VITE v8.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Abre tu navegador y ve a **http://localhost:5173/**. ¡La app debería estar corriendo!

#### Paso 4: Detener el servidor

Cuando termines de trabajar, vuelve a la terminal y presiona **`Ctrl + C`** para apagar el servidor.

---

## 🗂️ Estructura del Proyecto

```
hites-mkt/
├── src/
│   ├── sections/              ← 📁 Cada sección del CMS vive aquí
│   │   └── NombreSeccion/
│   │       ├── NombreSeccion.tsx     ← Lógica React (estados, textarea, botón copiar)
│   │       ├── plantillaHtml.ts      ← HTML puro como Template Strings
│   │       └── estilos.css           ← CSS de la plantilla (se inyecta en el HTML final)
│   └── App.tsx                ← Orquestador: Sidebar + navegación entre secciones
├── public/                    ← Archivos estáticos
├── iniciar_proyecto.bat       ← 🪟 Script de arranque para Windows
├── iniciar_proyecto.command   ← 🍎 Script de arranque para macOS
├── package.json               ← Lista de dependencias del proyecto
└── README.md                  ← 📖 Este archivo
```

### 🖼️ Procesador de imágenes

La sección **Procesar imágenes** permite seleccionar o arrastrar un lote de imágenes y elegir el ancho, formato (WebP, JPEG o PNG) y calidad. Cada archivo se procesa localmente conservando la proporción y se puede descargar individualmente o como un ZIP; las imágenes no se suben a ningún servidor.

En **Inpage**, el Paso 2 mantiene su flujo actual y, después de seleccionar las imágenes, prepara además un ZIP optimizado a 700 px de ancho, WebP y calidad 80% para descargarlo directamente.

### Para Diseñadores

Si necesitas modificar los estilos o la estructura HTML de una sección, solo edita los archivos dentro de `src/sections/[NombreSeccion]/`:

- **`estilos.css`** → Cambia colores, fuentes, márgenes, etc. Con autocompletado en VS Code.
- **`plantillaHtml.ts`** → Modifica la estructura HTML directamente en los bloques de texto.

**No necesitas tocar** archivos como `App.tsx`, `main.tsx`, ni ninguna configuración de Vite/TypeScript.

---

## 🩹 Solución de Problemas Frecuentes

### ❌ `npm: The term 'npm' is not recognized`

**Causa:** Node.js no está instalado, o la terminal no reconoce la ruta de instalación.

**Solución:**
1. Verifica que instalaste Node.js siguiendo los pasos de arriba.
2. **Cierra TODAS las ventanas** de terminal, PowerShell y VS Code.
3. Vuelve a abrirlas y prueba `node --version` de nuevo.
4. Si sigue sin funcionar, revisa que la ruta `C:\Program Files\nodejs\` exista en tu equipo. Si no existe, reinstala Node.js.

---

### ❌ `node: command not found` (macOS)

**Causa:** El PATH del sistema no incluye la ruta de Node.

**Solución:**
1. Cierra y abre la Terminal.
2. Prueba `node --version`.
3. Si no funciona, reinstala desde [nodejs.org](https://nodejs.org/).

---

### ❌ El script `.bat` pide "Ejecutar como administrador"

**Causa:** Node.js no está instalado y el script necesita permisos para instalarlo automáticamente.

**Solución:**
1. Haz **clic derecho** sobre `iniciar_proyecto.bat`.
2. Selecciona **"Ejecutar como administrador"**.
3. Acepta el aviso de Windows si aparece.

> 💡 **Alternativa:** Instala Node.js manualmente desde [nodejs.org](https://nodejs.org/) y luego haz doble clic normal sobre el `.bat`.

---

### ❌ `npm install` falla o se queda pegado

**Posibles causas y soluciones:**

| Problema | Solución |
|----------|----------|
| Sin conexión a Internet | Conéctate a una red estable y vuelve a intentar. |
| Proxy corporativo bloqueando npm | Pide al equipo de TI que permita el tráfico a `registry.npmjs.org`. |
| Carpeta `node_modules` corrupta | Borra la carpeta `node_modules` y el archivo `package-lock.json`, luego ejecuta `npm install` de nuevo. |

Para borrar y reinstalar desde cero:
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# macOS / Linux
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ La app no abre en el navegador

**Solución:** Abre manualmente tu navegador y ve a **http://localhost:5173/**. Si la terminal muestra un puerto diferente (ej: `5174`), usa ese número en vez de `5173`.

---

### ❌ macOS no permite abrir `iniciar_proyecto.command`

**Causa:** Gatekeeper bloquea archivos descargados de Internet.

**Solución:**
1. Haz **clic derecho** sobre el archivo → **Abrir**.
2. Confirma en el diálogo de seguridad.
3. Si sigue bloqueado, abre Terminal y ejecuta:
   ```bash
   chmod +x iniciar_proyecto.command
   ```

---

## 📞 ¿Necesitas ayuda?

Si nada de lo anterior funciona, contacta al equipo de desarrollo con:
- El **mensaje de error** exacto que ves en la terminal (copia y pega el texto o toma un pantallazo).
- Tu **sistema operativo** (Windows 10/11, macOS Sonoma, etc.).
- La versión de **Node.js** instalada (`node --version`).

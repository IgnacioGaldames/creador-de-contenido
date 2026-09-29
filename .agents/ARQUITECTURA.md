# Contexto del Proyecto: Creador de Contenido

## Descripción General
Esta es una aplicación frontend desarrollada en **React**, utilizando **Vite** como empaquetador y **TypeScript** para el tipado estático. Su propósito principal es facilitar la creación de contenido modular, permitiendo al usuario generar diferentes piezas visuales o funcionales de manera independiente.

## Stack Tecnológico
*   **Framework:** React 18+ (con Vite)
*   **Lenguaje:** TypeScript
*   **Estilos:** CSS puro (organizado por módulos/secciones)
*   **Despliegue:** Preparado para Vercel (según `vercel.json`)

## Estructura de la Aplicación
El proyecto sigue una arquitectura altamente modular, dividida en **secciones** independientes dentro del directorio `src/sections/`. Cada sección encapsula su propia lógica, componentes de interfaz y plantillas.

### Secciones Principales
1.  **Cabeceras (`src/sections/cabeceras/`):**
    *   Gestiona la creación de encabezados o banners.
    *   Incluye lógica en `Cabeceras.tsx` y plantillas en `plantillaHtml.ts`.
2.  **Cupones (`src/sections/cupones/`):**
    *   Funcionalidad para generar y gestionar cupones de descuento.
    *   Contiene scripts adicionales para el manejo de caducidad (`scriptCaducidad.ts`) y la copia del cupón al portapapeles (`scriptCopiaCupon.ts`).
3.  **Inpage (`src/sections/inpage/`):**
    *   Para contenido insertado o modales dentro de la página.
    *   Contiene plantillas específicas en `plantillaInpage.ts`.
4.  **Procesador de Imágenes (`src/sections/procesadorImagenes/`):**
    *   Sección para la manipulación y optimización de recursos gráficos.
    *   Se apoya en utilidades ubicadas en `src/utils/procesamientoImagenes.ts`.
5.  **Puntos de Retiro (`src/sections/puntosRetiro/`):**
    *   Módulo para gestionar y mostrar ubicaciones de retiro de productos.
6.  **Secciones Generales (`src/sections/general/`):**
    *   Contiene componentes transversales, como un `contador` con su propia lógica y plantillas.

### Componentes y Utilidades
*   **Componentes Comunes (`src/components/`):** Componentes reutilizables a través de múltiples secciones, como `BotonGenerarCopiar.tsx` y `SelectorContador.tsx`.
*   **Hooks Personalizados (`src/hooks/`):** Lógica reutilizable de React, como `useProcesarYCopiar.ts`.
*   **Utilidades (`src/utils/`):** Funciones puras o de procesamiento, como la manipulación de imágenes.

## Patrones y Prácticas Clave
*   **Encapsulamiento:** Cada sección es responsable de su propio CSS (`estilos[Nombre].css`), sus plantillas (`plantilla[Nombre].ts`) y su vista principal (`[Nombre].tsx`).
*   **Generación de Contenido:** Se prioriza la generación de plantillas estáticas (HTML/TS) que luego son procesadas o copiadas al portapapeles mediante hooks especializados.
*   **Aislamiento de Prompts (Para IAs):** Al solicitar cambios, se debe proveer este documento junto con *únicamente* los archivos de la sección específica que se desea modificar (Ej. `Cupones.tsx` + `plantillaCupon.ts`).
```eof


# Reglas de Desarrollo del Proyecto Hites eCommerce HTML Generator

## Rol y Contexto del Proyecto
Asistes a un Desarrollador Front-End Senior en la creación de una herramienta interna para automatizar la generación de código HTML para el eCommerce de la tienda Hites. El stack tecnológico incluye React, TypeScript, Vite y Bootstrap 5.

El objetivo de la app es que ejecutivos o diseñadores peguen datos concatenados desde Excel en un `<textarea>`, y la app genere un bloque de HTML estático y auto-contenido, listo para ser copiado y pegado en el CMS de la empresa.

## Reglas Arquitectónicas y Estructura (¡ESTRICTO!)
Para mantener la separación de responsabilidades y permitir la mantenibilidad por desarrolladores Junior y Diseñadores, se DEBEN seguir estrictamente estas reglas:

1. **Orquestador Limpio:**
   - [App.tsx](file:///c:/Users/igaldames/Documents/sourcetree/hites-mkt.bitbucket.io/src/App.tsx) solo maneja la navegación lateral (Sidebar) y renderiza el componente activo de la sección correspondiente (ej. Cabeceras, Destacados, Slider).
   - NO debe contener lógica de procesamiento de datos.

2. **Carpetas Modulares:**
   - Cada sección debe vivir en su propia carpeta bajo `src/sections/[NombreSeccion]/`.

3. **Lógica de React:**
   - El archivo `[NombreSeccion].tsx` contiene los estados (`useState`), la lógica de captura del `<textarea>`, el botón de "Copiar al portapapeles" (`navigator.clipboard.writeText`) y el procesamiento del texto.

4. **Plantillas HTML Aisladas:**
   - El HTML puro (Template Strings) NUNCA debe ir dentro del componente React.
   - Debe vivir en un archivo `plantillaHtml.ts` dentro de la carpeta de la sección.
   - Se exportan funciones que reciben variables posicionales y retornan strings con el HTML.

5. **CSS Híbrido (Vite `?raw`):**
   - Los estilos se escriben en un archivo `estilos.css` nativo en la misma carpeta para mantener autocompletado y linting.
   - En `plantillaHtml.ts`, este CSS se importa como texto plano (`import cssCrudo from './estilos.css?raw'`) y se inyecta dentro de una etiqueta `<style>` en el output final HTML.
   - El entregable final DEBE ser un solo bloque de texto (HTML + CSS integrado).

## Reglas de Procesamiento de Datos (Excel)
NO proceses archivos `.csv`. El usuario pega directamente un texto plano proveniente de una fórmula de Excel (`=CONCATENAR(...)`).
1. **Separador de Filas:** Usar el carácter pipe (`|`) para separar cada iteración/fila (ej. cada marca de un carrusel). En JavaScript usar `.split('|')`.
2. **Separador de Columnas:** Dentro de cada fila, los datos se separan por comas (`,`). En JavaScript usar `.split(',')`.
3. **Limpieza:** Aplicar siempre `.trim()` y eliminar caracteres extraños (ej. `.replace('|', '')` si el separador se cuela en la última columna).

## Reglas de Código y UX
- Usar TypeScript de forma estricta.
- El código final exportado para el CMS de Hites suele incluir etiquetas `<picture>`, `<source>` para responsive, y atributos `data-` para analítica (ej. `data-position`, `data-size`).
- Proveer siempre feedback visual en la UI cuando se copia el código (Cambiar texto/estado del botón "Copiar Código" a "¡Copiado!").
- Comunicarse de forma directa, a nivel de un desarrollador Senior, sin sobre-explicar conceptos básicos de React a menos que sea una técnica específica.

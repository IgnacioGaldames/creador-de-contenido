---
trigger: always_on
---

Agentes y Reglas Actualizadas del Proyecto Hites eCommerce HTML Generator

Esta documentación está diseñada para ser utilizada como contexto estricto por cualquier IA o agente de desarrollo ("Antigravity", Cursor, Copilot, etc.) que asista en el proyecto.

Rol y Contexto del Proyecto

Asistes a un Desarrollador Front-End Senior en la creación y mantenimiento de una herramienta interna para automatizar la generación de código HTML para el eCommerce de Hites. El stack tecnológico estricto es React, TypeScript, Vite y Bootstrap 5.

El objetivo de la app es que ejecutivos o diseñadores peguen datos concatenados desde Excel en un <textarea>, y la app genere un bloque de HTML estático y auto-contenido, listo para ser copiado y pegado en el CMS de la empresa.

Reglas Arquitectónicas y Estructura (¡ESTRICTO E INNEGOCIABLE!)

Orquestador Limpio (App.tsx):

SOLO maneja la navegación lateral (Sidebar) y renderiza el componente activo de la sección correspondiente.

NO debe contener lógica de procesamiento de datos.

Carpetas Modulares de Secciones:

Cada nueva funcionalidad (ej. Cupones, Hero, Cabeceras) debe vivir en su propia carpeta bajo src/sections/[NombreSeccion]/.

Lógica de React y Principio DRY (Don't Repeat Yourself):

El archivo [NombreSeccion].tsx contiene los estados (useState), la captura del <textarea> y la lógica de filtrado de datos.

PORTAPAPELES: NO uses navigator.clipboard directamente en las secciones. TODAS las secciones DEBEN importar y utilizar el custom hook useProcesarYCopiar (src/hooks/useProcesarYCopiar.ts).

BOTÓN DE COPIAR: NO crees botones de copiado manuales. TODAS las secciones DEBEN importar y utilizar el componente <BotonGenerarCopiar /> (src/components/BotonGenerarCopiar.tsx). Todas las secciones nuevas ocupan el copiado automático en el portapapeles después de pegar los datos y procesar los datos.

Utilidades Compartidas (Helpers):

NUNCA repitas funciones lógicas en diferentes secciones (ej. conversión de fechas de Excel).

Cualquier función lógica pura que no dependa de estados de React debe crearse en src/utils/[nombre_utilidad].ts e importarse en las secciones que la necesiten.

Plantillas HTML Aisladas:

El HTML puro (Template Strings) NUNCA debe ir dentro del componente React.

Debe vivir en un archivo plantilla[NombreSeccion].ts dentro de la carpeta de la sección correspondiente.

Se exportan funciones que reciben variables posicionales tipadas estrictamente (string, number, boolean) y retornan strings con el HTML.

CSS Híbrido (Vite ?raw):

Los estilos se escriben en un archivo .css nativo en la misma carpeta para mantener autocompletado y linting.

En plantilla[NombreSeccion].ts, este CSS se importa como texto plano (import cssCrudo from './estilos[NombreSeccion].css?raw') y se inyecta dentro de una etiqueta <style> en el output final HTML.

El entregable final DEBE ser un solo bloque de texto (HTML + CSS integrado, y si aplica, JS integrado).

Scripts y Lógica Nativa para el Storefront:

Si el HTML resultante requiere JavaScript interactivo (ej. carruseles, contadores, copiado nativo en la web de Hites), ese script Vanilla JS debe escribirse en un archivo separado (ej. scriptCaducidad.ts).

Exporta el script como un string que contenga las etiquetas <script> para concatenarlo en la salida final HTML. NO uses .tsx ni JSX para estos scripts nativos.

Reglas de Procesamiento de Datos (Excel)

NO proceses archivos .csv a través de librerías. El usuario pega directamente un texto plano proveniente de una fórmula de Excel (=CONCATENAR(...)).

Separador de Filas: Usar el carácter pipe (|) para separar cada iteración/fila. En JavaScript usar .split('|').

Separador de Columnas: Dentro de cada fila, los datos se separan por comas (,). En JavaScript usar .split(',').

Limpieza y Estabilidad:

Aplicar SIEMPRE .trim() a cada columna extraída.

Manejar valores nulos con Optional Chaining y valores por defecto (ej. const titulo = columnas[3]?.trim() || '').

Reglas de Código y UX

Usar TypeScript de forma estricta. Evitar any a toda costa.

El código final exportado para el CMS suele requerir etiquetas <picture>, <source> para responsive, y atributos data- para analítica y filtrado (ej. data-department, data-position, data-size). Mantener esa estructura rigurosamente.

Mantener la simplicidad del proyecto, debe ser muy fácil e intruitivo de usar para el usuario final y de editar para el desarrollador.

Comunicarse de forma directa, priorizando la entrega de código estructurado y refactorizaciones limpias.
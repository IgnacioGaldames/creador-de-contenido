# Instrucciones para asistentes

- Antes de modificar código, consulta `.agents/rules/AGENTS.md` y sigue las reglas del proyecto.
- Trata la ruta del proyecto seleccionada por el usuario como la ubicación de trabajo autorizada.
- Si una operación de lectura o escritura falla porque el entorno aislado no puede acceder a esa ruta, reintenta usando el mecanismo de acceso al workspace que ofrezca la herramienta. No concluyas que el proyecto no existe ni pidas al usuario volver a abrirlo mientras no hayas probado ese reintento.
- Si el mecanismo de acceso requiere revisión y esta lo rechaza, informa qué operación fue bloqueada y el motivo indicado; no atribuyas el problema a una configuración del usuario sin evidencia.

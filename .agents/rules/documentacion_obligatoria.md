# Regla: Actualización Obligatoria de Documentación (¡INNEGOCIABLE!)

## Contexto
El proyecto mantiene **tres archivos de documentación** que DEBEN estar siempre sincronizados con el estado real del código. Toda IA o agente que modifique el proyecto DEBE verificar y actualizar estos archivos como parte de cada tarea.

## Archivos de Documentación

| Archivo | Ruta | Propósito |
|---------|------|-----------|
| **PROMPT_SISTEMA_IA** | `.agents/PROMPT_SISTEMA_IA.md` | Instrucciones de comportamiento y rol para agentes IA |
| **ARQUITECTURA** | `.agents/ARQUITECTURA.md` | Mapa completo de la estructura del proyecto (secciones, componentes, hooks, utils) |
| **Copilot Instructions** | `.github/copilot-instructions.md` | Combinación de prompt + arquitectura para GitHub Copilot |

## Regla de Actualización (¡ESTRICTO!)

### ¿Cuándo actualizar?
DEBES actualizar la documentación cuando tu tarea incluya **cualquiera** de estos cambios:

1. **Nueva sección** creada en `src/sections/[NombreSeccion]/`.
2. **Sección eliminada o renombrada.**
3. **Nuevo componente compartido** en `src/components/`.
4. **Nuevo hook personalizado** en `src/hooks/`.
5. **Nueva utilidad** en `src/utils/`.
6. **Nuevo archivo de plantilla** (`plantilla[Nombre].ts`) o **script nativo** (`script[Nombre].ts`) añadido a una sección existente.
7. **Cambio en el stack tecnológico** (nueva dependencia relevante, cambio de empaquetador, etc.).
8. **Cambio en patrones arquitectónicos** (nuevo patrón de procesamiento, nueva convención de nombrado, etc.).

### ¿Qué actualizar en cada archivo?

#### 1. `PROMPT_SISTEMA_IA.md`
- Actualizar la lista de ejemplos en "Contexto del Proyecto" si se añaden nuevas secciones o tipos de contenido.
- Si se crean nuevos hooks transversales, añadirlos como ejemplo junto a `useProcesarYCopiar.ts`.

#### 2. `ARQUITECTURA.md`
- **Secciones Principales:** Añadir/eliminar/modificar la entrada de la sección afectada, listando sus archivos clave (`.tsx`, `plantilla*.ts`, `script*.ts`, `estilos*.css`).
- **Componentes y Utilidades:** Actualizar la lista de componentes comunes, hooks personalizados y utilidades.
- **Stack Tecnológico:** Reflejar cualquier cambio de dependencias o herramientas.

#### 3. `copilot-instructions.md`
- Este archivo es la **unión** de `PROMPT_SISTEMA_IA.md` + `ARQUITECTURA.md`. Debe recibir **los mismos cambios** aplicados a los otros dos archivos, manteniendo la estructura combinada.

### ¿Cómo actualizar?
1. **Lee los tres archivos** antes de modificarlos para entender el estado actual.
2. **Aplica los cambios** de forma quirúrgica (no reescribas todo el archivo, solo las secciones afectadas).
3. **Mantén el formato** existente (listas numeradas, negritas, estructura de headings).
4. **Sincroniza `copilot-instructions.md`** para que refleje exactamente la suma de los otros dos.

### Ejemplo Práctico
Si creas una nueva sección `src/sections/slider/` con los archivos `Slider.tsx`, `plantillaSlider.ts` y `estilosSlider.css`, debes:

1. En `ARQUITECTURA.md` → Agregar bajo "Secciones Principales":
   ```
   X.  **Slider (`src/sections/slider/`):**
       *   Gestiona la creación de sliders/carruseles.
       *   Incluye lógica en `Slider.tsx`, plantillas en `plantillaSlider.ts` y estilos en `estilosSlider.css`.
   ```
2. En `PROMPT_SISTEMA_IA.md` → Actualizar la lista de ejemplos:
   ```
   *   Las secciones generan plantillas de código o contenido (ej. Cupones, Cabeceras, Inpage, Slider).
   ```
3. En `copilot-instructions.md` → Aplicar **ambos** cambios anteriores en sus posiciones correspondientes.

## Consecuencia de No Cumplir
Si la IA no actualiza la documentación después de un cambio estructural, la tarea se considera **INCOMPLETA** independientemente de que el código funcione correctamente.

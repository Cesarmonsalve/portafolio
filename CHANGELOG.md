# Historial de Cambios (Changelog)

Este archivo documenta todas las actualizaciones y mejoras realizadas en el proyecto para mantener un registro actualizado de los cambios.

## [11 Mayo 2026] - Corrección de Bugs en Admin
- **Bug Fix:** Se solucionó el problema en el panel de administración donde los campos de texto perdían el foco (focus loss) después de cada pulsación de tecla.
  - Esto afectaba principalmente a `AdminSettings` y `AdminAppearance`.
  - **Causa:** Declaración de componentes React internos (`Field`, `ColorField`, `SectionHeader`, etc.) dentro del cuerpo de la función principal, lo que causaba un desmontaje del DOM en cada renderizado.
  - **Solución:** Se extrajeron dichos componentes fuera del ciclo de renderizado de la función padre.

---
name: demomed-frontend-design
description: Guía de diseño visual y UX para el frontend de DemoMed (Angular). Usar cuando el usuario pida mejorar la interfaz, el aspecto visual, estilos, colores, espaciado, accesibilidad o experiencia de usuario en el frontend.
---

# Diseño frontend DemoMed

## Stack

- **Framework**: Angular (standalone components), TypeScript.
- **Estilos**: SCSS por componente y global; variables CSS cuando convenga.
- **Rutas**: app.routes.ts; rutas admin (consultas, pacientes, historia médica, informes).

## Principios

1. **Claridad y legibilidad**: Tipografía legible, contraste suficiente (WCAG). Evitar texto gris muy claro sobre blanco.
2. **Contexto clínico**: Interfaz sobria y profesional; evitar estética "juguetona" o genérica.
3. **Consistencia**: Reutilizar clases existentes (btn, form-control, estado-badge, form-section, info-section). No inventar patrones nuevos sin motivo.
4. **Responsive**: Considerar lista/cards y filtros en móvil (el proyecto ya usa grids y media queries).
5. **Evitar "AI slop"**: No usar paletas genéricas (purple gradient, Inter font everywhere). Mantener la identidad existente (ej. color-primary, azules/grises ya usados).

## Dónde tocar

- **Componente concreto**: Modificar el SCSS o estilos inline del componente y su template.
- **Global**: styles.scss o estilos en index.html; variables en :root si se añaden tokens.
- **Iconos**: Font Awesome ya usado (fa fa-*); mantener coherencia.

## Checklist rápido

- Contraste de texto y fondos suficiente.
- Botones y enlaces distinguibles (estado hover/focus).
- Espaciado coherente (padding/margin entre bloques).
- En formularios: labels visibles, errores claros, botones de envío evidentes.

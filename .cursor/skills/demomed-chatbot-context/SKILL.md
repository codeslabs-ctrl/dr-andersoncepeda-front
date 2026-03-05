---
name: demomed-chatbot-context
description: Contexto del asistente de chat de DemoMed: acciones, flujo y dónde implementar cambios. Usar cuando el usuario pida modificar el chat, el asistente, el chatbot, agendar por chat, crear paciente por chat, o que el asistente "entienda mejor" qué hacer.
---

# Asistente / Chat DemoMed

## Qué es

El chat es un asistente para el médico: crear pacientes, agendar consultas, ver consultas de hoy o por paciente, abrir antecedentes/historia médica, generar informes. El usuario del chat es el médico logueado (no se pide "con qué médico").

## Dónde está el código

| Parte | Ubicación |
|-------|-----------|
| **Backend (lógica, IA, acciones)** | `backend/demomed-backend/chatbot/` |
| **Prompts del asistente** | `chatbot/ai.ts` → `SYSTEM_PROMPT` |
| **Manejo de mensajes y acciones** | `chatbot/server.ts` → `handleMessage`, `resolvedAction`, respuestas con `navigateTo` |
| **Llamadas al API principal** | `chatbot/backend.ts` (createConsulta, getPatients, getConsultasDelDia, etc.) |
| **Frontend (UI del chat)** | `frontend/.../pages/chat/` (chat.component, chat.service) |
| **Respuesta al frontend** | JSON: `{ success, reply, conversationId, navigateTo? }`; si viene `navigateTo`, el frontend muestra botón "Abrir en la aplicación". |

## Acciones (__ACTION__)

El modelo devuelve una línea `__ACTION__nombre__{"json"}__`. El servidor la parsea y ejecuta:

- **create_patient**: Crear paciente (backend.createPatient). Luego se puede ofrecer antecedentes o agendar.
- **schedule_consultation**: Agendar consulta. Requiere fecha concreta (no "mañana"); hora; motivo; paciente. Médico = usuario logueado. Tras éxito se devuelve `navigateTo: "/admin/consultas"`.
- **get_consultations**: tipo "hoy" | "proximos_dias" | "paciente" (con paciente_nombre o paciente_id).
- **get_patient_data**: Datos de un paciente por nombre o ID.
- **open_section**: Navegar a antecedentes o historia médica de un paciente (path: "antecedentes", "historia-medica", "historia-medica/nuevo", etc.).
- **generate_report**: Generar informe médico.

## Cómo mejorar "qué debe hacer" el chat

1. **Cambiar comportamiento o tono**: Editar `SYSTEM_PROMPT` en `chatbot/ai.ts` (instrucciones, ejemplos de acciones, reglas en español).
2. **Nuevas acciones o parámetros**: Añadir el caso en `server.ts` (resolvedAction, parsedData) y, si aplica, en `SYSTEM_PROMPT` el formato __ACTION__ y datos.
3. **Enlaces o botones tras una acción**: En `server.ts`, al construir la respuesta exitosa, incluir `navigateTo: "/ruta"` en el JSON (el frontend ya muestra el botón).
4. **Fallbacks cuando la IA no devuelve acción**: En `server.ts` están los regex/fallbacks para "consultas de hoy", "agendar para X", etc.; se pueden ampliar para que el asistente "entienda mejor" frases concretas.

## Reglas ya definidas (no duplicar)

- No pedir médico al agendar; usar el del usuario logueado.
- Para fechas relativas ("mañana", "próximo viernes") pedir fecha exacta (ej. "5 de marzo o 05/03").
- Para antecedentes e historia médica: usar open_section, no pedir los datos en el chat.
- get_patient_data y get_consultations: la respuesta del modelo debe incluir la línea __ACTION__ en la misma respuesta para que el sistema ejecute y muestre datos.

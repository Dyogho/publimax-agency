# Plan Técnico: Sistema de Gestión PubliMax Marketing Digital

Este documento detalla la arquitectura, el stack tecnológico y el plan de ejecución para la prueba técnica de la pasantía ReWo.

## 1. Stack Tecnológico (Selección Estratégica)
*   **Frontend & Backend:** Next.js 15 (React 19, App Router, TypeScript).
*   **Estilos:** Tailwind CSS (UX Profesional y Responsive).
*   **Base de Datos:** PostgreSQL hospedado en **Supabase**.
*   **ORM:** **Prisma** (Arquitectura limpia y tipado estricto de DB).
*   **Autenticación:** Supabase Auth (Integración nativa).
*   **Despliegue:** Vercel (Escalabilidad Serverless automática).

## 2. Arquitectura: "Monolito Moderno"
Se utilizará el patrón de **Next.js App Router** con **Server Actions**.
*   **Escalabilidad:** Las funciones de servidor corren de forma independiente (Serverless), permitiendo manejar picos de tráfico sin degradar el rendimiento.
*   **Concurrencia:** Supabase (PostgREST) gestiona miles de conexiones concurrentes mediante pooling de conexiones optimizado (Supavisor).

## 3. Modelo de Datos (PostgreSQL)
*   **Clientes (Clients):** Perfil de las empresas de PubliMax.
*   **Campañas (Campaigns):** Presupuesto, tipo de ads, fechas y ROI estimado.
*   **Entregables (Deliverables):** Gestión de banners, videos y copys con estados.
*   **Equipo (Team):** Creativos asignados a cada campaña.
*   **Facturación (Invoices):** Control de cobros por hitos o mensualidades.
*   **Moodboards:** Colecciones de referencias visuales compartibles.

## 4. Funcionalidad "Extra" (Valor Comercial)
*   **AI Ads Copy Generator:** Integración con API de IA (OpenAI/Gemini) para generar textos persuasivos para los anuncios directamente desde el panel de la campaña.

## 5. Estrategia de Commits (Mínimo 15)
1.  `init: proyecto nextjs con tailwind y typescript`
2.  `feat: configuracion de prisma y supabase`
3.  `feat: esquema de base de datos inicial`
4.  `feat: layout principal y navegacion (UX)`
5.  `feat: crud de clientes`
6.  `feat: creacion de campañas y asignacion de equipo`
7.  `feat: gestion de entregables y calendario`
8.  `feat: modulo de facturacion por hitos`
9.  `feat: dashboard de reporte ROI con graficos`
10. `feat: sistema de moodboards compartibles`
11. `feat: integración de AI Copy Generator (Extra)`
12. `fix: validaciones de formularios y edge cases`
13. `perf: optimización de consultas y caching`
14. `docs: documentacion completa en README.md`
15. `deploy: configuracion final para produccion en Vercel`

## 6. Criterios de Éxito
*   Sistema 100% funcional.
*   Diseño responsive y profesional.
*   Código limpio y documentado.
*   Despliegue estable con URL pública.

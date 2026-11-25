const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEFAULT_MODEL = 'deepseek-chat';
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 600;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 24;

const rateBuckets = new Map();

export const ARNIE_SYSTEM_PROMPT = `Eres el asistente de IA oficial del portafolio de Arnie Calderón (arcay.dev), diseñado para responder preguntas de reclutadores, tech leads y clientes sobre su experiencia, proyectos, stack técnico y disponibilidad.

REGLAS ESTRICTAS:
1. Responde SIEMPRE en el mismo idioma que use el usuario (español o inglés).
2. Sé conciso, claro, honesto y orientado a impacto técnico (2 a 5 líneas o bullets cortos; evita muros de texto).
3. NUNCA inventes métricas, empresas, certificaciones ni tecnologías que no estén en el perfil verificado abajo. Si te preguntan algo fuera del perfil (salario exacto, disponibilidad de reubicación específica, etc.), dilo con transparencia e invita a escribirle directamente a arniecalderonayala@gmail.com o WhatsApp +51 918 793 956.
4. Habla en tercera persona ("Arnie...") o como su asistente virtual ("Soy el asistente de Arnie...").

PERFIL VERIFICADO DE ARNIE CALDERÓN:
- Nombre: Arnie Kener Calderón Ayala (GitHub: https://github.com/Arcay322 | LinkedIn: https://www.linkedin.com/in/arniecalderonayala/ | Web: https://www.arcay.dev).
- Ubicación y disponibilidad: Lima, Perú. Disponible a tiempo completo de forma inmediata (Lima presencial/híbrido o remoto internacional).
- Contacto: arniecalderonayala@gmail.com | Teléfono/WhatsApp: +51 918 793 956.
- CV descargable: https://www.arcay.dev/assets/cv/Arnie_Calderon_ES.pdf (ES) y https://www.arcay.dev/assets/cv/Arnie_Calderon_EN.pdf (EN).
- Formación: Ingeniería de Software en la Universidad Tecnológica del Perú (UTP), 2022 – Diciembre 2026 (egreso previsto).
- Idiomas: Español nativo, Inglés B1 (lectura técnica fluida y comunicación en equipo).

EXPERIENCIA PROFESIONAL:
1. Ventify — Desarrollador Full-Stack (Producto SaaS) | Octubre 2024 – Actualidad · Perú (https://www.ventify.com.pe)
   - Evolucionó un POS a medida creado para INVERSIONES MAX PERU hacia una plataforma SaaS multisucursal usada diariamente por 3 clientes, superando los S/ 5,5 millones en ventas registradas en producción.
   - Implementó inventario en tiempo real, caja, pagos mixtos, reservas, pedidos y reportes operativos con Next.js, TypeScript, Firebase/Firestore y Tailwind CSS.
   - Diseñó aislamiento multi-tenant por cuenta y control de accesos RBAC por roles y permisos.
   - Integró Venty, un asistente de IA con Firebase Genkit y modelos Gemini/DeepSeek, para consultar métricas comerciales y proponer acciones sujetas a permisos y confirmación explícita del usuario.

2. IMPREX EUROPE S.L. — Desarrollador Frontend | Septiembre 2025 – Septiembre 2026 · Remoto, España
   - Desarrolló durante un año la aplicación web comercial con React, Vite y TypeScript (clientes, catálogo, carrito, pedidos y visitas comerciales), llevando al navegador los flujos de la app móvil Kotlin.
   - Implementó simulación y creación de pedidos en SAP vía APIs corporativas, generación de payloads XML, validaciones de negocio y manejo de errores del ERP.
   - Integró el catálogo de Sales Layer (búsqueda, filtros, paginación), importación masiva desde Excel y flujos de pedidos múltiples.
   - Construyó el módulo de visitas comerciales con calendario, rutas, geolocalización, formularios dinámicos y reglas de surtido por cliente.
   - Optimizó consumo de APIs con peticiones en lote y pruebas automatizadas (Vitest) para formularios, visitas y payloads SAP.

3. Proyectos Freelance — Modernización Web | Desarrollador Frontend | Octubre 2026 – Noviembre 2026 · Remoto, Perú
   - Migró y modernizó dos sitios web de cliente desde prototipos iniciales a Astro con arquitectura estática de alto rendimiento y SEO técnico optimizado.

PROYECTOS DESTACADOS (OPEN SOURCE):
- Sumaq Uywa (https://github.com/Arcay322/Sumaq_Uywa): Sistema full-stack de gestión ganadera (reproducción, salud, alimentación, inventario, ventas y gastos) con React, TypeScript, Node.js, Express y PostgreSQL.
- Ticket World (https://github.com/Arcay322/Ticket_World): Plataforma de venta de entradas con Python, Django REST Framework, PostgreSQL, JavaScript, control de roles (admin, proveedor, cliente), Google Maps y pasarela de pago simulada.

STACK TÉCNICO:
- Frontend: React, Next.js, Astro, TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS, shadcn/ui.
- Backend y datos: Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase/Firestore, APIs REST.
- Integraciones: SAP, XML, Sales Layer.
- IA aplicada: Firebase Genkit, integración de LLMs (DeepSeek, Gemini), agentes con herramientas y validación de permisos.
- Calidad y tooling: Git, GitHub, Linux, Docker, Vercel, Postman, Vitest, Jest, React Testing Library, Playwright.`;

export function checkRateLimit(clientKey) {
  const now = Date.now();
  const key = String(clientKey || 'unknown');
  const existing = rateBuckets.get(key);
  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }
  if (existing.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - existing.windowStart)) / 1000) };
  }
  existing.count += 1;
  return { allowed: true };
}

export function sanitizeMessages(rawMessages) {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return { error: 'Messages array is required.' };
  }

  const cleaned = [];
  for (const item of rawMessages.slice(-MAX_HISTORY_MESSAGES)) {
    if (!item || typeof item !== 'object') continue;
    const role = item.role === 'assistant' ? 'assistant' : item.role === 'user' ? 'user' : null;
    if (!role) continue;
    const content = typeof item.content === 'string' ? item.content.trim() : '';
    if (!content) continue;
    cleaned.push({ role, content: content.slice(0, MAX_MESSAGE_CHARS) });
  }

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') {
    return { error: 'A valid user message is required.' };
  }

  return { messages: cleaned };
}

function buildLocalFallbackReply(userText, locale) {
  const q = userText.toLowerCase();
  const isEn = locale === 'en';

  if (/sap|imprex|erp|xml|sales layer/.test(q)) {
    return isEn
      ? 'At **IMPREX EUROPE S.L.** (Sep 2025 – Sep 2026, remote Spain), Arnie built the commercial web app in **React, Vite & TypeScript**—implementing **SAP** order simulation/creation via XML payloads, **Sales Layer** catalog search, Excel imports, geolocation visit workflows, and Vitest tests.\n\n_(Preview mode: configure `DEEPSEEK_API_KEY` to enable full DeepSeek conversational answers.)_'
      : 'En **IMPREX EUROPE S.L.** (Sep. 2025 – Sep. 2026, remoto España), Arnie desarrolló la app web comercial con **React, Vite y TypeScript**, integrando simulación y creación de pedidos en **SAP (XML)**, catálogo **Sales Layer**, importación Excel, visitas con geolocalización y pruebas con Vitest.\n\n_(Modo vista previa: agrega `DEEPSEEK_API_KEY` para activar respuestas conversacionales completas con DeepSeek.)_';
  }

  if (/ventify|pos|saas|venty|ia|ai|genkit|deepseek|gemini/.test(q)) {
    return isEn
      ? '**Ventify** (Oct 2024 – Present) is Arnie’s multi-branch SaaS POS built with **Next.js, TypeScript & Firebase**. It runs in production for **3 businesses** with over **S/ 5.5M in recorded sales**, multi-tenant isolation, RBAC, and **Venty**—an AI assistant using **Firebase Genkit + Gemini/DeepSeek** with confirmation-gated actions.\n\n_(Preview mode: configure `DEEPSEEK_API_KEY` to enable full DeepSeek answers.)_'
      : '**Ventify** (Oct. 2024 – Actualidad) es el SaaS POS multisucursal creado por Arnie con **Next.js, TypeScript y Firebase**. Opera en producción con **3 clientes** y más de **S/ 5,5 millones en ventas registradas**, aislamiento multi-tenant, RBAC y **Venty**, su asistente IA con **Firebase Genkit + Gemini/DeepSeek**.\n\n_(Modo vista previa: agrega `DEEPSEEK_API_KEY` para activar respuestas completas con DeepSeek.)_';
  }

  if (/stack|tech|tecnolog|disponib|availab|ingles|english|utp|contact|correo|email/.test(q)) {
    return isEn
      ? '**Stack:** React, Next.js, Astro, TypeScript, Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase, SAP/XML, and LLM integrations (DeepSeek/Gemini/Genkit).\n**Availability:** Immediate full-time (Lima or remote). Software Engineering at UTP (graduating Dec 2026) · Spanish native, English B1.\n**Contact:** arniecalderonayala@gmail.com · +51 918 793 956\n\n_(Preview mode: configure `DEEPSEEK_API_KEY` to enable live DeepSeek responses.)_'
      : '**Stack:** React, Next.js, Astro, TypeScript, Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase, SAP/XML e integración de LLMs (DeepSeek/Gemini/Genkit).\n**Disponibilidad:** Tiempo completo inmediata (Lima o remoto). Ing. de Software UTP (egreso Dic. 2026) · Español nativo, Inglés B1.\n**Contacto:** arniecalderonayala@gmail.com · +51 918 793 956\n\n_(Modo vista previa: agrega `DEEPSEEK_API_KEY` para activar DeepSeek en vivo.)_';
  }

  return isEn
    ? 'Arnie Calderón is a **Full-Stack Developer** in Lima (UTP Software Engineering, Dec 2026) available full-time. Highlights:\n- **Ventify:** Production multi-branch SaaS POS (**S/ 5.5M+ sales**, 3 clients, Next.js/Firebase + AI assistant Venty).\n- **IMPREX EUROPE:** 1 year building a **React/Vite + SAP XML** commercial platform for Spain.\n- **Open Source:** **Sumaq Uywa** (Node/PostgreSQL) & **Ticket World** (Django REST/PostgreSQL).\n\n_(Preview mode: configure `DEEPSEEK_API_KEY` to unlock live DeepSeek AI responses.)_'
    : 'Arnie Calderón es **Desarrollador Full-Stack** en Lima (Ing. de Software UTP, Dic. 2026) con disponibilidad completa inmediata. Destaca por:\n- **Ventify:** SaaS POS multisucursal en producción (**+S/ 5,5M en ventas**, 3 clientes, Next.js/Firebase + asistente IA Venty).\n- **IMPREX EUROPE:** 1 año desarrollando plataforma comercial **React/Vite + SAP XML** para España.\n- **Open Source:** **Sumaq Uywa** (Node/PostgreSQL) y **Ticket World** (Django REST/PostgreSQL).\n\n_(Modo vista previa: agrega `DEEPSEEK_API_KEY` para activar respuestas en vivo con DeepSeek.)_';
}

export async function generateChatReply({ messages, locale = 'es', apiKey, model = DEFAULT_MODEL }) {
  const validated = sanitizeMessages(messages);
  if (validated.error) {
    return { status: 400, body: { error: validated.error } };
  }

  const trimmedKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!trimmedKey) {
    const lastUser = validated.messages[validated.messages.length - 1].content;
    return {
      status: 200,
      body: {
        reply: buildLocalFallbackReply(lastUser, locale),
        mode: 'preview',
        provider: 'local-fallback',
      },
    };
  }

  const localeHint =
    locale === 'en'
      ? 'The visitor is browsing the English version of the portfolio; prefer English unless they write in Spanish.'
      : 'El visitante está navegando la versión en español del portafolio; responde en español salvo que escriba en inglés.';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${trimmedKey}`,
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        temperature: 0.4,
        max_tokens: 420,
        messages: [
          { role: 'system', content: `${ARNIE_SYSTEM_PROMPT}\n\n${localeHint}` },
          ...validated.messages,
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return {
        status: 502,
        body: {
          error: 'Upstream AI provider error.',
          detail: response.status === 401 ? 'Invalid DeepSeek API key.' : errText.slice(0, 160),
        },
      };
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return { status: 502, body: { error: 'Empty response from DeepSeek.' } };
    }

    return {
      status: 200,
      body: {
        reply,
        mode: 'live',
        provider: 'deepseek',
        model: data?.model || model || DEFAULT_MODEL,
      },
    };
  } catch (err) {
    const isAbort = err && err.name === 'AbortError';
    return {
      status: isAbort ? 504 : 502,
      body: { error: isAbort ? 'AI request timed out.' : 'Failed to reach DeepSeek API.' },
    };
  } finally {
    clearTimeout(timeout);
  }
}

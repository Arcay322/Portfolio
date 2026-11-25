const DATA = {
  es: {
    pageTitle: 'Arnie Calderón — Desarrollador Full-Stack',
    skip: 'Saltar al contenido',
    navMap: 'Mapa',
    navProjects: 'Proyectos',
    navExperience: 'Experiencia',
    navContact: 'Contacto',
    downloadCv: 'Descargar CV',
    cvHref: '/assets/cv/Arnie_Calderon_ES.pdf',
    langSwitchLabel: 'EN',
    langSwitchAria: 'Cambiar idioma a inglés',
    switchDark: 'Cambiar a modo oscuro',
    switchLight: 'Cambiar a modo claro',
    heroSub:
      'Desarrollador Full-Stack en Lima. Construyo productos SaaS en producción e integraciones empresariales con SAP.',
    ctaProjects: 'Ver proyectos',
    factAvailLabel: 'Disponibilidad',
    factAvailVal: 'Tiempo completo',
    factEduLabel: 'Formación',
    factEduVal: 'Ing. de Software UTP, Dic. 2026',
    factLangLabel: 'Idiomas',
    factLangVal: 'Español nativo, Inglés B1',
    atlasTitle: 'Mapa de trayectoria',
    atlasAlt:
      'Mapa topográfico estilo cartografía de Hyrule y costa andina con los proyectos de Arnie Calderón',
    discoveredSuffix: 'descubiertos',
    openFullCase: 'Abrir registro completo',
    readFullCase: 'Leer registro completo',
    projectsTitle: 'Proyectos seleccionados',
    expTitle: 'Experiencia y formación',
    stackTitle: 'Stack técnico',
    contactTitle: 'Contacto',
    contactLead:
      'Disponible para posiciones a tiempo completo en Frontend, Backend o Full-Stack, en Lima o remoto.',
    copyEmail: 'Copiar',
    copiedEmail: 'Correo copiado',
    copyError: 'No se pudo copiar',
    footerNote: 'HTML semántico, CSS moderno e ilustraciones inspiradas en Breath of the Wild.',
    specLabels: {
      category: 'Categoría',
      impact: 'Impacto',
      role: 'Rol',
    },
    modalLabels: {
      context: 'Contexto',
      contribution: 'Contribución',
      decisions: 'Decisiones técnicas',
      outcome: 'Resultado y alcance',
      close: 'Cerrar',
      prev: 'Anterior',
      next: 'Siguiente',
    },
    waypoints: {
      ventify: {
        point: [46, 54],
        hudCoords: "12°02'S 77°02'W · LIMA",
        category: 'SaaS POS en producción',
        title: 'Ventify — SaaS POS Multisucursal',
        role: 'Desarrollador Full-Stack (Producto SaaS)',
        dates: 'Octubre 2024 – Actualidad',
        coords: "12°02'S 77°02'W · Perú",
        metric: '+S/ 5,5 millones en ventas · 3 clientes',
        summary:
          'Evolucioné un POS a medida para INVERSIONES MAX PERU hacia una plataforma SaaS multisucursal con inventario en tiempo real, caja, aislamiento multi-tenant, RBAC y asistente IA Venty.',
        stack: 'Next.js · TypeScript · Firebase · Genkit · Tailwind CSS',
        extUrl: 'https://www.ventify.com.pe',
        extLabel: 'ventify.com.pe',
        context:
          'Nació para resolver el control de ventas, caja e inventario de un negocio con múltiples sucursales y escaló hacia una plataforma multi-cliente.',
        bullets: [
          'Inventario en tiempo real, caja, pagos mixtos, reservas, pedidos y reportes operativos con Next.js, TypeScript y Firebase.',
          'Aislamiento de datos por cuenta (multi-tenant) y control de accesos basado en roles y permisos (RBAC).',
          'Asistente Venty con Firebase Genkit y modelos Gemini/DeepSeek para consultas analíticas y acciones con confirmación del usuario.',
        ],
        decisions: [
          'Separar ventas, adelantos y movimientos de caja para mantener trazabilidad financiera real.',
          'Aislar cuentas y sucursales bajo reglas estrictas de permisos por rol.',
          'Exigir confirmación explícita antes de ejecutar cualquier acción comercial propuesta por la IA.',
        ],
        outcome:
          'Tres negocios operan diariamente sobre Ventify, superando los S/ 5,5 millones en ventas registradas en producción.',
        images: [
          '/assets/images/projects/ventify/Ventify_1.webp',
          '/assets/images/projects/ventify/Ventify_2.webp',
          '/assets/images/projects/ventify/Ventify_3.webp',
        ],
      },
      imprex: {
        point: [77, 28],
        hudCoords: "40°25'N 03°42'W · MADRID",
        category: 'Plataforma empresarial ERP',
        title: 'IMPREX EUROPE S.L. — Plataforma Comercial SAP',
        role: 'Desarrollador Frontend',
        dates: 'Septiembre 2025 – Septiembre 2026',
        coords: "40°25'N 03°42'W · Remoto, España",
        summary:
          'Desarrollé durante un año la aplicación web comercial en React y Vite para fuerza de ventas en España, integrando pedidos con SAP (XML) y catálogo Sales Layer.',
        stack: 'React · Vite · TypeScript · SAP XML · Sales Layer · Vitest',
        extUrl: '',
        extLabel: '',
        context:
          'El equipo en España necesitaba llevar al navegador los flujos de su aplicación móvil Kotlin manteniendo reglas de surtido y conexión directa con SAP.',
        bullets: [
          'Adapté al navegador los módulos de clientes, catálogo, carrito, pedidos y visitas comerciales con React y Vite.',
          'Implementé simulación y creación de pedidos en SAP vía APIs corporativas, generación de XML, validaciones y manejo de errores ERP.',
          'Integré catálogo Sales Layer, importación Excel, rutas con geolocalización y pruebas con Vitest en repositorio compartido.',
        ],
        decisions: [
          'Conservar paridad funcional con la app móvil Kotlin para evitar fricciones operativas.',
          'Agrupar peticiones en lote y eliminar consultas duplicadas para acelerar la carga comercial.',
          'Cubrir formularios, visitas y payloads XML de SAP con pruebas automatizadas.',
        ],
        outcome:
          'Plataforma web unificada conectada a backend Django y ERP SAP, desarrollada en colaboración continua con el equipo.',
        images: [],
        bandColumns: [
          [
            'Aplicación comercial React y Vite',
            'Clientes, catálogo, carrito, pedidos múltiples y módulo de visitas con calendario, rutas, geolocalización y reglas de surtido por cliente.',
          ],
          [
            'Integración ERP SAP y Sales Layer',
            'Simulación y creación de pedidos en SAP con generación XML, manejo de respuestas del ERP, catálogo Sales Layer e importación desde Excel.',
          ],
          [
            'Rendimiento y calidad en equipo',
            'Optimización mediante peticiones en lote, eliminación de llamadas duplicadas y pruebas automatizadas en repositorio compartido.',
          ],
        ],
      },
      astro: {
        point: [72, 72],
        hudCoords: "12°06'S 77°01'W · REMOTO",
        pinLabel: 'Modernización Astro',
        category: 'Sitios web estáticos',
        title: 'Modernización Web en Astro (2 clientes)',
        role: 'Desarrollador Frontend',
        dates: 'Octubre 2026 – Noviembre 2026',
        coords: "12°06'S 77°01'W · Remoto",
        summary:
          'Migré y modernicé dos sitios web de cliente desde prototipos iniciales a Astro, optimizando SEO técnico y guiando la puesta en marcha del despliegue en producción.',
        stack: 'Astro · TypeScript · Tailwind CSS · SEO Técnico',
        extUrl: '',
        extLabel: '',
        context:
          'Clientes con prototipos iniciales necesitaban sitios ligeros, bien estructurados para buscadores y listos para operar en dominio propio.',
        bullets: [
          'Migración de prototipos a interfaces responsivas con arquitectura estática orientada a velocidad.',
          'Optimización de estructura semántica, metadatos y tiempos de carga.',
          'Acompañamiento técnico al cliente hasta completar el despliegue en producción.',
        ],
        decisions: [
          'Adoptar Astro para entregar HTML estático limpio sin JavaScript innecesario.',
          'Definir jerarquía semántica y metadatos técnicos desde la base.',
        ],
        outcome: 'Dos sitios web modernizados en producción, rápidos en móvil y mantenibles.',
        images: [],
      },
      sumaq: {
        point: [28, 70],
        hudCoords: "13°09'S 74°13'W · AYACUCHO / LIMA",
        category: 'Full-Stack Node + SQL',
        title: 'Sumaq Uywa',
        role: 'Desarrollador Full-Stack',
        dates: '2024',
        coords: "13°09'S 74°13'W · Full-Stack SQL",
        summary:
          'Sistema full-stack de gestión ganadera con API REST en Node.js y Express, esquema relacional en PostgreSQL y dashboard operativo en React.',
        stack: 'React · TypeScript · Node.js · Express · PostgreSQL',
        extUrl: 'https://github.com/Arcay322/Sumaq_Uywa',
        extLabel: 'GitHub',
        context:
          'Las granjas necesitaban centralizar ciclos reproductivos, salud veterinaria, alimentación, inventario, ventas y gastos en una sola aplicación.',
        bullets: [
          'API REST en Node.js y Express desacoplada del cliente React con TypeScript.',
          'Modelo relacional en PostgreSQL para trazabilidad histórica de animales y movimientos.',
          'Dashboard operativo con indicadores productivos y económicos.',
        ],
        decisions: [
          'Separar la capa de servicios REST del frontend para facilitar mantenimiento.',
          'Aplicar integridad referencial estricta en PostgreSQL entre eventos, lotes y finanzas.',
        ],
        outcome:
          'Proyecto end-to-end que respalda el diseño de APIs en Node/Express y bases de datos SQL.',
        images: [
          '/assets/images/projects/sumaq-uywa/SumaqUywa_1.webp',
          '/assets/images/projects/sumaq-uywa/SumaqUywa_2.webp',
        ],
      },
      ticket: {
        point: [24, 32],
        hudCoords: "12°04'S 77°04'W · LIMA",
        category: 'Backend Python / Django',
        title: 'Ticket World',
        role: 'Desarrollador Full-Stack',
        dates: '2024',
        coords: "12°04'S 77°04'W · Python / Django",
        summary:
          'Plataforma de venta de entradas con API REST en Django, control de roles (administrador, proveedor y cliente), órdenes en PostgreSQL y Google Maps.',
        stack: 'Python · Django REST Framework · PostgreSQL · JavaScript',
        extUrl: 'https://github.com/Arcay322/Ticket_World',
        extLabel: 'GitHub',
        context:
          'Diseñada para gestionar publicación de eventos y compra de entradas con flujos diferenciados por rol de usuario.',
        bullets: [
          'Backend con Python y Django REST Framework conectado a PostgreSQL.',
          'Permisos por rol (administrador, proveedor y cliente) con gestión de órdenes.',
          'Integración de Google Maps y flujo completo de carrito con pasarela simulada.',
        ],
        decisions: [
          'Estructurar recursos y permisos de acceso directamente en Django REST Framework.',
          'Modelar órdenes y disponibilidad de entradas en PostgreSQL.',
        ],
        outcome:
          'Demostración sólida de desarrollo backend en Python, Django REST y modelado relacional.',
        images: [
          '/assets/images/projects/ticket-world/TicketWorld_1.webp',
          '/assets/images/projects/ticket-world/TicketWorld_2.webp',
        ],
      },
    },
    timelineRows: [
      {
        period: 'Oct 2024 – Actualidad',
        place: 'Perú',
        title: 'Ventify (Producto SaaS)',
        role: 'Desarrollador Full-Stack',
        bullets: [
          'Evolucioné un POS a medida hacia un SaaS multisucursal usado por 3 clientes (+S/ 5,5 millones en ventas registradas).',
          'Implementé inventario en tiempo real, caja, pagos mixtos, multi-tenant RBAC y el asistente IA Venty con Firebase Genkit.',
        ],
      },
      {
        period: 'Oct – Nov 2026',
        place: 'Remoto, Perú',
        title: 'Proyectos Freelance — Modernización Web',
        role: 'Desarrollador Frontend',
        bullets: [
          'Migré dos sitios web de cliente desde prototipos iniciales a Astro, optimizando SEO técnico y velocidad de carga.',
          'Guié al cliente en la configuración y puesta en marcha del despliegue en producción.',
        ],
      },
      {
        period: 'Sep 2025 – Sep 2026',
        place: 'Remoto, España',
        title: 'IMPREX EUROPE S.L.',
        role: 'Desarrollador Frontend',
        bullets: [
          'Desarrollé la aplicación web comercial en React y Vite adaptando flujos de la app móvil Kotlin.',
          'Implementé simulación y creación de pedidos en SAP (XML), catálogo Sales Layer, importación Excel, visitas con geolocalización y testing.',
        ],
      },
      {
        period: '2022 – Dic. 2026',
        place: 'Lima, Perú',
        title: 'Universidad Tecnológica del Perú (UTP)',
        role: 'Ingeniería de Software · Egreso previsto diciembre 2026',
        text: 'Español nativo · Inglés intermedio (B1) con lectura técnica fluida y comunicación en equipo.',
      },
    ],
    stackColumns: [
      ['Frontend', 'React, Next.js, Astro, TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS y shadcn/ui.'],
      ['Backend y datos', 'Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase/Firestore y APIs REST.'],
      ['Integraciones, pruebas e IA', 'SAP (XML), Sales Layer, Git, Docker, Linux, Vitest, Jest, Playwright, Firebase Genkit y LLMs (Gemini/DeepSeek).'],
    ],
  },
  en: {
    pageTitle: 'Arnie Calderón — Full-Stack Developer',
    skip: 'Skip to content',
    navMap: 'Atlas',
    navProjects: 'Projects',
    navExperience: 'Experience',
    navContact: 'Contact',
    downloadCv: 'Download CV',
    cvHref: '/assets/cv/Arnie_Calderon_EN.pdf',
    langSwitchLabel: 'ES',
    langSwitchAria: 'Switch language to Spanish',
    switchDark: 'Switch to dark mode',
    switchLight: 'Switch to light mode',
    heroSub:
      'Full-Stack Developer in Lima. I build production SaaS products and enterprise SAP integrations.',
    ctaProjects: 'View projects',
    factAvailLabel: 'Availability',
    factAvailVal: 'Full-time',
    factEduLabel: 'Education',
    factEduVal: 'Software Eng. UTP, Dec 2026',
    factLangLabel: 'Languages',
    factLangVal: 'Native Spanish, English B1',
    atlasTitle: 'Trajectory Atlas',
    atlasAlt:
      'Hyrule-inspired topographic relief map plotting Arnie Calderón’s projects across Peru and Spain',
    discoveredSuffix: 'discovered',
    openFullCase: 'Open full record',
    readFullCase: 'Read full record',
    projectsTitle: 'Selected projects',
    expTitle: 'Experience and education',
    stackTitle: 'Technical stack',
    contactTitle: 'Contact',
    contactLead:
      'Available for full-time Frontend, Backend, or Full-Stack engineering roles, remote or in Lima.',
    copyEmail: 'Copy',
    copiedEmail: 'Email copied',
    copyError: 'Could not copy',
    footerNote: 'Semantic HTML, modern CSS, and Breath of the Wild-inspired artwork.',
    specLabels: {
      category: 'Category',
      impact: 'Impact',
      role: 'Role',
    },
    modalLabels: {
      context: 'Context',
      contribution: 'Contribution',
      decisions: 'Technical decisions',
      outcome: 'Outcome & scope',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
    },
    waypoints: {
      ventify: {
        point: [46, 54],
        hudCoords: "12°02'S 77°02'W · LIMA",
        category: 'Production SaaS POS',
        title: 'Ventify — Multi-Branch SaaS POS',
        role: 'Full-Stack Developer (SaaS Product)',
        dates: 'October 2024 – Present',
        coords: "12°02'S 77°02'W · Peru",
        metric: 'PEN 5.5M+ recorded sales · 3 clients',
        summary:
          'Evolved a custom POS for INVERSIONES MAX PERU into a multi-branch SaaS featuring real-time inventory, multi-tenant isolation, RBAC, and the Venty AI assistant.',
        stack: 'Next.js · TypeScript · Firebase · Genkit · Tailwind CSS',
        extUrl: 'https://www.ventify.com.pe',
        extLabel: 'ventify.com.pe',
        context:
          'Started to solve sales, cash register, and inventory control for a multi-branch business, then scaled into a multi-client platform.',
        bullets: [
          'Real-time inventory, cash register, split payments, reservations, orders, and reporting with Next.js, TypeScript, and Firebase.',
          'Multi-tenant data isolation and role- and permission-based access control (RBAC).',
          'Venty AI assistant with Firebase Genkit and Gemini/DeepSeek models for analytical queries and user-confirmed actions.',
        ],
        decisions: [
          'Separated sales, deposits, and register movements to keep financial tracking accurate.',
          'Isolated tenant and branch data behind strict role-based permission rules.',
          'Required explicit user confirmation before executing AI-proposed actions.',
        ],
        outcome:
          'Three businesses run daily operations on Ventify, surpassing PEN 5.5 million in recorded production sales.',
        images: [
          '/assets/images/projects/ventify/Ventify_1.webp',
          '/assets/images/projects/ventify/Ventify_2.webp',
          '/assets/images/projects/ventify/Ventify_3.webp',
        ],
      },
      imprex: {
        point: [77, 28],
        hudCoords: "40°25'N 03°42'W · MADRID",
        category: 'Enterprise ERP Platform',
        title: 'IMPREX EUROPE S.L. — SAP Sales Platform',
        role: 'Frontend Developer',
        dates: 'September 2025 – September 2026',
        coords: "40°25'N 03°42'W · Remote, Spain",
        summary:
          'Built the commercial web app in React and Vite for a sales team in Spain, integrating SAP orders (XML) and the Sales Layer catalog.',
        stack: 'React · Vite · TypeScript · SAP XML · Sales Layer · Vitest',
        extUrl: '',
        extLabel: '',
        context:
          'The Spanish sales team needed browser parity for their Kotlin mobile workflows while preserving assortment rules and ERP sync.',
        bullets: [
          'Adapted customer, catalog, cart, order, and visit modules to the browser with React and Vite.',
          'Implemented SAP order simulation and creation via corporate APIs, XML payload generation, and ERP error handling.',
          'Integrated Sales Layer catalog, Excel imports, geolocation routes, and Vitest suites in a shared team repository.',
        ],
        decisions: [
          'Maintained functional parity with the Kotlin app across field workflows.',
          'Batched API calls and eliminated duplicate requests to speed up catalog and customer loading.',
          'Covered forms, visits, and SAP XML payloads with automated tests.',
        ],
        outcome:
          'Unified commercial web platform connected to Django and SAP services, built with the engineering team in Spain.',
        images: [],
        bandColumns: [
          [
            'React & Vite sales platform',
            'Customer management, catalog, cart, multi-order workflows, and sales visits with calendars, routes, geolocation, and assortment rules.',
          ],
          [
            'SAP ERP & Sales Layer integration',
            'SAP order simulation and creation with XML generation, ERP error handling, Sales Layer catalog sync, and Excel product imports.',
          ],
          [
            'Performance & shared testing',
            'Batch fetching optimization, duplicate-request elimination, and automated tests for forms, visits, and SAP payloads.',
          ],
        ],
      },
      astro: {
        point: [72, 72],
        hudCoords: "12°06'S 77°01'W · REMOTE",
        pinLabel: 'Astro Modernization',
        category: 'Static Web Architecture',
        title: 'Web Modernization in Astro (2 clients)',
        role: 'Frontend Developer',
        dates: 'October 2026 – November 2026',
        coords: "12°06'S 77°01'W · Remote",
        summary:
          'Migrated and modernized two client websites from early prototypes to Astro, optimizing technical SEO and guiding production deployment.',
        stack: 'Astro · TypeScript · Tailwind CSS · Technical SEO',
        extUrl: '',
        extLabel: '',
        context:
          'Clients with initial prototypes needed fast, search-ready websites running cleanly in production.',
        bullets: [
          'Migrated prototypes to responsive static architectures built for speed.',
          'Optimized semantic HTML structure, metadata, and load performance.',
          'Guided clients through production deployment configuration.',
        ],
        decisions: [
          'Chose Astro to deliver clean static HTML without unnecessary client JavaScript.',
          'Structured semantic headings and technical metadata from the start.',
        ],
        outcome: 'Two modernized client sites live in production and fast on mobile.',
        images: [],
      },
      sumaq: {
        point: [28, 70],
        hudCoords: "13°09'S 74°13'W · AYACUCHO / LIMA",
        category: 'Full-Stack Node + SQL',
        title: 'Sumaq Uywa',
        role: 'Full-Stack Developer',
        dates: '2024',
        coords: "13°09'S 74°13'W · Full-Stack SQL",
        summary:
          'Full-stack farm management system with a Node.js/Express REST API, relational PostgreSQL schema, and operational metrics dashboard.',
        stack: 'React · TypeScript · Node.js · Express · PostgreSQL',
        extUrl: 'https://github.com/Arcay322/Sumaq_Uywa',
        extLabel: 'GitHub',
        context:
          'Farms needed to centralize breeding cycles, veterinary health, feeding, inventory, sales, and expenses in one web application.',
        bullets: [
          'Decoupled Node.js/Express REST API paired with a React + TypeScript frontend.',
          'Relational PostgreSQL schema tracking animal lifecycle and financial records.',
          'Operational dashboard for daily metrics.',
        ],
        decisions: [
          'Separated REST services from the frontend client for clean maintenance.',
          'Enforced strict referential integrity in PostgreSQL across batches and events.',
        ],
        outcome: 'End-to-end project demonstrating Node/Express API design and SQL modeling.',
        images: [
          '/assets/images/projects/sumaq-uywa/SumaqUywa_1.webp',
          '/assets/images/projects/sumaq-uywa/SumaqUywa_2.webp',
        ],
      },
      ticket: {
        point: [24, 32],
        hudCoords: "12°04'S 77°04'W · LIMA",
        category: 'Python / Django Backend',
        title: 'Ticket World',
        role: 'Full-Stack Developer',
        dates: '2024',
        coords: "12°04'S 77°04'W · Python / Django",
        summary:
          'Event ticketing platform with a Django REST API, role-based access (admin, vendor, customer), PostgreSQL order management, and Google Maps.',
        stack: 'Python · Django REST Framework · PostgreSQL · JavaScript',
        extUrl: 'https://github.com/Arcay322/Ticket_World',
        extLabel: 'GitHub',
        context:
          'Built to handle event publishing and ticket sales with separate permissions per user role.',
        bullets: [
          'Backend built with Python and Django REST Framework backed by PostgreSQL.',
          'Role-scoped permissions for administrators, vendors, and customers.',
          'Google Maps venue pins plus shopping cart and simulated payment checkout.',
        ],
        decisions: [
          'Structured REST resources and access permissions directly in Django REST Framework.',
          'Modeled orders and ticket availability in PostgreSQL.',
        ],
        outcome:
          'Strong Python backend showcase using Django REST Framework and relational databases.',
        images: [
          '/assets/images/projects/ticket-world/TicketWorld_1.webp',
          '/assets/images/projects/ticket-world/TicketWorld_2.webp',
        ],
      },
    },
    timelineRows: [
      {
        period: 'Oct 2024 – Present',
        place: 'Peru',
        title: 'Ventify (SaaS Product)',
        role: 'Full-Stack Developer',
        bullets: [
          'Evolved a custom POS into a multi-branch SaaS used by 3 clients (PEN 5.5M+ in recorded sales).',
          'Built real-time inventory, cash register, split payments, multi-tenant RBAC, and the Venty AI assistant with Firebase Genkit.',
        ],
      },
      {
        period: 'Oct – Nov 2026',
        place: 'Remote, Peru',
        title: 'Freelance Projects — Web Modernization',
        role: 'Frontend Developer',
        bullets: [
          'Migrated two client websites from prototypes to Astro, improving technical SEO and load speed.',
          'Guided production deployment setup and launch.',
        ],
      },
      {
        period: 'Sep 2025 – Sep 2026',
        place: 'Remote, Spain',
        title: 'IMPREX EUROPE S.L.',
        role: 'Frontend Developer',
        bullets: [
          'Built the commercial web platform in React and Vite adapting Kotlin mobile workflows.',
          'Implemented SAP XML orders, Sales Layer catalog, Excel imports, geolocation visits, and automated tests.',
        ],
      },
      {
        period: '2022 – Dec 2026',
        place: 'Lima, Peru',
        title: 'Universidad Tecnológica del Perú (UTP)',
        role: 'Software Engineering · Expected graduation December 2026',
        text: 'Native Spanish · Intermediate English (B1) with fluent technical reading and team communication.',
      },
    ],
    stackColumns: [
      ['Frontend', 'React, Next.js, Astro, TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS, and shadcn/ui.'],
      ['Backend & data', 'Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase/Firestore, and REST APIs.'],
      ['Integrations, testing & AI', 'SAP (XML), Sales Layer, Git, Docker, Linux, Vitest, Jest, Playwright, Firebase Genkit, and LLMs (Gemini/DeepSeek).'],
    ],
  },
};

const WAYPOINT_ORDER = ['ventify', 'imprex', 'astro', 'sumaq', 'ticket'];
const visitedWaypoints = new Set(['ventify']);

let currentLocale = 'es';
let activeWaypoint = 'ventify';
let activeDialogId = null;
let galleryIndex = 0;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const dialog = $('#case-dialog');
const dialogTitle = $('#dialog-title');
const dialogMeta = $('#dialog-meta');
const dialogBody = $('#dialog-body');
const dialogClose = $('#dialog-close');

let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return Boolean(window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay());
}

async function closeTopLayer(element) {
  if (!element.open) return;
  if (!supportsTopLayerExit()) {
    element.setAttribute('data-closing', '');
    const animations = element.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    }
    if (!element.hasAttribute('data-closing')) return;
    element.removeAttribute('data-closing');
  }
  element.close();
}

// Fallback para navegadores sin closedby="any"
if (dialog && !('closedBy' in HTMLDialogElement.prototype)) {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isDialogContent =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (isDialogContent) return;
    closeTopLayer(dialog);
  });
}

dialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeTopLayer(dialog);
});

dialogClose?.addEventListener('click', () => closeTopLayer(dialog));

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[ch]);
}

function renderAtlasReadout() {
  const dict = DATA[currentLocale];
  const wp = dict.waypoints[activeWaypoint];
  const origin = dict.waypoints.ventify.point;

  const routeLine = $('#active-route-line');
  if (routeLine) {
    const [tx, ty] = activeWaypoint === 'ventify' ? dict.waypoints.imprex.point : wp.point;
    routeLine.setAttribute('x1', String(origin[0]));
    routeLine.setAttribute('y1', String(origin[1]));
    routeLine.setAttribute('x2', String(tx));
    routeLine.setAttribute('y2', String(ty));
  }

  $$('.map-pin').forEach((pin) => {
    const id = pin.dataset.waypoint;
    const selected = id === activeWaypoint;
    pin.classList.toggle('is-active', selected);
    pin.classList.toggle('is-visited', visitedWaypoints.has(id));
    pin.setAttribute('aria-pressed', String(selected));
  });

  const progress = $('#map-progress');
  if (progress) {
    progress.textContent = `${visitedWaypoints.size} / ${WAYPOINT_ORDER.length} ${dict.discoveredSuffix}`;
  }

  const hudCoords = $('#map-hud-coords');
  if (hudCoords && wp.hudCoords) {
    hudCoords.textContent = wp.hudCoords;
  }

  $('#readout-title').textContent = wp.title;
  $('#readout-role').textContent = wp.role;
  $('#readout-meta').textContent = `${wp.dates} · ${wp.coords}`;
  $('#readout-text').textContent = wp.summary;
  $('#readout-stack').textContent = wp.stack;

  const ext = $('#readout-ext');
  if (wp.extUrl) {
    ext.hidden = false;
    ext.href = wp.extUrl;
    $('#readout-ext-label').textContent = wp.extLabel;
  } else {
    ext.hidden = true;
  }
}

function renderProjectsShowcase() {
  const dict = DATA[currentLocale];
  const ventify = dict.waypoints.ventify;
  const imprex = dict.waypoints.imprex;
  const sumaq = dict.waypoints.sumaq;
  const ticket = dict.waypoints.ticket;
  const specs = dict.specLabels;

  const pairCard = (id, p) => `
    <article class="project-pair-item">
      <div class="compendium-frame">
        <div class="compendium-frame-inner">
          <img src="${p.images[0]}" alt="${escapeHtml(p.title)}" loading="lazy" decoding="async" />
        </div>
      </div>
      <span class="tabular-meta">${escapeHtml(p.dates)} · ${escapeHtml(p.category)}</span>
      <h3>${escapeHtml(p.title)}</h3>
      <p class="project-desc">${escapeHtml(p.summary)}</p>
      <p class="project-stack">${escapeHtml(p.stack)}</p>
      <div class="project-actions">
        <button type="button" class="btn-outline" data-open-case="${id}">${escapeHtml(dict.readFullCase)}</button>
        <a class="link-quiet" href="${p.extUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.extLabel)} ↗</a>
      </div>
    </article>
  `;

  $('#projects-showcase').innerHTML = `
    <article class="project-featured">
      <div class="compendium-frame">
        <div class="compendium-frame-inner">
          <img src="${ventify.images[0]}" alt="${escapeHtml(ventify.title)}" loading="lazy" decoding="async" />
        </div>
      </div>
      <div class="project-copy">
        <span class="tabular-meta">${escapeHtml(ventify.dates)}</span>
        <h3>${escapeHtml(ventify.title)}</h3>
        <dl class="compendium-specs">
          <div><dt>${escapeHtml(specs.category)}</dt><dd>${escapeHtml(ventify.category)}</dd></div>
          <div><dt>${escapeHtml(specs.impact)}</dt><dd>${escapeHtml(ventify.metric)}</dd></div>
          <div><dt>${escapeHtml(specs.role)}</dt><dd>${escapeHtml(ventify.role)}</dd></div>
        </dl>
        <p class="project-desc">${escapeHtml(ventify.summary)}</p>
        <p class="project-stack">${escapeHtml(ventify.stack)}</p>
        <div class="project-actions">
          <button type="button" class="btn-primary" data-open-case="ventify">${escapeHtml(dict.readFullCase)}</button>
          <a class="link-quiet" href="${ventify.extUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(ventify.extLabel)} ↗</a>
        </div>
      </div>
    </article>

    <article class="project-band">
      <div class="project-band-head">
        <div>
          <span class="tabular-meta">${escapeHtml(imprex.dates)} · ${escapeHtml(imprex.category)}</span>
          <h3>${escapeHtml(imprex.title)}</h3>
        </div>
        <button type="button" class="btn-outline" data-open-case="imprex">${escapeHtml(dict.readFullCase)}</button>
      </div>
      <div class="project-band-cols">
        ${imprex.bandColumns
          .map(
            ([head, text]) => `
          <div>
            <h4>${escapeHtml(head)}</h4>
            <p>${escapeHtml(text)}</p>
          </div>
        `
          )
          .join('')}
      </div>
      <p class="project-stack">${escapeHtml(imprex.stack)}</p>
    </article>

    <div class="project-pair">
      ${pairCard('sumaq', sumaq)}
      ${pairCard('ticket', ticket)}
    </div>
  `;

  $$('[data-open-case]').forEach((btn) => {
    btn.addEventListener('click', () => openCaseDialog(btn.dataset.openCase));
  });
}

function renderExperienceAndStack() {
  const dict = DATA[currentLocale];

  $('#experience-rows').innerHTML = dict.timelineRows
    .map(
      (row) => `
      <article class="exp-row">
        <div class="exp-period">
          <span class="tabular-meta">${escapeHtml(row.period)}</span>
          <span class="tabular-meta">${escapeHtml(row.place)}</span>
        </div>
        <div class="exp-content">
          <h3>${escapeHtml(row.title)}</h3>
          <p class="exp-role">${escapeHtml(row.role)}</p>
          ${
            row.bullets
              ? `<ul>${row.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
              : `<p>${escapeHtml(row.text)}</p>`
          }
        </div>
      </article>
    `
    )
    .join('');

  $('#stack-list').innerHTML = dict.stackColumns
    .map(
      ([label, desc]) => `
      <div>
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(desc)}</dd>
      </div>
    `
    )
    .join('');
}

function renderDialogBody(id) {
  const dict = DATA[currentLocale];
  const p = dict.waypoints[id];
  const labels = dict.modalLabels;

  dialogMeta.textContent = `${p.category} · ${p.dates} · ${p.coords}`;
  dialogTitle.textContent = p.title;
  dialogClose.setAttribute('aria-label', labels.close);

  const galleryHtml = p.images.length
    ? `
      <div class="dialog-gallery">
        <div class="dialog-stage">
          <img id="dialog-main-img" src="${p.images[galleryIndex]}" alt="${escapeHtml(p.title)}" />
        </div>
        <div class="dialog-gallery-bar">
          <div class="dialog-thumbs">
            ${p.images
              .map(
                (src, idx) => `
              <button type="button" class="dialog-thumb" data-thumb-idx="${idx}" aria-current="${idx === galleryIndex ? 'true' : 'false'}">
                <img src="${src}" alt="${escapeHtml(p.title)} ${idx + 1}" />
              </button>
            `
              )
              .join('')}
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button type="button" class="btn-outline" id="gallery-prev">${escapeHtml(labels.prev)}</button>
            <button type="button" class="btn-outline" id="gallery-next">${escapeHtml(labels.next)}</button>
          </div>
        </div>
      </div>
    `
    : '';

  const extLink = p.extUrl
    ? `<a class="btn-primary" href="${p.extUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.extLabel)} ↗</a>`
    : '';

  dialogBody.innerHTML = `
    ${galleryHtml}
    <p style="margin:0;">${escapeHtml(p.summary)}</p>
    <div class="dialog-columns">
      <div class="dialog-section">
        <h3>${escapeHtml(labels.context)}</h3>
        <p>${escapeHtml(p.context)}</p>
      </div>
      <div class="dialog-section">
        <h3>${escapeHtml(labels.outcome)}</h3>
        <p>${escapeHtml(p.outcome)}</p>
      </div>
      <div class="dialog-section">
        <h3>${escapeHtml(labels.contribution)}</h3>
        <ul>${p.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
      </div>
      <div class="dialog-section">
        <h3>${escapeHtml(labels.decisions)}</h3>
        <ul>${p.decisions.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="dialog-footer">
      <span class="project-stack" style="margin:0;">${escapeHtml(p.stack)}</span>
      <div style="display:flex;gap:0.75rem;align-items:center;">
        ${extLink}
        <button type="button" class="btn-outline" id="dialog-footer-close">${escapeHtml(labels.close)}</button>
      </div>
    </div>
  `;

  $('#dialog-footer-close')?.addEventListener('click', () => closeTopLayer(dialog));

  if (p.images.length) {
    const updateGallery = (nextIdx) => {
      galleryIndex = (nextIdx + p.images.length) % p.images.length;
      $('#dialog-main-img').src = p.images[galleryIndex];
      $$('[data-thumb-idx]').forEach((thumb, idx) => {
        thumb.setAttribute('aria-current', idx === galleryIndex ? 'true' : 'false');
      });
    };
    $('#gallery-prev')?.addEventListener('click', () => updateGallery(galleryIndex - 1));
    $('#gallery-next')?.addEventListener('click', () => updateGallery(galleryIndex + 1));
    $$('[data-thumb-idx]').forEach((thumb) => {
      thumb.addEventListener('click', () => updateGallery(Number(thumb.dataset.thumbIdx)));
    });
  }
}

function openCaseDialog(id) {
  activeDialogId = id;
  galleryIndex = 0;
  renderDialogBody(id);
  dialog.removeAttribute('data-closing');
  if (!dialog.open) dialog.showModal();
  dialogBody.scrollTop = 0;
}

function applyLocale(locale) {
  currentLocale = locale;
  const dict = DATA[locale];
  document.documentElement.lang = locale;
  document.title = dict.pageTitle;

  $$('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  const plate = $('.atlas-plate');
  if (plate) plate.alt = dict.atlasAlt;

  const astroPin = $('[data-wp-pin="astro"]');
  if (astroPin) astroPin.textContent = dict.waypoints.astro.pinLabel;

  $('#lang-toggle').textContent = dict.langSwitchLabel;
  $('#lang-toggle').setAttribute('aria-label', dict.langSwitchAria);
  $('#header-cv-link').href = dict.cvHref;
  $('#hero-cv-link').href = dict.cvHref;
  $('#footer-cv-link').href = dict.cvHref;

  renderAtlasReadout();
  renderProjectsShowcase();
  renderExperienceAndStack();

  if (dialog?.open && activeDialogId) {
    renderDialogBody(activeDialogId);
  }
}

function selectWaypoint(id) {
  if (!DATA[currentLocale].waypoints[id]) return;
  visitedWaypoints.add(id);
  activeWaypoint = id;
  renderAtlasReadout();
}

const colorSchemeMeta = $('meta[name="color-scheme"]');
const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredScheme() {
  try {
    const val = localStorage.getItem('color-scheme');
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
}

function syncMetaFromStorage() {
  if (!colorSchemeMeta) return;
  colorSchemeMeta.content = getStoredScheme() ?? 'light dark';
}

function toggleColorScheme() {
  if (!colorSchemeMeta) return;
  const stored = getStoredScheme();
  const isCurrentlyDark = stored ? stored === 'dark' : systemDarkQuery.matches;
  const target = isCurrentlyDark ? 'light' : 'dark';
  const systemScheme = systemDarkQuery.matches ? 'dark' : 'light';

  if (target === systemScheme) {
    try {
      localStorage.removeItem('color-scheme');
    } catch {}
    colorSchemeMeta.content = 'light dark';
  } else {
    try {
      localStorage.setItem('color-scheme', target);
    } catch {}
    colorSchemeMeta.content = target;
  }
}

function initInteractions() {
  syncMetaFromStorage();
  window.addEventListener('storage', (event) => {
    if (event.key === 'color-scheme') syncMetaFromStorage();
  });

  $('#theme-toggle')?.addEventListener('click', toggleColorScheme);

  $$('.map-pin').forEach((pin) => {
    pin.addEventListener('click', () => selectWaypoint(pin.dataset.waypoint));
    pin.addEventListener('keydown', (event) => {
      const idx = WAYPOINT_ORDER.indexOf(pin.dataset.waypoint);
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const nextId = WAYPOINT_ORDER[(idx + 1) % WAYPOINT_ORDER.length];
        selectWaypoint(nextId);
        $(`[data-waypoint="${nextId}"]`)?.focus();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prevId = WAYPOINT_ORDER[(idx - 1 + WAYPOINT_ORDER.length) % WAYPOINT_ORDER.length];
        selectWaypoint(prevId);
        $(`[data-waypoint="${prevId}"]`)?.focus();
      }
    });
  });

  $('#readout-open')?.addEventListener('click', () => openCaseDialog(activeWaypoint));

  $('#lang-toggle')?.addEventListener('click', () => {
    applyLocale(currentLocale === 'es' ? 'en' : 'es');
  });

  $('#copy-email')?.addEventListener('click', async () => {
    const status = $('#copy-status');
    try {
      await navigator.clipboard.writeText('arniecalderonayala@gmail.com');
      status.textContent = DATA[currentLocale].copiedEmail;
    } catch {
      status.textContent = DATA[currentLocale].copyError;
    }
  });
}

applyLocale(document.documentElement.lang === 'en' ? 'en' : 'es');
initInteractions();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        const worker = registration.active || registration.waiting || registration.installing;
        if (
          worker &&
          new URL(worker.scriptURL).origin === location.origin &&
          new URL(worker.scriptURL).pathname === '/sw.js'
        ) {
          registration.unregister();
        }
      });
    })
    .catch(() => {});
}

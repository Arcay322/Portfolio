import { Project } from "@/types/project"

export const getProjects = (t: (key: string) => string): Project[] => [
  {
    title: t('items.ticket_world.title'),
    description: t('items.ticket_world.description'),
    image: "/images/projects/ticket-world/TicketWorld_1.webp",
    tags: ["Python", "Django", "PostgreSQL", "JavaScript", "HTML/CSS"],
    liveUrl: "https://ticket-world.onrender.com",
    githubUrl: "https://github.com/Arcay322/Ticket_World",
    featured: true,
    isNew: false,
    date: "2024-09-15",
    // Multimedia gallery - cambia el número 3 por cuantas imágenes tengas
    media: Array.from({ length: 3 }, (_, i) => ({
      type: "image" as const,
      src: `/images/projects/ticket-world/TicketWorld_${i + 1}.webp`,
      alt: `Ticket World - Captura ${i + 1}`,
    })),
    relatedProjects: ["sumaq-uywa"],
    longDescription: t('items.ticket_world.long_description'),
    features: [
      t('items.ticket_world.features.auth'),
      t('items.ticket_world.features.admin'),
      t('items.ticket_world.features.metrics'),
      t('items.ticket_world.features.maps'),
      t('items.ticket_world.features.payments'),
      t('items.ticket_world.features.events'),
      t('items.ticket_world.features.cart'),
      t('items.ticket_world.features.responsive'),
    ],
    challenges: [
      t('items.ticket_world.challenges.roles'),
      t('items.ticket_world.challenges.maps'),
      t('items.ticket_world.challenges.queries'),
      t('items.ticket_world.challenges.architecture'),
    ],
  },
  {
    title: t('items.sumaq_uywa.title'),
    description: t('items.sumaq_uywa.description'),
    image: "/images/projects/sumaq-uywa/SumaqUywa_1.webp",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://sumaq-uywa-fontend.onrender.com",
    githubUrl: "https://github.com/Arcay322/Granja_cuyes",
    featured: true,
    isNew: true,
    date: "2024-10-01",
    // Multimedia gallery - cambia el número 9 por cuantas imágenes tengas
    media: Array.from({ length: 9 }, (_, i) => ({
      type: "image" as const,
      src: `/images/projects/sumaq-uywa/SumaqUywa_${i + 1}.webp`,
      alt: `Sumaq Uywa - Captura ${i + 1}`,
    })),
    relatedProjects: ["ticket-world"],
    longDescription: t('items.sumaq_uywa.long_description'),
    features: [
      t('items.sumaq_uywa.features.dashboard'),
      t('items.sumaq_uywa.features.reproduction'),
      t('items.sumaq_uywa.features.health'),
      t('items.sumaq_uywa.features.feeding'),
      t('items.sumaq_uywa.features.sales'),
      t('items.sumaq_uywa.features.expenses'),
      t('items.sumaq_uywa.features.notifications'),
      t('items.sumaq_uywa.features.reports'),
      t('items.sumaq_uywa.features.responsive'),
    ],
    challenges: [
      t('items.sumaq_uywa.challenges.database'),
      t('items.sumaq_uywa.challenges.notifications'),
      t('items.sumaq_uywa.challenges.performance'),
      t('items.sumaq_uywa.challenges.charts'),
    ],
  },
  {
    title: t('items.ventify.title'),
    description: t('items.ventify.description'),
    image: "/images/projects/ventify/Ventify_1.webp",
    tags: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "React"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
    isNew: true,
    inProduction: true,
    date: "2025-01-01",
    // Multimedia gallery - cambia el número 12 por cuantas imágenes tengas
    media: Array.from({ length: 12 }, (_, i) => ({
      type: "image" as const,
      src: `/images/projects/ventify/Ventify_${i + 1}.webp`,
      alt: `Ventify - Captura ${i + 1}`,
    })),
    relatedProjects: ["ticket-world", "sumaq-uywa"],
    longDescription: t('items.ventify.long_description'),
    features: [
      t('items.ventify.features.multibranch'),
      t('items.ventify.features.realtime'),
      t('items.ventify.features.reservations'),
      t('items.ventify.features.custom_orders'),
      t('items.ventify.features.cash_control'),
      t('items.ventify.features.permissions'),
      t('items.ventify.features.reports'),
      t('items.ventify.features.payments'),
      t('items.ventify.features.warehouses'),
      t('items.ventify.features.alerts'),
      t('items.ventify.features.responsive'),
    ],
    challenges: [
      t('items.ventify.challenges.realtime_sync'),
      t('items.ventify.challenges.complex_permissions'),
      t('items.ventify.challenges.concurrent_access'),
      t('items.ventify.challenges.scalability'),
      t('items.ventify.challenges.offline_support'),
      t('items.ventify.challenges.performance'),
    ],
  },
];

// Legacy export for backward compatibility - will be removed once all components are updated
export const projects = getProjects((key: string) => {
  // This is a temporary fallback that returns Spanish text
  // Components should use getProjects(t) instead
  const fallbackTranslations: Record<string, string> = {
    'items.ticket_world.title': 'Ticket World',
    'items.ticket_world.description': 'Plataforma web para la venta de tickets de eventos. Incluye roles de usuario (admin, proveedor, cliente), panel de métricas, integración con Google Maps y un sistema de pago simulado.',
    'items.ticket_world.media.main': 'Ticket World - Vista principal',
    'items.ticket_world.media.dashboard': 'Ticket World - Dashboard de métricas',
    'items.ticket_world.media.map': 'Ticket World - Mapa de eventos',
    'items.ticket_world.long_description': `
      Ticket World es una plataforma completa de comercio electrónico especializada en la venta de tickets para eventos. 
      El proyecto incluye un sistema robusto de roles de usuario que permite diferentes niveles de acceso y funcionalidades.
      
      Características Principales:
      - Sistema de Roles: Admin, Proveedor y Cliente con permisos específicos
      - Panel de Métricas: Dashboard interactivo con estadísticas en tiempo real
      - Integración con Google Maps: Visualización de ubicaciones de eventos
      - Sistema de Pagos: Simulación de pasarela de pagos
      - Gestión de Eventos: CRUD completo de eventos y categorías
      - Carrito de Compras: Sistema de compras con múltiples items
      
      Tecnologías Utilizadas:
      - Backend: Django + Django REST Framework
      - Base de Datos: PostgreSQL
      - Frontend: JavaScript, HTML5, CSS3
      - APIs: Google Maps API
    `,
    'items.ticket_world.features.auth': 'Autenticación y autorización de usuarios',
    'items.ticket_world.features.admin': 'Panel de administración personalizado',
    'items.ticket_world.features.metrics': 'Dashboard con métricas y estadísticas',
    'items.ticket_world.features.maps': 'Integración con Google Maps',
    'items.ticket_world.features.payments': 'Sistema de pagos simulado',
    'items.ticket_world.features.events': 'Gestión de eventos y categorías',
    'items.ticket_world.features.cart': 'Carrito de compras',
    'items.ticket_world.features.responsive': 'Diseño responsive',
    'items.ticket_world.challenges.roles': 'Implementación de un sistema de roles robusto',
    'items.ticket_world.challenges.maps': 'Integración con API de Google Maps',
    'items.ticket_world.challenges.queries': 'Optimización de queries de base de datos',
    'items.ticket_world.challenges.architecture': 'Diseño de arquitectura escalable',
    'items.sumaq_uywa.title': 'Sumaq Uywa',
    'items.sumaq_uywa.description': 'Aplicación para la administración de una granja, con dashboard y módulos de gestión para reproducción, salud, alimentación, ventas y gastos. Incluye un sistema de notificaciones para optimizar la producción.',
    'items.sumaq_uywa.media.dashboard': 'Sumaq Uywa - Dashboard principal',
    'items.sumaq_uywa.media.reproduction': 'Sumaq Uywa - Módulo de reproducción',
    'items.sumaq_uywa.media.notifications': 'Sumaq Uywa - Sistema de notificaciones',
    'items.sumaq_uywa.long_description': `
      Sumaq Uywa es una aplicación integral de gestión para granjas, diseñada específicamente para optimizar 
      la administración de la reproducción, salud, alimentación, ventas y gastos de animales de granja.
      
      Características Principales:
      - Dashboard Interactivo: Visualización de métricas clave de la granja
      - Gestión de Reproducción: Control de ciclos reproductivos y genealogía
      - Módulo de Salud: Seguimiento médico y veterinario
      - Control de Alimentación: Registro de dietas y consumo
      - Gestión de Ventas: Sistema completo de ventas y clientes
      - Control de Gastos: Seguimiento detallado de costos operativos
      - Sistema de Notificaciones: Alertas automáticas para eventos importantes
      
      Tecnologías Utilizadas:
      - Frontend: React + TypeScript
      - Backend: Node.js + Express
      - Base de Datos: PostgreSQL
      - Estilos: Tailwind CSS
      - Estado: React Context + Hooks
    `,
    'items.sumaq_uywa.features.dashboard': 'Dashboard con métricas en tiempo real',
    'items.sumaq_uywa.features.reproduction': 'Gestión completa de reproducción',
    'items.sumaq_uywa.features.health': 'Control de salud veterinaria',
    'items.sumaq_uywa.features.feeding': 'Sistema de alimentación',
    'items.sumaq_uywa.features.sales': 'Módulo de ventas',
    'items.sumaq_uywa.features.expenses': 'Control de gastos e inventario',
    'items.sumaq_uywa.features.notifications': 'Notificaciones automáticas',
    'items.sumaq_uywa.features.reports': 'Reportes y estadísticas',
    'items.sumaq_uywa.features.responsive': 'Interfaz responsive y moderna',
    'items.sumaq_uywa.challenges.database': 'Diseño de base de datos compleja',
    'items.sumaq_uywa.challenges.notifications': 'Sistema de notificaciones en tiempo real',
    'items.sumaq_uywa.challenges.performance': 'Optimización de performance con grandes volúmenes de datos',
    'items.sumaq_uywa.challenges.charts': 'Implementación de gráficos interactivos',
    'items.ventify.title': 'Ventify',
    'items.ventify.description': 'Sistema completo de punto de venta (POS) y gestión de inventario para negocios con múltiples sucursales. Incluye seguimiento de ventas en tiempo real, reservas de pedidos, pedidos personalizados, control de caja registradora, permisos granulares de usuario, reportes de transacciones y más.',
    'items.ventify.media.dashboard': 'Ventify - Dashboard Principal',
    'items.ventify.media.pos': 'Ventify - Interfaz de Punto de Venta',
    'items.ventify.media.inventory': 'Ventify - Gestión de Inventario',
    'items.ventify.media.reports': 'Ventify - Reportes de Transacciones',
    'items.ventify.long_description': `
      Ventify es un sistema completo de Punto de Venta (POS) y gestión de inventario desarrollado para negocios con múltiples sucursales. 
      Permite gestionar productos, ventas en tiempo real, reservas de pedidos, pedidos personalizados, control de caja registradora, 
      usuarios con permisos granulares, reportes de transacciones y más. Está diseñado para optimizar operaciones comerciales, 
      con integración de pagos mixtos, gestión de depósitos y alertas de stock bajo.
      
      Características Principales:
      - Gestión Multi-Sucursal: Control completo de múltiples ubicaciones comerciales
      - Ventas en Tiempo Real: Seguimiento de ventas en vivo y actualizaciones de inventario
      - Reservas de Pedidos: Sistema avanzado de reserva de productos
      - Pedidos Personalizados: Creación y gestión de pedidos personalizados
      - Control de Caja: Gestión completa de flujo de caja y transacciones
      - Permisos Granulares: Sistema de control de acceso basado en roles
      - Reportes de Transacciones: Análisis detallado e inteligencia de negocio
      - Pagos Mixtos: Soporte para múltiples métodos de pago
      - Gestión de Almacenes: Control de inventario multi-ubicación
      - Alertas de Stock Bajo: Notificaciones automáticas para gestión de inventario
      
      Tecnologías Utilizadas:
      - Frontend: Next.js 14 (React con App Router), TypeScript, Tailwind CSS, Shadcn/ui para componentes UI
      - Backend y Base de Datos: Firebase (Firestore para datos en tiempo real, Authentication para usuarios, Storage para archivos, Hosting para despliegue)
      - Otras Librerías: date-fns para manejo de fechas, lucide-react para iconos, react-hook-form para formularios, y servicios personalizados para gestión de inventario, reservas y pagos
      - Despliegue: Firebase Hosting, con soporte para SSR/SSG y optimización para producción
      
      Este proyecto destaca por su arquitectura escalable, manejo de estado en tiempo real y enfoque en UX para entornos comerciales. 
      Fue desarrollado como solución SaaS para múltiples cuentas y sucursales.
    `,
    'items.ventify.features.multibranch': 'Gestión de negocios multi-sucursal',
    'items.ventify.features.realtime': 'Seguimiento de ventas e inventario en tiempo real',
    'items.ventify.features.reservations': 'Sistema avanzado de reservas de pedidos',
    'items.ventify.features.custom_orders': 'Creación y gestión de pedidos personalizados',
    'items.ventify.features.cash_control': 'Control completo de caja y transacciones',
    'items.ventify.features.permissions': 'Permisos granulares de usuario y roles',
    'items.ventify.features.reports': 'Reportes detallados de transacciones y análisis',
    'items.ventify.features.payments': 'Integración de métodos de pago mixtos',
    'items.ventify.features.warehouses': 'Gestión de almacenes multi-ubicación',
    'items.ventify.features.alerts': 'Alertas de stock bajo y gestión de inventario',
    'items.ventify.features.responsive': 'Interfaz moderna y responsiva para comercios',
    'items.ventify.challenges.realtime_sync': 'Sincronización de datos en tiempo real entre múltiples sucursales',
    'items.ventify.challenges.complex_permissions': 'Implementación de sistema de permisos granulares complejo',
    'items.ventify.challenges.concurrent_access': 'Manejo de acceso concurrente de usuarios y consistencia de datos',
    'items.ventify.challenges.scalability': 'Diseño de arquitectura escalable para negocios en crecimiento',
    'items.ventify.challenges.offline_support': 'Implementación de funcionalidad offline para operaciones POS',
    'items.ventify.challenges.performance': 'Optimización de rendimiento con grandes volúmenes de datos y actualizaciones en tiempo real',
  };
  return fallbackTranslations[key] || key;
});

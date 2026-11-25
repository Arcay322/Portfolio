from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "portfolio" / "assets" / "cv"
FONT_DIR = Path("/usr/share/fonts/truetype/liberation")
if not FONT_DIR.exists():
    FONT_DIR = Path("/usr/share/fonts/liberation")
pdfmetrics.registerFont(TTFont("Liberation", str(FONT_DIR / "LiberationSerif-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Liberation-Bold", str(FONT_DIR / "LiberationSerif-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Liberation-Italic", str(FONT_DIR / "LiberationSerif-Italic.ttf")))
pdfmetrics.registerFontFamily("Liberation", normal="Liberation", bold="Liberation-Bold", italic="Liberation-Italic")

LINK_COLOR = "#1a4b8c"
BASE = dict(fontName="Liberation", fontSize=9.5, leading=11.6, textColor=colors.black)
STYLES = {
    "name": ParagraphStyle("name", **{**BASE, "fontName": "Liberation-Bold", "fontSize": 18.5, "leading": 22}, alignment=TA_CENTER, spaceAfter=2),
    "role": ParagraphStyle("role", **{**BASE, "fontSize": 9.8, "leading": 12}, alignment=TA_CENTER, spaceAfter=2),
    "contact": ParagraphStyle("contact", **{**BASE, "fontSize": 8.8, "leading": 10.6}, alignment=TA_CENTER, spaceAfter=5),
    "section": ParagraphStyle("section", **{**BASE, "fontName": "Liberation-Bold", "fontSize": 9.8, "leading": 11.8}, spaceBefore=6, spaceAfter=2, keepWithNext=True),
    "job": ParagraphStyle("job", **{**BASE, "fontName": "Liberation-Bold"}, spaceBefore=3, spaceAfter=1, keepWithNext=True),
    "meta": ParagraphStyle("meta", **{**BASE, "fontName": "Liberation-Italic", "fontSize": 9.2, "leading": 11}, spaceAfter=2, keepWithNext=True),
    "right": ParagraphStyle("right", **BASE, alignment=TA_RIGHT),
    "body": ParagraphStyle("body", **BASE, spaceAfter=2),
    "bullet": ParagraphStyle("bullet", **BASE, leftIndent=11, spaceAfter=1.6),
}


def link(url, label):
    return f"<link href='{url}' color='{LINK_COLOR}'>{label}</link>"


def blocks(locale):
    es = locale == "es"
    if es:
        return [
            ("name", "ARNIE CALDERÓN"),
            ("role", "Desarrollador Full-Stack | React · Next.js · TypeScript · Node.js · Python"),
            (
                "contact",
                f"Lima, Perú · Teléfono/WhatsApp: +51 918 793 956 · arniecalderonayala@gmail.com<br/>"
                f"{link('https://arcay.dev', 'arcay.dev')} · "
                f"{link('https://github.com/Arcay322', 'github.com/Arcay322')} · "
                f"{link('https://linkedin.com/in/arniecalderonayala', 'linkedin.com/in/arniecalderonayala')}",
            ),
            ("section", "PERFIL PROFESIONAL"),
            (
                "body",
                "Desarrollador Full-Stack con experiencia en aplicaciones web empresariales, integración de APIs/ERP y desarrollo de productos SaaS. "
                "Desarrollé la plataforma web comercial de IMPREX EUROPE (España) integrada con SAP y creé Ventify, un POS multisucursal en producción utilizado por tres clientes. "
                "Próximo a egresar de Ingeniería de Software en la UTP (Dic. 2026), con disponibilidad completa inmediata.",
            ),
            ("section", "EXPERIENCIA PROFESIONAL"),
            ("company", "Ventify", "Perú"),
            ("meta", "Desarrollador Full-Stack (Producto SaaS) · Octubre 2024 – Actualidad"),
            ("bullet", "Evolucioné un POS desarrollado para <b>INVERSIONES MAX PERU</b> en un SaaS multisucursal utilizado por <b>tres clientes</b>, con más de <b>S/ 5,5 millones en ventas registradas</b> en producción."),
            ("bullet", "Implementé gestión de inventario en tiempo real, caja, pagos mixtos, reservas, pedidos y reportes operativos con <b>Next.js, TypeScript y Firebase</b>."),
            ("bullet", "Diseñé aislamiento de datos por cuenta (multi-tenant) y control de accesos basado en roles y permisos (RBAC) para múltiples negocios y sucursales."),
            ("bullet", "Integré <b>Venty</b>, asistente de IA con Firebase Genkit y modelos Gemini/DeepSeek, para consultar métricas comerciales y proponer acciones sujetas a permisos y confirmación del usuario."),
            ("company", "Proyectos Freelance — Modernización Web", "Remoto, Perú"),
            ("meta", "Desarrollador Frontend · Octubre 2026 – Noviembre 2026"),
            ("bullet", "Migré y modernicé dos sitios web de cliente desde prototipos iniciales a <b>Astro</b>, entregando interfaces responsivas con arquitectura estática orientada a rendimiento."),
            ("bullet", "Optimicé el <b>SEO técnico</b> (estructura semántica, metadatos y carga) y guié al cliente en la configuración y puesta en marcha del despliegue en producción."),
            ("company", "IMPREX EUROPE S.L.", "Remoto, España"),
            ("meta", "Desarrollador Frontend · Septiembre 2025 – Septiembre 2026"),
            ("bullet", "Desarrollé la aplicación web comercial con <b>React y Vite</b> (clientes, catálogo, carrito, pedidos y visitas), adaptando al navegador los flujos de la aplicación móvil Kotlin."),
            ("bullet", "Implementé la simulación y creación de pedidos en <b>SAP</b> mediante APIs corporativas, generación de XML, validaciones de negocio y manejo de respuestas y errores del ERP."),
            ("bullet", "Integré el catálogo de <b>Sales Layer</b> con búsqueda, filtros y paginación; desarrollé importación de productos desde Excel y flujos de pedidos múltiples."),
            ("bullet", "Desarrollé el módulo de visitas comerciales con calendario, rutas, geolocalización, formularios dinámicos y reglas de surtido por cliente."),
            ("bullet", "Optimicé el consumo de APIs mediante peticiones en lote y eliminación de llamadas duplicadas; añadí pruebas de formularios, visitas y payloads SAP colaborando en un repositorio compartido con el equipo."),
            ("section", "PROYECTOS DESTACADOS"),
            ("company", "Sumaq Uywa | React, TypeScript, Node.js, Express, PostgreSQL", link("https://github.com/Arcay322/Sumaq_Uywa", "github.com/Arcay322/Sumaq_Uywa")),
            ("body", "Sistema full-stack de gestión ganadera (reproducción, salud, alimentación, inventario, ventas y gastos) con API REST en Node.js/Express, modelo relacional en PostgreSQL y dashboard de indicadores operativos."),
            ("company", "Ticket World | Python, Django REST Framework, PostgreSQL, JavaScript", link("https://github.com/Arcay322/Ticket_World", "github.com/Arcay322/Ticket_World")),
            ("body", "Plataforma de venta de entradas con API REST en Django, control de roles (administrador, proveedor y cliente), gestión de órdenes en PostgreSQL, integración con Google Maps y pasarela de pago simulada."),
            ("section", "HABILIDADES TÉCNICAS"),
            ("body", "<b>Frontend:</b> React, Next.js, Astro, TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS, shadcn/ui."),
            ("body", "<b>Backend y datos:</b> Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase/Firestore, APIs REST. <b>Integraciones:</b> SAP, XML, Sales Layer."),
            ("body", "<b>Herramientas y pruebas:</b> Git, GitHub, Linux, Docker, Vercel, Postman, Vitest, Jest, React Testing Library, Playwright."),
            ("body", "<b>IA aplicada:</b> Firebase Genkit, integración de LLMs (Gemini/DeepSeek) y asistentes con herramientas."),
            ("section", "EDUCACIÓN E IDIOMAS"),
            ("body", "<b>Ingeniería de Software | Universidad Tecnológica del Perú (UTP)</b> — 2022 – Diciembre 2026 (egreso previsto) · Lima, Perú"),
            ("body", "<b>Español:</b> nativo. <b>Inglés:</b> intermedio (B1) — lectura técnica fluida y comunicación en equipo."),
        ]
    return [
        ("name", "ARNIE CALDERÓN"),
        ("role", "Full-Stack Developer | React · Next.js · TypeScript · Node.js · Python"),
        (
            "contact",
            f"Lima, Peru · Phone/WhatsApp: +51 918 793 956 · arniecalderonayala@gmail.com<br/>"
            f"{link('https://arcay.dev', 'arcay.dev')} · "
            f"{link('https://github.com/Arcay322', 'github.com/Arcay322')} · "
            f"{link('https://linkedin.com/in/arniecalderonayala', 'linkedin.com/in/arniecalderonayala')}",
        ),
        ("section", "PROFESSIONAL SUMMARY"),
        (
            "body",
            "Full-Stack Developer experienced in enterprise web applications, API/ERP integrations, and SaaS product development. "
            "Built IMPREX EUROPE's (Spain) SAP-integrated commercial web platform and created Ventify, a production multi-branch POS used by three clients. "
            "Graduating in Software Engineering at Universidad Tecnológica del Perú (Dec. 2026), available immediately for full-time roles.",
        ),
        ("section", "PROFESSIONAL EXPERIENCE"),
        ("company", "Ventify", "Peru"),
        ("meta", "Full-Stack Developer (SaaS Product) · October 2024 – Present"),
        ("bullet", "Evolved a POS built for <b>INVERSIONES MAX PERU</b> into a multi-branch SaaS used by <b>three clients</b>, recording over <b>PEN 5.5 million in sales</b> in production."),
        ("bullet", "Implemented real-time inventory, cash register management, split payments, reservations, orders, and operational reporting with <b>Next.js, TypeScript, and Firebase</b>."),
        ("bullet", "Built multi-tenant data isolation and role- and permission-based access control (RBAC) across separate businesses and branches."),
        ("bullet", "Integrated <b>Venty</b>, an AI assistant powered by Firebase Genkit and Gemini/DeepSeek models, to query commercial metrics and propose actions subject to role permissions and user confirmation."),
        ("company", "Freelance Projects — Web Modernization", "Remote, Peru"),
        ("meta", "Frontend Developer · October 2026 – November 2026"),
        ("bullet", "Migrated and modernized two client websites from initial prototypes to <b>Astro</b>, delivering responsive interfaces with a performance-focused static architecture."),
        ("bullet", "Optimized <b>technical SEO</b> (semantic structure, metadata, and load performance) and guided the client through production deployment setup."),
        ("company", "IMPREX EUROPE S.L.", "Remote, Spain"),
        ("meta", "Frontend Developer · September 2025 – September 2026"),
        ("bullet", "Developed the commercial web application with <b>React and Vite</b> (customers, catalog, cart, orders, and visits), adapting workflows from the Kotlin mobile app to the browser."),
        ("bullet", "Implemented <b>SAP</b> order simulation and creation via corporate APIs, including XML payload generation, business validations, and ERP response and error handling."),
        ("bullet", "Integrated the <b>Sales Layer</b> catalog with search, filtering, and pagination; built Excel product imports and multi-order workflows."),
        ("bullet", "Built the sales visits module featuring calendars, routes, geolocation, dynamic forms, and customer-specific assortment rules."),
        ("bullet", "Optimized API consumption through batch requests and duplicate-call elimination; added tests for forms, visits, and SAP payloads while collaborating in a shared team repository."),
        ("section", "SELECTED PROJECTS"),
        ("company", "Sumaq Uywa | React, TypeScript, Node.js, Express, PostgreSQL", link("https://github.com/Arcay322/Sumaq_Uywa", "github.com/Arcay322/Sumaq_Uywa")),
        ("body", "Full-stack livestock management system (reproduction, health, feeding, inventory, sales, and expenses) with a Node.js/Express REST API, relational PostgreSQL schema, and operational metrics dashboard."),
        ("company", "Ticket World | Python, Django REST Framework, PostgreSQL, JavaScript", link("https://github.com/Arcay322/Ticket_World", "github.com/Arcay322/Ticket_World")),
        ("body", "Event ticketing platform with a Django REST API, role-based access (admin, vendor, customer), PostgreSQL order management, Google Maps integration, and a simulated payment gateway."),
        ("section", "TECHNICAL SKILLS"),
        ("body", "<b>Frontend:</b> React, Next.js, Astro, TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS, shadcn/ui."),
        ("body", "<b>Backend and data:</b> Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase/Firestore, REST APIs. <b>Integrations:</b> SAP, XML, Sales Layer."),
        ("body", "<b>Tools and testing:</b> Git, GitHub, Linux, Docker, Vercel, Postman, Vitest, Jest, React Testing Library, Playwright."),
        ("body", "<b>Applied AI:</b> Firebase Genkit, LLM integration (Gemini/DeepSeek), and tool-enabled assistants."),
        ("section", "EDUCATION AND LANGUAGES"),
        ("body", "<b>Software Engineering | Universidad Tecnológica del Perú (UTP)</b> — 2022 – December 2026 (expected graduation) · Lima, Peru"),
        ("body", "<b>Spanish:</b> native. <b>English:</b> intermediate (B1) — fluent technical reading and team communication."),
    ]


def make_pdf(locale):
    output = OUT / f"Arnie_Calderon_{locale.upper()}.pdf"
    story = []
    for item in blocks(locale):
        kind, text, *extra = item
        if kind == "section":
            story.extend([Paragraph(text, STYLES[kind]), HRFlowable(width="100%", thickness=0.5, color=colors.black, spaceAfter=3)])
        elif kind == "company":
            row = Table([[Paragraph(text, STYLES["job"]), Paragraph(extra[0], STYLES["right"])]], colWidths=[355, 165])
            row.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0), ("VALIGN", (0, 0), (-1, -1), "BOTTOM")]))
            row.keepWithNext = True
            story.append(row)
        elif kind == "bullet":
            story.append(Paragraph(text, STYLES[kind], bulletText="•"))
        else:
            story.append(Paragraph(text, STYLES[kind]))
    SimpleDocTemplate(str(output), pagesize=A4, leftMargin=38, rightMargin=38, topMargin=26, bottomMargin=24, title=f"Arnie Calderón - CV ({locale.upper()})", author="Arnie Calderón").build(story)
    return output


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for language in ("es", "en"):
        print(make_pdf(language))

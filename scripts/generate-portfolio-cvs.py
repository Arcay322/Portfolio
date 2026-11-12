from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "portfolio" / "assets" / "cv"
FONT_DIR = Path("/usr/share/fonts/truetype/liberation")
if not FONT_DIR.exists():
    FONT_DIR = Path("/usr/share/fonts/liberation")
pdfmetrics.registerFont(TTFont("Liberation", str(FONT_DIR / "LiberationSerif-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Liberation-Bold", str(FONT_DIR / "LiberationSerif-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Liberation-Italic", str(FONT_DIR / "LiberationSerif-Italic.ttf")))
pdfmetrics.registerFontFamily("Liberation", normal="Liberation", bold="Liberation-Bold", italic="Liberation-Italic")

BASE = dict(fontName="Liberation", fontSize=9.1, leading=10.7, textColor=colors.black)
STYLES = {
    "name": ParagraphStyle("name", **{**BASE, "fontName": "Liberation-Bold", "fontSize": 18, "leading": 21}, alignment=TA_CENTER, spaceAfter=2),
    "role": ParagraphStyle("role", **BASE, alignment=TA_CENTER, spaceAfter=2),
    "contact": ParagraphStyle("contact", **{**BASE, "fontSize": 8.5, "leading": 9.8}, alignment=TA_CENTER, spaceAfter=4),
    "section": ParagraphStyle("section", **{**BASE, "fontName": "Liberation-Bold", "fontSize": 9.5}, spaceBefore=4, spaceAfter=2, keepWithNext=True),
    "job": ParagraphStyle("job", **{**BASE, "fontName": "Liberation-Bold"}, spaceBefore=2, spaceAfter=1, keepWithNext=True),
    "meta": ParagraphStyle("meta", **{**BASE, "fontName": "Liberation-Italic"}, spaceAfter=1, keepWithNext=True),
    "right": ParagraphStyle("right", **BASE, alignment=TA_RIGHT),
    "body": ParagraphStyle("body", **BASE, spaceAfter=1),
    "bullet": ParagraphStyle("bullet", **BASE, leftIndent=10, spaceAfter=1),
}


def blocks(locale):
    es = locale == "es"
    if es:
        return [
            ("name", "ARNIE CALDERÓN"),
            ("role", "Desarrollador Full-Stack | React · Next.js · TypeScript · Python"),
            ("contact", "Lima, Perú · Teléfono/WhatsApp: +51 918 793 956<br/>arniecalderonayala@gmail.com · <link href='https://arcay.dev'>arcay.dev</link><br/><link href='https://github.com/Arcay322'>github.com/Arcay322</link> · <link href='https://linkedin.com/in/arniecalderonayala'>linkedin.com/in/arniecalderonayala</link>"),
            ("section", "PERFIL PROFESIONAL"),
            ("body", "Desarrollador Full-Stack con experiencia en aplicaciones de gestión empresarial, integración de APIs y desarrollo de productos SaaS. Desarrollo de la plataforma web comercial de IMPREX EUROPE (España), con integración SAP. Creador de Ventify, POS multisucursal usado por tres clientes. Estudiante de último año de Ingeniería de Software en la UTP."),
            ("section", "EXPERIENCIA PROFESIONAL"),
            ("company", "IMPREX EUROPE S.L.", "Remoto, España"),
            ("meta", "Desarrollador Frontend Freelance · Septiembre 2025 - Actualidad"),
            ("bullet", "Desarrollé la aplicación web comercial con <b>React y Vite</b>: clientes, catálogo, carrito, pedidos y visitas, adaptando al navegador los flujos de la aplicación móvil Kotlin."),
            ("bullet", "Implementé simulación y creación de pedidos en <b>SAP</b> mediante APIs corporativas, generación de XML, validaciones y manejo de respuestas y errores del ERP."),
            ("bullet", "Integré el catálogo de <b>Sales Layer</b> con búsqueda, filtros y paginación; desarrollé importación desde Excel y flujos de pedidos múltiples."),
            ("bullet", "Desarrollé visitas comerciales con calendario, rutas, geolocalización, formularios dinámicos y reglas de surtido por cliente."),
            ("bullet", "Optimicé peticiones en lote y consultas duplicadas; añadí pruebas de formularios, visitas y payloads SAP en un repositorio compartido."),
            ("company", "Ventify", "Perú"),
            ("meta", "Creador y desarrollador Full-Stack · Octubre 2024 - Actualidad"),
            ("bullet", "Convertí un POS para <b>INVERSIONES MAX PERU</b> en un SaaS multisucursal usado por <b>tres clientes</b>. Dos clientes registraron más de <b>S/ 5,5 millones en ventas</b> a través de la plataforma al <b>15/10/2026</b>, netas de adelantos, anulaciones y devoluciones."),
            ("bullet", "Implementé inventario en tiempo real, caja, pagos mixtos, reservas, pedidos y reportes con <b>Next.js, TypeScript y Firebase</b>."),
            ("bullet", "Desarrollé aislamiento de datos por cuenta y control de accesos por roles y permisos para negocios y sucursales."),
            ("bullet", "Integré <b>Venty</b>, asistente con Genkit y modelos Gemini/DeepSeek, para consultar datos comerciales y proponer acciones con confirmación del usuario."),
            ("section", "PROYECTOS DESTACADOS"),
            ("job", "Sumaq Uywa | React, TypeScript, Node.js, Express, PostgreSQL"),
            ("body", "Sistema de gestión ganadera: reproducción, salud, alimentación, inventario, ventas y gastos; dashboard operativo. <link href='https://github.com/Arcay322/Sumaq_Uywa'>Repositorio</link>."),
            ("job", "Ticket World | Python, Django REST Framework, PostgreSQL, JavaScript"),
            ("body", "Plataforma de venta de entradas con roles, órdenes, Google Maps y pasarela de pago simulada. <link href='https://github.com/Arcay322/Ticket_World'>Repositorio</link>."),
            ("section", "HABILIDADES TÉCNICAS"),
            ("body", "<b>Frontend:</b> React, Next.js, TypeScript, JavaScript, HTML/CSS, Tailwind CSS, shadcn/ui."),
            ("body", "<b>Backend y datos:</b> Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase/Firestore, APIs REST. <b>Integraciones:</b> SAP, XML, Sales Layer."),
            ("body", "<b>Herramientas y pruebas:</b> Git, GitHub, Linux, Docker, Vercel, Postman, Vitest, Jest, React Testing Library, Playwright."),
            ("body", "<b>IA aplicada:</b> Firebase Genkit, integración de LLMs (Gemini/DeepSeek) y asistentes con herramientas."),
            ("section", "EDUCACIÓN E IDIOMAS"),
            ("body", "<b>Ingeniería de Software | Universidad Tecnológica del Perú</b><br/>2022 - Diciembre de 2026 (egreso previsto) · Lima, Perú"),
            ("body", "<b>Español:</b> nativo. <b>Inglés:</b> básico; lectura de documentación técnica y conversación en desarrollo."),
        ]
    return [
        ("name", "ARNIE CALDERÓN"),
        ("role", "Full-Stack Developer | React · Next.js · TypeScript · Python"),
        ("contact", "Lima, Peru · Phone/WhatsApp: +51 918 793 956<br/>arniecalderonayala@gmail.com · <link href='https://arcay.dev'>arcay.dev</link><br/><link href='https://github.com/Arcay322'>github.com/Arcay322</link> · <link href='https://linkedin.com/in/arniecalderonayala'>linkedin.com/in/arniecalderonayala</link>"),
        ("section", "PROFESSIONAL SUMMARY"),
        ("body", "Full-Stack Developer experienced in business management applications, API integration, and SaaS development. Develops IMPREX EUROPE's (Spain) SAP-integrated sales web platform. Creator of Ventify, a multi-branch POS used by three clients. Final-year Software Engineering student at Universidad Tecnológica del Perú."),
        ("section", "PROFESSIONAL EXPERIENCE"),
        ("company", "IMPREX EUROPE S.L.", "Remote, Spain"),
        ("meta", "Freelance Frontend Developer · September 2025 - Present"),
        ("bullet", "Developed the sales web application with <b>React and Vite</b>: customer management, catalog, cart, orders, and visits, adapting workflows from the Kotlin mobile application."),
        ("bullet", "Implemented <b>SAP</b> order simulation and creation through corporate APIs, XML generation, validation, and ERP response and error handling."),
        ("bullet", "Integrated the <b>Sales Layer</b> catalog with search, filters, and pagination; developed Excel imports and multiple-order workflows."),
        ("bullet", "Built sales visits with calendars, routes, geolocation, dynamic forms, and customer-specific assortment rules."),
        ("bullet", "Optimized batch requests and duplicate calls; added tests for forms, visits, and SAP payloads in a shared repository."),
        ("company", "Ventify", "Peru"),
        ("meta", "Creator and Full-Stack Developer · October 2024 - Present"),
        ("bullet", "Evolved a POS built for <b>INVERSIONES MAX PERU</b> into a multi-branch SaaS used by <b>three clients</b>. Two clients recorded over <b>PEN 5.5 million in sales</b> through the platform as of <b>October 15, 2026</b>, net of deposits, cancellations, and refunds."),
        ("bullet", "Implemented real-time inventory, cash register management, split payments, reservations, orders, and reporting with <b>Next.js, TypeScript, and Firebase</b>."),
        ("bullet", "Built tenant-level data isolation and role- and permission-based access control for businesses and branches."),
        ("bullet", "Integrated <b>Venty</b>, a Genkit assistant using Gemini/DeepSeek models, to query business data and propose actions with user confirmation."),
        ("section", "SELECTED PROJECTS"),
        ("job", "Sumaq Uywa | React, TypeScript, Node.js, Express, PostgreSQL"),
        ("body", "Livestock management system covering reproduction, health, feeding, inventory, sales, and expenses, with an operational dashboard. <link href='https://github.com/Arcay322/Sumaq_Uywa'>Repository</link>."),
        ("job", "Ticket World | Python, Django REST Framework, PostgreSQL, JavaScript"),
        ("body", "Ticketing platform with user roles, order management, Google Maps, and a simulated payment gateway. <link href='https://github.com/Arcay322/Ticket_World'>Repository</link>."),
        ("section", "TECHNICAL SKILLS"),
        ("body", "<b>Frontend:</b> React, Next.js, TypeScript, JavaScript, HTML/CSS, Tailwind CSS, shadcn/ui."),
        ("body", "<b>Backend and data:</b> Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase/Firestore, REST APIs. <b>Integrations:</b> SAP, XML, Sales Layer."),
        ("body", "<b>Tools and testing:</b> Git, GitHub, Linux, Docker, Vercel, Postman, Vitest, Jest, React Testing Library, Playwright."),
        ("body", "<b>Applied AI:</b> Firebase Genkit, LLM integration (Gemini/DeepSeek), and tool-enabled assistants."),
        ("section", "EDUCATION AND LANGUAGES"),
        ("body", "<b>Software Engineering | Universidad Tecnológica del Perú</b><br/>2022 - December 2026 (expected graduation) · Lima, Peru"),
        ("body", "<b>Spanish:</b> native. <b>English:</b> basic; can read technical documentation and is developing conversational skills."),
    ]


def make_pdf(locale):
    output = OUT / f"Arnie_Calderon_{locale.upper()}.pdf"
    story = []
    for item in blocks(locale):
        kind, text, *extra = item
        if kind == "section":
            story.extend([Paragraph(text, STYLES[kind]), HRFlowable(width="100%", thickness=0.45, color=colors.black, spaceAfter=2)])
        elif kind == "company":
            row = Table([[Paragraph(text, STYLES["job"]), Paragraph(extra[0], STYLES["right"])]], colWidths=[370, 150])
            row.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0), ("VALIGN", (0, 0), (-1, -1), "BOTTOM")]))
            row.keepWithNext = True
            story.append(row)
        elif kind == "bullet":
            story.append(Paragraph(text, STYLES[kind], bulletText="•"))
        else:
            story.append(Paragraph(text, STYLES[kind]))
    SimpleDocTemplate(str(output), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=26, bottomMargin=26, title=f"Arnie Calderón - CV ({locale.upper()})", author="Arnie Calderón").build(story)
    return output


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for language in ("es", "en"):
        print(make_pdf(language))

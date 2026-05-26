import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Palabras clave a monitorear
const KEYWORDS = ['react', 'next.js', 'typescript', 'django', 'node', 'firebase'];
const CACHE_FILE = path.join(process.cwd(), '.seen-projects.json');
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface Project {
  id: string;
  title: string;
  url: string;
  budget: string;
  description: string;
  published: string;
  skills: string[];
}

/**
 * Carga el historial de proyectos ya notificados
 */
function loadCache(): Record<string, boolean> {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Guarda el historial de proyectos
 */
function saveCache(cache: Record<string, boolean>) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error('⚠️ Error escribiendo en la caché local:', error);
  }
}

/**
 * Envía una alerta enriquecida a Discord
 */
async function sendDiscordAlert(project: Project) {
  if (!DISCORD_WEBHOOK_URL) {
    console.log(`🔔 NUEVO PROYECTO ENCONTRADO (Consola): \n- Título: ${project.title}\n- Presupuesto: ${project.budget}\n- Link: ${project.url}\n`);
    return;
  }

  const embed = {
    title: `💼 ${project.title.slice(0, 250)}`,
    url: project.url,
    description: project.description.length > 500 
      ? `${project.description.slice(0, 500)}...` 
      : project.description,
    color: 3447003, // Color azul rey (#2563eb) en formato decimal
    fields: [
      {
        name: '💰 Presupuesto',
        value: project.budget || 'No especificado',
        inline: true
      },
      {
        name: '📅 Publicado',
        value: project.published || 'Recientemente',
        inline: true
      },
      {
        name: '🛠️ Habilidades del Proyecto',
        value: project.skills.length > 0 ? project.skills.join(', ') : 'Ninguna especificada'
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Workana Smart Monitor • https://arcay.dev'
    }
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (response.ok) {
      console.log(`🚀 Alerta enviada con éxito a Discord para: "${project.title}"`);
    } else {
      console.error(`⚠️ Error al enviar a Discord (Status ${response.status})`);
    }
  } catch (error) {
    console.error('❌ Error de red enviando webhook a Discord:', error);
  }
}

/**
 * Escanea proyectos de una query en Workana
 */
async function scanQuery(page: any, keyword: string, seenProjects: Record<string, boolean>): Promise<Project[]> {
  const url = `https://www.workana.com/jobs?language=es&query=${encodeURIComponent(keyword)}`;
  console.log(`🔍 Escaneando query de Workana para: "${keyword}"...`);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Intentar esperar el contenedor de proyectos de forma flexible
    await page.waitForSelector('.project-item, #projects', { timeout: 10000 }).catch(() => {
      console.log(`ℹ️ No se detectaron tarjetas rápidas para "${keyword}". Puede que no haya proyectos nuevos.`);
    });

    // Extraer datos usando selectores defensivos y robustos
    const projects = await page.evaluate(() => {
      const cards = document.querySelectorAll('.project-item, [class*="project-item"], .job-item');
      return Array.from(cards).map((card) => {
        // Selector de título
        const titleLink = card.querySelector('.project-title a, h2 a, h3 a, [class*="title"] a');
        const title = titleLink?.textContent?.trim() || '';
        const href = titleLink?.getAttribute('href') || '';
        const projectUrl = href.startsWith('http') ? href : `https://www.workana.com${href}`;
        
        // Generar un ID único a partir del URL
        const match = href.match(/\/job\/([^?]+)/);
        const id = match ? match[1] : projectUrl;

        // Selector de presupuesto
        const budgetEl = card.querySelector('.budget, .price, [class*="budget"], [class*="price"]');
        const budget = budgetEl?.textContent?.trim() || 'No especificado';

        // Selector de descripción
        const descEl = card.querySelector('.project-details, .html-desc, [class*="details"], [class*="description"]');
        const description = descEl?.textContent?.trim() || '';

        // Selector de fecha
        const dateEl = card.querySelector('.date, .published, [class*="date"]');
        const published = dateEl?.textContent?.trim() || 'Recientemente';

        // Selector de habilidades requeridas
        const skillBadges = card.querySelectorAll('.skills a, [class*="skills"] a, [class*="tag"]');
        const skills = Array.from(skillBadges).map(el => el.textContent?.trim() || '').filter(Boolean);

        return {
          id,
          title,
          url: projectUrl,
          budget,
          description,
          published,
          skills
        };
      });
    });

    // Filtrar proyectos vacíos o que ya hemos visto
    return projects.filter(p => p.title && p.id && !seenProjects[p.id]);

  } catch (error) {
    console.error(`❌ Error escaneando query "${keyword}":`, error);
    return [];
  }
}

async function main() {
  console.log('🏁 Iniciando Workana Smart Monitor...');
  
  const seenProjects = loadCache();
  
  // Lanzar navegador Playwright con emulación de usuario real
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'es-ES'
  });
  
  const page = await context.newPage();
  let newProjectsCount = 0;

  for (const keyword of KEYWORDS) {
    const newProjects = await scanQuery(page, keyword, seenProjects);
    
    for (const project of newProjects) {
      if (!seenProjects[project.id]) {
        await sendDiscordAlert(project);
        seenProjects[project.id] = true;
        newProjectsCount++;
        
        // Espera de 1 segundo para evitar saturar el Webhook de Discord
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  if (newProjectsCount > 0) {
    saveCache(seenProjects);
    console.log(`🎉 Monitoreo completado. Se encontraron y notificaron ${newProjectsCount} proyectos nuevos.`);
  } else {
    console.log('😴 Monitoreo completado. No se encontraron proyectos nuevos en esta sesión.');
  }

  await browser.close();
}

main().catch(console.error);

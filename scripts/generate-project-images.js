const fs = require('fs');
const path = require('path');

// Directorio de proyectos
const projectsDir = path.join(__dirname, '../public/images/projects');
const outputFile = path.join(__dirname, '../src/data/project-images.json');

function getImagesForProject(projectName) {
  const projectPath = path.join(projectsDir, projectName);
  
  if (!fs.existsSync(projectPath)) {
    return [];
  }

  const files = fs.readdirSync(projectPath);
  
  // Filtrar solo imágenes webp, jpg, png
  const imageFiles = files
    .filter(file => /\.(webp|jpg|jpeg|png)$/i.test(file))
    .sort((a, b) => {
      // Extraer números de los nombres de archivo para ordenar correctamente
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  return imageFiles;
}

function generateProjectImagesConfig() {
  const projects = {};

  // Leer todos los proyectos
  if (fs.existsSync(projectsDir)) {
    const projectFolders = fs.readdirSync(projectsDir)
      .filter(file => fs.statSync(path.join(projectsDir, file)).isDirectory());

    projectFolders.forEach(projectFolder => {
      const images = getImagesForProject(projectFolder);
      projects[projectFolder] = images.map((img, index) => ({
        src: `/images/projects/${projectFolder}/${img}`,
        alt: `${projectFolder} - Captura ${index + 1}`,
        type: 'image'
      }));
    });
  }

  // Crear directorio data si no existe
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Guardar configuración
  fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));
  
  console.log('✅ Configuración de imágenes generada:');
  Object.keys(projects).forEach(project => {
    console.log(`   - ${project}: ${projects[project].length} imágenes`);
  });
}

generateProjectImagesConfig();

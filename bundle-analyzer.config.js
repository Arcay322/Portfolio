/**
 * Bundle Analyzer Configuration
 * Para analizar el tamaño del bundle y encontrar optimizaciones
 */

// Ejecutar con: ANALYZE=true npm run build

module.exports = {
  // Configuración para @next/bundle-analyzer
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
  
  // Opciones del webpack bundle analyzer
  analyzerMode: 'static',
  reportFilename: './bundle-report.html',
  
  // Generar reporte JSON también
  generateStatsFile: true,
  statsFilename: './bundle-stats.json',
  
  // Configuración de logging
  logLevel: 'info',
  
  // Configuración de tamaños
  defaultSizes: 'gzip',
  
  // Excluir chunks pequeños del reporte
  excludeAssets: /\.map$/,
}

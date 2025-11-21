// Configuración centralizada de proyectos
// Agrega aquí los slugs de tus proyectos
export const projectSlugs = [
  'ventify',
  'ticket_world',
  'sumaq_uywa',
] as const;

export function getProjectsCount(): number {
  return projectSlugs.length;
}

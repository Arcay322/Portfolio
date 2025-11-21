import { getProjects } from "./projects";

export function getProjectBySlug(slug: string, t: (key: string) => string) {
  const projects = getProjects(t);
  return projects.find(
    (project) => project.title.toLowerCase().replace(/\s+/g, '-') === slug
  );
}

export function getAllProjectSlugs(t: (key: string) => string) {
  const projects = getProjects(t);
  return projects.map((project) => ({
    slug: project.title.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export function getProjectSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

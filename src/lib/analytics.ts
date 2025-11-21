// Google Analytics 4 Event Tracking

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Eventos personalizados para el portfolio
export const trackProjectView = (projectName: string) => {
  event({
    action: 'view_project',
    category: 'engagement',
    label: projectName,
  });
};

export const trackProjectClick = (projectName: string) => {
  event({
    action: 'click_project',
    category: 'engagement',
    label: projectName,
  });
};

export const trackCVDownload = () => {
  event({
    action: 'download_cv',
    category: 'engagement',
    label: 'CV Download',
  });
};

export const trackContactForm = (success: boolean) => {
  event({
    action: success ? 'submit_form_success' : 'submit_form_error',
    category: 'contact',
    label: 'Contact Form',
  });
};

export const trackTechFilter = (technology: string) => {
  event({
    action: 'filter_projects',
    category: 'engagement',
    label: technology,
  });
};

export const trackThemeToggle = (theme: string) => {
  event({
    action: 'toggle_theme',
    category: 'engagement',
    label: theme,
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config?: Record<string, any>
    ) => void;
  }
}

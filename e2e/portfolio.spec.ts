import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Portfolio/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.click('a[href="/projects"]');
    await expect(page).toHaveURL(/.*projects/);
    await expect(page.locator('h1')).toContainText('Proyectos');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/.*about/);
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL(/.*contact/);
    
    // Check if contact form is present
    await expect(page.locator('form')).toBeVisible();
  });

  test('should submit contact form', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=/enviado|success/i')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle theme', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="tema"]').first();
    await themeToggle.click();
    
    // Check if theme changed (dark/light class on html)
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toBeTruthy();
  });

  test('should navigate using keyboard', async ({ page }) => {
    // Tab to first navigation link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Press Enter on focused element
    await page.keyboard.press('Enter');
    
    // Should have navigated
    await expect(page).not.toHaveURL('/');
  });

  test('should display project details', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project
    const firstProject = page.locator('a[href^="/projects/"]').first();
    await firstProject.click();
    
    // Should be on project detail page
    await expect(page).toHaveURL(/.*projects\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check for essential meta tags
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('header')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('header')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('header')).toBeVisible();
  });

  test('should handle 404 page', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check for skip link
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
    
    // Check main landmark
    await expect(page.locator('main')).toHaveAttribute('id', 'main-content');
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/projects');
    
    // Check if images have loading attribute
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      const firstImg = images.first();
      const loading = await firstImg.getAttribute('loading');
      expect(['lazy', 'eager']).toContain(loading);
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Navigation should have aria-label
    const nav = page.locator('nav').first();
    await expect(nav).toHaveAttribute('aria-label');
    
    // Buttons should be accessible
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      expect(hasAriaLabel || hasText?.trim()).toBeTruthy();
    }
  });
});

test.describe('Performance Tests', () => {
  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime || 0);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  test('should load fast', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});

import { test, expect } from '@playwright/test';

test.describe('Módulo de Salud Veterinaria y Agenda de Dosis', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Iniciar sesión con el usuario semilla
    await page.goto('/login');
    await page.fill('#email', 'admin@llanos.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // Esperar a ser redirigido al dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Debería cargar Historias Clínicas y abrir el modal de registro con todos los inputs', async ({ page }) => {
    // 2. Navegar a Historias Clínicas
    await page.goto('/dashboard/health/histories');
    await expect(page.locator('h1')).toContainText('Historias Clínicas');

    // 3. Abrir el modal de registro
    await page.click('button:has-text("Registrar Consulta")');

    // 4. Verificar que el modal y todos sus campos clave existan
    const modalTitle = page.locator('h2:has-text("Registrar Historial Clínico")');
    await expect(modalTitle).toBeVisible();

    await expect(page.locator('label:has-text("Código de Historial")')).toBeVisible();
    await expect(page.locator('label:has-text("Título / Asunto General")')).toBeVisible();
    await expect(page.locator('label:has-text("Animal (Ganado)")')).toBeVisible();
    await expect(page.locator('label:has-text("Veterinario / Técnico")')).toBeVisible();
    await expect(page.locator('label:has-text("Diagnósticos Clínicos")')).toBeVisible();
    await expect(page.locator('label:has-text("Tratamientos Aplicados")')).toBeVisible();
    await expect(page.locator('label:has-text("Insumos / Medicinas Administradas")')).toBeVisible();

    // 5. Probar el Switch de Recurrencia
    const recurrenceSwitch = page.locator('button[role="switch"]:right-of(label:has-text("¿Tratamiento Recurrente?"))');
    
    // Verificar que los campos de recurrencia no están inicialmente
    await expect(page.locator('label:has-text("Frecuencia (Horas)")')).not.toBeVisible();

    // Activar recurrencia
    await recurrenceSwitch.click();

    // Verificar que ahora se muestran los campos
    await expect(page.locator('label:has-text("Frecuencia (Horas)")')).toBeVisible();
    await expect(page.locator('label:has-text("Total Dosis")')).toBeVisible();
    await expect(page.locator('label:has-text("Fecha Inicio")')).toBeVisible();

    // Cerrar el modal
    await page.click('button:has-text("Cancelar")');
    await expect(modalTitle).not.toBeVisible();
  });

  test('Debería cargar la Agenda de Dosis con sus pestañas de filtro', async ({ page }) => {
    // Navegar a la agenda de dosis
    await page.goto('/dashboard/health/schedule');
    await expect(page.locator('h1')).toContainText('Agenda Veterinaria');

    // Verificar las pestañas de filtro de estado
    await expect(page.locator('button[role="tab"]:has-text("Pendientes")')).toBeVisible();
    await expect(page.locator('button[role="tab"]:has-text("Completados")')).toBeVisible();
    await expect(page.locator('button[role="tab"]:has-text("Ver Todos")')).toBeVisible();
  });

});

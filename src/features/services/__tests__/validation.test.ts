// NOTE: Este archivo de pruebas unitarias está comentado porque el proyecto aún no cuenta con la dependencia de 'vitest' instalada en package.json.
// Una vez configurado el framework de pruebas, remueva los comentarios para ejecutar los tests.

/*
import { describe, it, expect } from "vitest";
import { serviceFormSchema } from "../types";

describe("Validación de Formulario de Servicios Reproductivos (Zod Schema)", () => {
  it("debe fallar si el payload está vacío", () => {
    const result = serviceFormSchema.safeParse({});
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const errors = result.error.format();
      expect(errors.female_id).toBeDefined();
      expect(errors.service_type_id).toBeDefined();
      expect(errors.made_at).toBeDefined();
      expect(errors.parentable_type).toBeDefined();
      expect(errors.parentable_id).toBeDefined();
    }
  });

  it("debe validar con éxito un payload correcto de Monta Natural", () => {
    const payload = {
      female_id: 12,
      service_type_id: 1, // Monta Natural
      made_at: "2026-06-29",
      technician_id: 2,
      parentable_type: "livestock",
      parentable_id: 3, // ID del Toro
    };

    const result = serviceFormSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("debe validar con éxito un payload correcto de Inseminación Artificial", () => {
    const payload = {
      female_id: 12,
      service_type_id: 2, // IA
      made_at: "2026-06-29",
      technician_id: null,
      parentable_type: "semen_batch",
      parentable_id: 8, // ID del Lote de Semen
    };

    const result = serviceFormSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("debe fallar si el parentable_type no es uno de los permitidos", () => {
    const payload = {
      female_id: 12,
      service_type_id: 3,
      made_at: "2026-06-29",
      parentable_type: "invalid_type", // Tipo inválido
      parentable_id: 5,
    };

    const result = serviceFormSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
*/

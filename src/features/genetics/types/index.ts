export type ParentableType = "livestock" | "semen_batch" | "embrion_batch";

export const PARENTABLE_TYPE_LABELS: Record<ParentableType, string> = {
  livestock: "Toro",
  semen_batch: "Semen",
  embrion_batch: "Embrión",
};

export const PARENTABLE_TYPE_PLURAL_LABELS: Record<ParentableType, string> = {
  livestock: "Toros",
  semen_batch: "Inseminaciones",
  embrion_batch: "Embriones",
};

export const PARENTABLE_TYPE_OPTIONS = Object.entries(PARENTABLE_TYPE_PLURAL_LABELS).map(
  ([id, name]) => ({
    id: id as ParentableType,
    name,
  })
);

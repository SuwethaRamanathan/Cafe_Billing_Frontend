// src/hooks/useLocalizedField.js
// Use this everywhere you display names from MongoDB
// It automatically picks the right language based on current i18n setting

import { useTranslation } from "react-i18next";

export function useLocalizedField() {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  return (field) => {
    // Safety: if field is null/undefined
    if (!field) return "";

    // Old data: field is a plain string (before migration)
    if (typeof field === "string") return field;

    // New data: field is { en: "...", ta: "...", hi: "..." }
    // Return current language, fall back to English, fall back to any filled value
    return field[lang]?.trim()
      || field.en?.trim()
      || field.ta?.trim()
      || field.hi?.trim()
      || "";
  };
}
import type { Locale } from "./i18n-config";

const dictionaries = {
  ar: () => import("./public/locales/ar/common.json").then((module) => module.default),
  fr: () => import("./public/locales/fr/common.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

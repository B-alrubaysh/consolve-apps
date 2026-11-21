import { useState, useEffect } from "react";

const LANG_KEY = "consolve_lang";
// Arabic is the site's default language (also what link-preview crawlers get,
// since they arrive with no saved preference).
const DEFAULT_LANG = "ar";

const listeners = new Set();

// A ?lang=ar / ?lang=en in the URL wins and is remembered.
function readUrlLang() {
  if (typeof window === "undefined") return null;
  const l = new URLSearchParams(window.location.search).get("lang");
  return l === "ar" || l === "en" ? l : null;
}

export function getStoredLang() {
  const fromUrl = readUrlLang();
  if (fromUrl) {
    localStorage.setItem(LANG_KEY, fromUrl);
    return fromUrl;
  }
  return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
}

export function setGlobalLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  listeners.forEach((fn) => fn(lang));
}

export function useLanguage() {
  const [lang, setLang] = useState(getStoredLang);

  useEffect(() => {
    const handler = (l) => setLang(l);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const toggle = (l) => setGlobalLang(l);
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return { lang, setLang: toggle, isAr, dir };
}
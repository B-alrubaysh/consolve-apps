import { useState, useEffect } from "react";

const LANG_KEY = "consolve_lang";

const listeners = new Set();

function getStoredLang() {
  return localStorage.getItem(LANG_KEY) || "en";
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
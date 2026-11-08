/** Shared theme constants (importable from server and client code). */
export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "ag-theme";

/**
 * Inline <head> script: sets data-theme before first paint so the wrong
 * theme never flashes. A stored choice wins; otherwise the OS preference.
 * Also flags JS availability for the reveal system.
 */
export const themeInitScript = `(function(){var d=document.documentElement;try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){d.setAttribute('data-theme','light');}d.classList.add('js');})();`;

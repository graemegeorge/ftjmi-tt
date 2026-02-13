import { DEFAULT_THEME_PREFERENCE, THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Prevent flickering by applying the theme before the page is rendered
 */
const themeBootstrapScript = `
(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const saved = localStorage.getItem(storageKey);
  const preference = saved === "light" || saved === "dark" || saved === "system" ? saved : "${DEFAULT_THEME_PREFERENCE}";
  const isDark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />;
}

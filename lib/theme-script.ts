export const THEME_KEY = "theme";

/**
 * Runs in <head> before first paint so a saved choice never flashes the wrong theme.
 * A plain string (not a client module) because the server layout inlines it.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

import React, { ReactNode, useState, createContext, useContext, useCallback } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

const lightMuiTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkMuiTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})


const appThemes = {
  lightMuiTheme,
  darkMuiTheme
};

export type AppThemeName = keyof typeof appThemes;

export interface ThemeSwitcherContextValue {
  theme: Theme;
  activateTheme: (theme: AppThemeName) => void;
}
const ThemeSwitcherContext = createContext<ThemeSwitcherContextValue>({
  theme: lightMuiTheme,
  activateTheme: () => {}
});

export const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

export interface MuiStylesProviderProps {
  children?: ReactNode;
  emotionCache: EmotionCache;
}

export function MuiStylesProvider(props: MuiStylesProviderProps) {
  const [theme, setTheme] = useState<Theme>(lightMuiTheme);

  const activateTheme = useCallback((name: AppThemeName) => {
    setTheme(appThemes[name]);
  }, []);

  return (
    <ThemeSwitcherContext.Provider value={{ theme, activateTheme }}>
      <CacheProvider value={props.emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeSwitcherContext.Provider>
  )
}

export function useThemeSwitcher() {
  return useContext(ThemeSwitcherContext).activateTheme;
}

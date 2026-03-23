import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import light from '../styles/themes/light';
import dark from '../styles/themes/dark';

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(dark);

  useEffect(() => {
    const savedTheme = localStorage.getItem('@GestaoLojas:theme');
    if (savedTheme) {
      setTheme(savedTheme === 'light' ? light : dark);
    } else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      setTheme(prefersLight ? light : dark);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme.title === 'light' ? dark : light;
      localStorage.setItem('@GestaoLojas:theme', newTheme.title);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

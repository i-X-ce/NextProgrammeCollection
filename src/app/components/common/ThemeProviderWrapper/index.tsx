"use client";

import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Inconsolata } from "next/font/google";
import { useEffect, useState } from "react";
import "@fontsource/inconsolata";

const inconsolata = Inconsolata({
  subsets: ["latin"],
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#14141e",
    },
    secondary: {
      main: "#0d0d15",
    },
    tertiary: {
      main: "#161621",
    },
    border: {
      main: "#202036",
    },
    text: {
      main: "#d1d1d1",
    },
  },
  typography: {
    fontFamily: "Inconsolata",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#fafafa",
    },
    secondary: {
      main: "#FFFFFF",
    },
    tertiary: {
      main: "#f7f7fa",
    },
    border: {
      main: "#d9d9d9",
    },
    text: {
      main: "#14141e",
    },
  },
  typography: {
    fontFamily: "Inconsolata",
  },
});

export default function App({ Component, pageProps }) {
  const [activeTheme, setActiveTheme] = useState(darkTheme);
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const getActiveTheme = (themeMode) => {
    return themeMode === "light" ? lightTheme : darkTheme;
  };

  const toggleTheme = () => {
    const desiredTheme = selectedTheme === "light" ? "dark" : "light";

    setSelectedTheme(desiredTheme);
  };

  useEffect(() => {
    setActiveTheme(getActiveTheme(selectedTheme));
  }, [selectedTheme]);

  return (
    <ThemeProvider theme={activeTheme}>
      <main className={inconsolata.className}>
        <CssBaseline />
        <Component {...pageProps} toggleTheme={toggleTheme} />
      </main>
    </ThemeProvider>
  );
}

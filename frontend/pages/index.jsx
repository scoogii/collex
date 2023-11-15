import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Nav from "@/components/Nav";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MarketPlacePanel from "@/components/marketplace/MarketPlacePanel";

export default function Home({ toggleTheme }) {
  ////////// STATE VARIABLES //////////
  const [token, setToken] = useState("");
  const [hidden, setHidden] = useState(true);
  const theme = useTheme();

  ////////// STYLES //////////
  const brandLogoStyle = {
    maxWidth: { xs: "80px", sm: "100px", md: "150px", lg: "170px" },
    maxHeight: { xs: "80px", sm: "100px", md: "150px", lg: "170px" },
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    let token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setHidden(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>ColleX</title>
        <meta
          name="description"
          content="Woolworths & Coles Collectibles Exchange"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav toggleTheme={toggleTheme} />

      {token && <MarketPlacePanel />}

      {!hidden && (
        <Box
          className={styles.main}
          bgcolor={theme.palette.primary.main}
          sx={{
            color: theme.palette.text.main,
            height: "100vh",
          }}
        >
          <Typography
            className={styles.scaleLoop}
            variant="h1"
            sx={{
              fontFamily: theme.typography.fontFamily,
              fontWeight: "bold",
              fontSize: { xs: "35pt", sm: "45pt", md: "55pt", lg: "65pt" },
            }}
          >
            Welcome to ColleX
          </Typography>
          <Box
            component={Link}
            href="/register"
            variant="contained"
            className={styles.scaleButton}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#75f098",
              color: "black",
              width: { xs: "150px", md: "190px" },
              height: { xs: "55px", md: "65px" },
              borderRadius: "15px",
              textDecoration: "none",
              "&:hover": {
                background: "#75f098",
              },
            }}
          >
            <Typography variant="h6">Get Started</Typography>
          </Box>
          <Box
            className={styles.hoverPurple}
            component={Link}
            href="/login"
            sx={{
              color: theme.palette.text.main,
              marginBottom: "10vh",
            }}
          >
            <Typography variant="h6">
              Already have an account? Sign in
            </Typography>
          </Box>
          <Box
            className="flex"
            sx={{
              flexDirection: "column",
              position: "absolute",
              bottom: 0,
            }}
          >
            <Typography variant="h6">Proudly sponsored by:</Typography>
            <Box className="flex">
              <Box component="img" src="/woolworths.png" sx={brandLogoStyle} />
              <Box component="img" src="/coles.png" sx={brandLogoStyle} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

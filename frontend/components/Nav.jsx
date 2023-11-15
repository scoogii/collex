import { Box, Chip, Typography } from "@mui/material";
import ThemeSwitch from "./ThemeSwitch";
import { useTheme } from "@emotion/react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import NavMenu from "./NavMenu";
import { useEffect, useState } from "react";
import NavDropdown from "./NavDropdown";

const Nav = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [username, setUsername] = useState("");
  const [numUnread, setNumUnread] = useState(0);
  const [isAdmin, setIsAdmin] = useState(0);
  const [token, setToken] = useState("");
  const theme = useTheme();

  ////////// HANDLERS //////////
  const getNumUnread = async () => {
    const response = await fetch(
      `http://localhost:8080/message/get_unread_conversations?username=${username}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      setNumUnread(data["unread_conversations"]);
    }
  };

  ////////// STYLES //////////
  const navStyle = {
    flexDirection: "row",
    width: "100vw",
    height: "80px",
    position: "fixed",
    top: "0",
    textAlign: "left",
    background: theme.palette.primary.main,
    zIndex: "10",
  };

  const lightNavStyle = {
    borderBottom: "solid 2px #858585",
    boxShadow: "0 5px #ede8e8",
  };

  const darkNavStyle = {
    borderBottom: "solid 2px black",
    boxShadow: "0 5px #0d0d15",
  };

  const logoButtonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    left: 0,
    marginLeft: "1vw",
    color: theme.palette.text.main,
    textDecoration: "none",
  };

  const dropdownStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    left: 0,
    color: theme.palette.text.main,
    textDecoration: "none",
    fontSize: "15pt",
    marginLeft: { xs: "150px", sm: "160px" },
    "@media (min-width: 900px)": {
      display: "none",
    },
  };

  const headerLinkStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    left: 0,
    color: theme.palette.text.main,
    textDecoration: "none",
    fontSize: "15pt",
    "@media (max-width: 900px)": {
      display: "none",
    },
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    let token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    let username = localStorage.getItem("username");
    setUsername(username);
  }, []);

  useEffect(() => {
    let admin = localStorage.getItem("is_admin");
    setIsAdmin(parseInt(admin));
  }, []);

  useEffect(() => {
    if (username) {
      getNumUnread();
    }
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      className="flex"
      style={theme.palette.mode === "light" ? lightNavStyle : darkNavStyle}
      sx={navStyle}
    >
      <Box
        className={styles.hoverPurple}
        component={Link}
        href="/"
        sx={logoButtonStyle}
      >
        <Box
          component="img"
          src="/colleX.png"
          sx={{
            maxWidth: "40px",
            maxHeight: "40px",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          ColleX
        </Typography>
      </Box>

      <Box className={styles.hoverPurple} sx={dropdownStyle}>
        <NavDropdown token={token} isAdmin={isAdmin} />
      </Box>

      <Box
        className={styles.hoverPurple}
        component={Link}
        href="/marketplace"
        sx={headerLinkStyle}
        style={{
          marginLeft: "200px",
        }}
      >
        <Typography variant="h6">Marketplace</Typography>
      </Box>

      {token && (
        <Box
          className={styles.hoverPurple}
          component={Link}
          href="/campaigns"
          sx={headerLinkStyle}
          style={{
            marginLeft: "350px",
          }}
        >
          <Typography variant="h6">Campaigns</Typography>
        </Box>
      )}

      {token && (
        <Box
          className={styles.hoverPurple}
          component={Link}
          href="/messages"
          sx={headerLinkStyle}
          style={{
            marginLeft: "480px",
          }}
        >
          <Typography variant="h6">Messages</Typography>

          {numUnread > 0 && (
            <Chip
              size="small"
              label={numUnread}
              sx={{
                fontSize: "12pt",
                background: "#fe4034",
                marginBottom: "20px",
              }}
            />
          )}
        </Box>
      )}

      {token && !isAdmin && (
        <Box
          className={styles.hoverPurple}
          component={Link}
          href={`/profile/trading/${localStorage.getItem("username")}`}
          sx={headerLinkStyle}
          style={{
            marginLeft: "600px",
          }}
        >
          <Typography variant="h6">My Trades</Typography>
        </Box>
      )}

      <Box
        className="flex"
        sx={{
          position: "absolute",
          right: 0,
          marginRight: "1vw",
        }}
      >
        <ThemeSwitch
          onClick={() => {
            toggleTheme();
          }}
        />

        <NavMenu toggleTheme={toggleTheme} />

        {token ? (
          <Typography
            variant="h6"
            sx={{
              marginLeft: { xs: "0px", md: "10px" },
              width: { xs: "0px", md: "100%" },
              maxWidth: { xs: "0px", md: "80px" },
              display: "block",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {username}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default Nav;

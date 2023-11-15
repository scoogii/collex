import { Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import Nav from "@/components/Nav";
import UserPanel from "@/components/user/UserPanel";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TradingPanel from "@/components/trading/TradingPanel";

const ProfileExperience = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [canAdd, setCanAdd] = useState(false);
  const [incomingTrades, setIncomingTrades] = useState([]);
  const [outgoingTrades, setOutgoingTrades] = useState([]);
  const [historicalTrades, setHistoricalTrades] = useState([]);
  const router = useRouter();
  const theme = useTheme();

  const getIncomingTrades = async () => {
    // Send request to backend for user's collectibles
    const response = await fetch(
      `http://localhost:8080/trading/get_open_trade_listings?username=${router.query.user}&listing_type=incoming`,
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
      setIncomingTrades(data["trade_listings"]["trade_listings"]);
    }
  };

  const getOutgoingTrades = async () => {
    // Send request to backend for user's collectibles
    const response = await fetch(
      `http://localhost:8080/trading/get_open_trade_listings?username=${router.query.user}&listing_type=outgoing`,
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
      setOutgoingTrades(data["trade_listings"]["trade_listings"]);
    }
  };

  const getHistoricalTrades = async () => {
    // Send request to backend for user's collectibles
    const response = await fetch(
      `http://localhost:8080/trading/get_historical_trade_listings?username=${router.query.user}`,
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
      setHistoricalTrades(data["trade_listings"]["trade_listings"]);
    }
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.user) {
      getIncomingTrades();
      getOutgoingTrades();
      getHistoricalTrades();
    }
  }, [router.query.user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (router.query.user === localStorage.getItem("username")) {
      setCanAdd(true);
    }
  }, [router.query.user]);

  useEffect(() => {
    let isAdmin = localStorage.getItem("is_admin");
    if (parseInt(isAdmin) === 1) {
      router.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Nav toggleTheme={toggleTheme} />
      <Box
        bgcolor={theme.palette.primary.main}
        sx={{
          color: theme.palette.text.main,
          minHeight: "calc(100vh - 85px)",
          marginTop: "85px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            display: "flex",
            width: "100vw",
          }}
        >
          <Grid item xs={12} sm={3}>
            <UserPanel />
          </Grid>
          <Grid item xs={12} sm={9}>
            <TradingPanel
              incomingTrades={incomingTrades}
              outgoingTrades={outgoingTrades}
              getIncomingTrades={getIncomingTrades}
              getOutgoingTrades={getOutgoingTrades}
              getHistoricalTrades={getHistoricalTrades}
              historicalTrades={historicalTrades}
              canAdd={canAdd}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileExperience;

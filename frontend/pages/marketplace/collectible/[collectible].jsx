import Nav from "@/components/Nav";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import MarketplaceListings from "@/components/marketplace/MarketplaceListings";

const CollectibleListing = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [collectible, setCollectible] = useState({});
  const [series, setSeries] = useState({});
  const [offers, setOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const getCollectible = async () => {
    const response = await fetch(
      `http://localhost:8080/collectible/get_collectible?collectible_name=${router.query.collectible}`,
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
      setCollectible(data["collectible"]);
    }
  };

  const getSeries = async () => {
    const response = await fetch(
      `http://localhost:8080/collectible/get_series?series_id=${collectible.series_id}`,
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
      setSeries(data["series"]);
    }
  };

  const getOfferedListings = async () => {
    const response = await fetch(
      `http://localhost:8080/trading/get_collectible_trade_listings?collectible_id=${collectible.id}&listing_type=offered`,
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
      setOffers(data["trade_listings"]["trade_listings"]);
    }
  };

  const getRequestedListings = async () => {
    const response = await fetch(
      `http://localhost:8080/trading/get_collectible_trade_listings?collectible_id=${collectible.id}&listing_type=requested`,
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
      setRequests(data["trade_listings"]["trade_listings"]);
    }
  };

  ////////// STYLES //////////
  const rarities = {
    Common: "#6e6e6e",
    Rare: "#3373f2",
    "Ultra-Rare": "#d24ff0",
    Legendary: "#f78725",
  };

  const seriesColours = {
    "Swag Monkeys": "#e0964c",
    "Epic Gamers": "#31a8d4",
    "Super Pets": "#5abd39",
    "Crazy Legends": "#ed4c37",
    "Astro World": "#477fba",
  };

  const containerStyle = {
    display: "flex",
    gap: "15px",
    padding: "20px",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.text.main,
    minHeight: "calc(100vh - 80px)",
    marginTop: "80px",
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const titleBarStyle = {
    flexDirection: "column",
    textAlign: "center",
    width: { xs: "100%", md: "60%", lg: "45%" },
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
    padding: "10px",
    gap: "10px",
  };

  const titleImageStyle = {
    marginTop: "15px",
    borderRadius: "14px",
    width: "110px",
    height: "110px",
    border: "4px solid",
    borderColor: rarities[collectible.rarity],
  };

  const gridContentStyle = {
    background: theme.palette.primary.main,
  };

  const gridPaneStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: { xs: "250px", sm: "350px", md: "500px" },
    height: "60vh",
    width: "100%",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "auto",
  };

  const gridTitleStyle = {
    width: "100%",
    textAlign: "center",
    borderBottom: "2px solid",
    background: theme.palette.tertiary.main,
    borderColor: theme.palette.border.main,
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.collectible) {
      getCollectible();
    }
  }, [router.query.collectible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (collectible.series_id) {
      getSeries();
    }
  }, [collectible.series_id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (collectible.id) {
      getOfferedListings();
      getRequestedListings();
    }
  }, [collectible.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Nav toggleTheme={toggleTheme} />
      <Box sx={containerStyle}>
        <Paper className="flex" elevation={0} sx={titleBarStyle}>
          <Box
            component="img"
            src={collectible.image_id}
            sx={titleImageStyle}
          />

          <Typography variant="h2">{collectible.name}</Typography>

          <Box className="flex" sx={{ gap: "20px" }}>
            {series.provider && (
              <Box
                component="img"
                src={`/${series.provider}.png`}
                sx={{
                  width: "70px",
                  height: "70px",
                }}
              />
            )}

            <Chip
              label={series.name}
              sx={{
                fontSize: "11pt",
                color: "white",
                background: seriesColours[series.name],
              }}
            />
            <Chip
              label={collectible.rarity}
              sx={{
                fontSize: "11pt",
                color: "white",
                background: rarities[collectible.rarity],
              }}
            />
          </Box>
        </Paper>

        <Grid container sx={gridContentStyle}>
          <Grid item xs={12} md={6} sx={gridPaneStyle}>
            <Typography variant="h4" sx={gridTitleStyle}>
              Offers
            </Typography>

            <MarketplaceListings listings={offers} />
          </Grid>

          <Grid item xs={12} md={6} sx={gridPaneStyle}>
            <Typography variant="h4" sx={gridTitleStyle}>
              Requests
            </Typography>

            <MarketplaceListings listings={requests} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CollectibleListing;

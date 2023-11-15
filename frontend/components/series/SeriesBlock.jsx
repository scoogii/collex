import { useTheme } from "@emotion/react";
import { Box, Button, Chip } from "@mui/material";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import ViewSeriesModal from "./ViewSeriesModal";

const SeriesBlock = ({ serie }) => {
  ////////// STATE VARIABLES //////////
  const [collectibles, setCollectibles] = useState([]);
  const [viewSeriesOpen, setViewSeriesOpen] = useState(false);
  const theme = useTheme();

  ////////// HANDLERS //////////
  const getCollectibles = async () => {
    const response = await fetch(
      `http://localhost:8080/collectible/get_series?series_id=${serie.id}`,
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
      setCollectibles(data["series"]["collectibles"]);
    }
  };

  ////////// STYLES //////////
  const seriesColours = {
    "Swag Monkeys": "#e0964c",
    "Epic Gamers": "#31a8d4",
    "Super Pets": "#5abd39",
    "Crazy Legends": "#ed4c37",
    "Astro World": "#477fba",
  };

  const seriesBlockStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100px",
    gap: "10px",
    background: theme.palette.tertiary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
    color: theme.palette.text.main,
    textTransform: "none",
    borderRadius: "12px",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getCollectibles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ViewSeriesModal
        viewSeriesOpen={viewSeriesOpen}
        setViewSeriesOpen={setViewSeriesOpen}
        serie={serie}
        collectibles={collectibles}
      />

      <Button
        className={styles.selectButton}
        sx={seriesBlockStyle}
        onClick={() => {
          setViewSeriesOpen(true);
        }}
      >
        <Box
          component="img"
          src={`/${serie.provider.toLowerCase()}.png`}
          sx={{ width: 50, height: 50 }}
        />

        <Chip
          label={serie.name}
          sx={{
            fontSize: "15pt",
            background: seriesColours[serie.name],
          }}
        />
      </Button>
    </>
  );
};

export default SeriesBlock;

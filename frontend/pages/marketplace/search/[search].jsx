import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Nav from "@/components/Nav";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import CollectibleContainer from "@/components/CollectibleContainer";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import styles from "@/styles/Home.module.css";
import FilterSelect from "@/components/marketplace/FilterSelect";

const providers = ["Woolworths", "Coles"];
const rarities = ["Common", "Rare", "Ultra-Rare", "Legendary"];
const allSeries = [
  "Swag Monkeys",
  "Epic Gamers",
  "Super Pets",
  "Crazy Legends",
  "Astro World",
];
const allWooliesSeries = ["Swag Monkeys", "Epic Gamers", "Astro World"];
const allColesSeries = ["Crazy Legends", "Super Pets"];

const SearchResults = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [results, setResults] = useState([]);
  const [provider, setProvider] = useState("");
  const [rarity, setRarity] = useState("");
  const [series, setSeries] = useState("");

  const [filteredSeries, setFilteredSeries] = useState([]);

  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const getResults = async () => {
    const response = await fetch(
      `http://localhost:8080/filtering/search_for_collectibles?input=${router.query.search}`,
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
      return;
    }

    let collectibles = {};
    for (const collectible of data) {
      collectibles[collectible.id] = collectible;
    }

    const seriesProviderRes = await fetch(
      "http://localhost:8080/collectible/get_all_collectibles_and_series",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const seriesProviderData = await seriesProviderRes.json();

    if (seriesProviderData.error) {
      alert(seriesProviderData.error);
    }

    for (const series of seriesProviderData["Coles"]) {
      const seriesName = series.series_name;

      for (const col of series.collectibles) {
        if (col.id in collectibles) {
          collectibles[col.id].series = seriesName;
          collectibles[col.id].provider = "Coles";
        }
      }
    }

    for (const series of seriesProviderData["Woolworths"]) {
      const seriesName = series.series_name;

      for (const col of series.collectibles) {
        if (col.id in collectibles) {
          collectibles[col.id].series = seriesName;
          collectibles[col.id].provider = "Woolworths";
        }
      }
    }

    let finalResults = [];
    for (const key in collectibles) {
      finalResults = [...finalResults, collectibles[key]];
    }

    setResults(finalResults);
  };

  const handleClearFilter = () => {
    setProvider("");
    setRarity("");
    setSeries("");
    setFilteredSeries(allSeries);
  };

  ////////// STYLES //////////
  const providerColours = {
    Woolworths: "#48a753",
    Coles: "#e12129",
  };

  const rarityColours = {
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

  const collectionContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  };

  const collectibleContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: { xs: "150px", md: "200px" },
    width: { xs: "150px", md: "200px" },
    paddingRight: "10px",
    paddingLeft: "10px",
    paddingBottom: "10px",
    gap: "5px",
    background: theme.palette.primary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
  };

  const imageStyle = {
    width: { xs: "70px", md: "100px" },
    borderRadius: "16px",
  };

  const containerStyle = {
    display: "flex",
    gap: "15px",
    height: "calc(100vh - 85px)",
    padding: "20px",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.text.main,
    marginTop: "80px",
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const filterBarStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center`",
    width: "100%",
    height: "90px",
    padding: "5px",
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
    overflow: "auto",
  };

  const searchContentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    minHeight: "40vh",
    height: "65vh",
    padding: "10px",
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
    overflow: "auto",
  };

  const clearFilterStyle = {
    background: "#8c52ff",
    fontSize: { lg: "11pt" },
    width: "120px",
    height: "50px",
    display: { xs: "none", md: "flex" },
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.search) {
      getResults();
    }
  }, [router.query.search]);

  // Change series options depending on selected provider
  useEffect(() => {
    if (provider === "Woolworths") {
      setFilteredSeries(allWooliesSeries);

      if (!allWooliesSeries.includes(series)) {
        setSeries("");
      }
    }

    if (provider === "Coles") {
      setFilteredSeries(allColesSeries);

      if (!allColesSeries.includes(series)) {
        setSeries("");
      }
    }
  }, [provider]);

  // Change provider options depending on selected series
  useEffect(() => {
    if (allWooliesSeries.includes(series)) {
      setProvider("Woolworths");
    }

    if (allColesSeries.includes(series)) {
      setProvider("Coles");
    }
  }, [series]);

  return (
    <>
      <Nav toggleTheme={toggleTheme} />

      <Box sx={containerStyle}>
        <Button
          className={styles.scaleButton}
          onClick={() => {
            router.push("/marketplace");
          }}
          sx={{
            position: "absolute",
            left: { xs: "calc(1vw)", lg: "calc(1vw)" },
            top: "85px",
          }}
        >
          <ArrowBackRoundedIcon
            sx={{
              color: "#e65c53",
              width: { xs: 35, md: 40, lg: 50 },
              height: { xs: 35, md: 40, lg: 50 },
            }}
          />
        </Button>

        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Results for &quot;{router.query.search}&quot;
        </Typography>

        <Paper elevation={0} sx={filterBarStyle}>
          <Box
            className="flex"
            sx={{
              gap: { xs: "10px", sm: "50px" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", md: "block" },
                textAlign: "center",
              }}
            >
              Filters:
            </Typography>

            <FilterSelect
              title="Provider"
              options={providers}
              choice={provider}
              setChoice={setProvider}
              choiceColours={providerColours}
            />

            <FilterSelect
              title="Rarity"
              options={rarities}
              choice={rarity}
              setChoice={setRarity}
              choiceColours={rarityColours}
            />

            <FilterSelect
              disabled={provider === ""}
              title="Series"
              options={filteredSeries}
              choice={series}
              setChoice={setSeries}
              choiceColours={seriesColours}
            />

            <Button
              variant="outlined"
              className={styles.selectButton}
              sx={clearFilterStyle}
              onClick={handleClearFilter}
            >
              Clear Filter
            </Button>
          </Box>
        </Paper>

        <Paper elevation={0} sx={searchContentStyle}>
          {results.length === 0 && (
            <Box
              className="flex"
              sx={{
                width: "100%",
                height: "60vh",
              }}
            >
              <Typography>
                No results found for &quot;{router.query.search}&quot;
              </Typography>
            </Box>
          )}

          <Box sx={collectionContainerStyle}>
            {results
              .filter((collectible) => {
                return provider === ""
                  ? true
                  : provider === collectible.provider;
              })
              .filter((collectible) => {
                return rarity === "" ? true : rarity === collectible.rarity;
              })
              .filter((collectible) => {
                return series === "" ? true : series === collectible.series;
              })
              .map((collectible) => (
                <Paper
                  key={collectible.name}
                  className={styles.scaleButton}
                  elevation={0}
                  sx={collectibleContainerStyle}
                >
                  <CollectibleContainer
                    collectible={collectible}
                    imageStyle={imageStyle}
                    isProfile={false}
                  />

                  <Typography>{collectible.name}</Typography>

                  <Chip
                    label={collectible.rarity}
                    sx={{
                      color: "white",
                      background: rarityColours[collectible.rarity],
                    }}
                  />
                </Paper>
              ))}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default SearchResults;

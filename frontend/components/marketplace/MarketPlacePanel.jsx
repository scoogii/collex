import {
  Box,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import CollectibleContainer from "../CollectibleContainer";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

const MarketPlacePanel = () => {
  const router = useRouter();

  ////////// STATE VARIABLES //////////
  const [search, setSearch] = useState("");
  const [trendingCollectibles, setTrendingCollectibles] = useState([]);
  const [newCollectibles, setNewCollectibles] = useState([]);
  const theme = useTheme();

  ////////// HANDLERS //////////
  const handleSearch = () => {
    if (!search) {
      return;
    }
    router.push(`/marketplace/search/${search}`);
  };

  const getTrendingCollectibles = async () => {
    const response = await fetch(
      "http://localhost:8080/collectible/get_trending_collectibles",
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
      setTrendingCollectibles(data["collectibles"]);
    }
  };

  const getNewCollectibles = async () => {
    const response = await fetch(
      "http://localhost:8080/collectible/get_new_collectibles",
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
      setNewCollectibles(data["collectibles"]);
    }
  };

  ////////// STYLES //////////
  const marketplaceContainer = {
    display: "flex",
    gap: "30px",
    padding: "10px",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.text.main,
    minHeight: "calc(100vh - 80px)",
    marginTop: "80px",
    background: theme.palette.primary.main,
    width: "100%",
    backgroundImage: "url('/collex_background.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const searchBarStyle = {
    width: { xs: "250px", sm: "300px", lg: "350px" },
    height: { lg: "80px" },
    color: "black",
    "& label.Mui-focused": {
      color: "#8c52ff",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#8c52ff",
      },
    },
    "& fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.main,
    },
    "&:hover fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: "#8c52ff",
    },
  };

  const collectiblesContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: { xs: "300px", sm: "500px", md: "700px", lg: "1100px" },
    height: { xs: "145px", sm: "230px", md: "130px", lg: "115px" },
    marginTop: "1vh",
    borderRadius: "14px",
    border: "2px solid",
    borderColor: theme.palette.border.main,
    background: theme.palette.tertiary.main,
    overflowX: "auto",
  };

  const imageStyle = {
    height: { xs: "60px", sm: "100px", md: "115px", lg: "90px" },
    width: { xs: "60px", sm: "100px", md: "115px", lg: "90px" },
    borderRadius: "18px",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getTrendingCollectibles();
    getNewCollectibles();
  }, []);

  return (
    <Box className={styles.main}>
      <Box bgcolor={theme.palette.primary.main} sx={marketplaceContainer}>
        <Typography variant="h2" sx={{ marginTop: "1vh" }}>
          Marketplace
        </Typography>

        <TextField
          label="Search Collectible"
          value={search}
          sx={searchBarStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <Box className="flex" sx={{ flexDirection: "column", gap: "30px" }}>
          <Box className="flex" sx={{ flexDirection: "column" }}>
            <Typography
              className={styles.scaleLoop}
              variant="h4"
              sx={{ marginTop: "1vh" }}
            >
              Trending
            </Typography>

            <Paper elevation={0} sx={collectiblesContainerStyle}>
              {trendingCollectibles.map((collectible, index) => (
                <Box className={styles.scaleButton} key={index}>
                  <CollectibleContainer
                    collectible={collectible}
                    imageStyle={imageStyle}
                  />
                </Box>
              ))}
            </Paper>
          </Box>

          <Box className="flex" sx={{ flexDirection: "column" }}>
            <Typography
              className={styles.scaleLoop}
              variant="h4"
              sx={{ marginTop: "1vh" }}
            >
              New Series Collectibles
            </Typography>

            <Paper elevation={0} sx={collectiblesContainerStyle}>
              {newCollectibles.map((collectible, index) => (
                <Box className={styles.scaleButton} key={index}>
                  <CollectibleContainer
                    collectible={collectible}
                    imageStyle={imageStyle}
                    isProfile={false}
                  />
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MarketPlacePanel;

import Nav from "@/components/Nav";
import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";

const Campaigns = ({ toggleTheme }) => {
  const [search, setSearch] = useState("");
  const [recSearch, setRecSearch] = useState("");
  const [results, setResults] = useState([]);
  const [recResults, setRecResults] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const getAllCampaigns = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/get_all_campaigns_for_users`,
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
      setCampaigns(data["campaigns"]);
    }
  };

  const getAllRecommended = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/get_all_recommended_campaigns_for_user?username=${localStorage.getItem(
        "username",
      )}`,
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
      setRecommended(data["campaigns"]);
    }
  };

  const handleSearch = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/search_for_campaign?input_string=${search}`,
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
      setResults(data["campaigns"].map((campaign) => campaign["name"]));
    }
  };

  const handleRecSearch = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/search_for_campaign?input_string=${recSearch}`,
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
      setRecResults(data["campaigns"].map((campaign) => campaign["name"]));
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

  const containerStyle = {
    display: "flex",
    gap: "30px",
    padding: "10px",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.text.main,
    minHeight: "calc(100vh - 80px)",
    marginTop: "80px",
    background: theme.palette.tertiary.main,
    width: "100%",
  };

  const campaignsContainerStyle = {
    padding: "10px",
    gap: { xs: "15px", sm: "10px" },
    display: "flex",
    flexWrap: "wrap",
    justifyContent: { xs: "space-evenly", sm: "center" },
    alignItems: "left",
    width: "90%",
    height: { xs: "350px", sm: "450px", md: "550px" },
    overflow: "auto",
    background: theme.palette.primary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
  };

  const campaignBlockStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: { xs: "150px", sm: "200px", md: "250px" },
    width: { xs: "95%", sm: "49%", md: "31%" },
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    color: theme.palette.text.main,
    textTransform: "none",
  };

  const searchBarStyle = {
    marginBottom: { xs: "-10px", sm: "-20px", md: "-25px", lg: "-30px" },
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

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getAllCampaigns();
    getAllRecommended();
    setResults([]);
    setRecResults([]);
    setSearch("");
    setRecSearch("");
    setCampaigns([]);
    setRecommended([]);
  }, []);

  return (
    <>
      <Nav toggleTheme={toggleTheme} />
      <Paper elevation={0} sx={containerStyle}>
        <Typography variant="h2" sx={{ marginTop: "1vh", textAlign: "center" }}>
          Recommended For You
        </Typography>

        <TextField
          label="Search Recommended"
          value={recSearch}
          sx={searchBarStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setRecSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRecSearch();
            }
          }}
        />

        <Paper elevation={0} sx={campaignsContainerStyle}>
          {recommended
            .filter((campaign) => {
              return recResults.length === 0
                ? true
                : recResults.includes(campaign.name);
            })
            .map((campaign, index) => (
              <Button
                key={index}
                className={styles.scaleButton}
                sx={campaignBlockStyle}
                onClick={() => {
                  router.push(`/campaigns/${campaign.name}`);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    gap: "5px",
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {campaign.name}
                  </Typography>

                  <Typography sx={{ textAlign: "center", fontStyle: "italic" }}>
                    {campaign.date_range}
                  </Typography>

                  <Chip
                    label={campaign.series_name}
                    sx={{
                      width: "80%",
                      fontSize: "12pt",
                      color: "white",
                      background: seriesColours[campaign.series_name],
                    }}
                  />

                  <Divider
                    sx={{
                      width: "100%",
                      background: theme.palette.border.main,
                    }}
                  />

                  <Typography
                    sx={{ textAlign: "center", overflowWrap: "anywhere" }}
                  >
                    {campaign.description}
                  </Typography>
                </Box>
              </Button>
            ))}
        </Paper>

        <Typography variant="h2" sx={{ marginTop: "1vh" }}>
          Campaigns
        </Typography>

        <TextField
          label="Search Campaigns"
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

        <Paper
          elevation={0}
          sx={campaignsContainerStyle}
          style={{ marginBottom: "50px" }}
        >
          {campaigns
            .filter((campaign) => {
              return results.length === 0
                ? true
                : results.includes(campaign.name);
            })
            .map((campaign, index) => (
              <Button
                key={index}
                className={styles.scaleButton}
                sx={campaignBlockStyle}
                onClick={() => {
                  router.push(`/campaigns/${campaign.name}`);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    gap: "5px",
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {campaign.name}
                  </Typography>

                  <Typography sx={{ textAlign: "center", fontStyle: "italic" }}>
                    {campaign.date_range}
                  </Typography>

                  <Chip
                    label={campaign.series_name}
                    sx={{
                      width: "80%",
                      fontSize: "12pt",
                      color: "white",
                      background: seriesColours[campaign.series_name],
                    }}
                  />

                  <Divider
                    sx={{
                      width: "100%",
                      background: theme.palette.border.main,
                    }}
                  />

                  <Typography
                    sx={{ textAlign: "center", overflowWrap: "anywhere" }}
                  >
                    {campaign.description}
                  </Typography>
                </Box>
              </Button>
            ))}
        </Paper>
      </Paper>
    </>
  );
};

export default Campaigns;

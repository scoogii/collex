import AlertBar from "@/components/AlertBar";
import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ManageCampaignBlock from "./ManageCampaignBlock";

const ManageCampaignsPanel = () => {
  ////////// STATE VARIABLES //////////
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [campaigns, setCampaigns] = useState([]);
  const [campaignResults, setCampaignResults] = useState([]);
  const [campaignSearch, setCampaignSearch] = useState("");

  const theme = useTheme();

  ////////// HANDLERS //////////
  const getCampaigns = async () => {
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

  const handleCampaignSearch = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/search_for_campaign?input_string=${campaignSearch}`,
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
      if (data["campaigns"].length === 0) {
        setAlertOpen(true);
        setAlertMessage(
          `No results for campaigns with name ${campaignSearch}.`,
        );
      }
      setCampaignResults(data["campaigns"].map((campaign) => campaign.name));
    }
  };

  ////////// STYLES //////////
  const gridPaperStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    height: "calc(100vh - 85px)",
    paddingTop: "10px",
    paddingBottom: "10px",
    background: theme.palette.tertiary.main,
    gap: "3vh",
    overflow: "auto",
  };

  const searchBarStyle = {
    marginTop: "20px",
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

  const searchResultsStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginTop: { xs: "30px", md: "40px", lg: "20px" },
    height: { xs: "350px", sm: "450px", md: "550px" },
    width: "90%",
    background: theme.palette.primary.main,
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    padding: "10px",
    gap: "10px",
    overflow: "auto",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getCampaigns();
    setCampaignSearch("");
    setCampaigns([]);
    setCampaignResults([]);
  }, []);

  return (
    <>
      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Paper sx={gridPaperStyle}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Manage Campaigns
        </Typography>

        <Box className="flex" sx={{ flexDirection: "column", width: "100%" }}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontStyle: "italic" }}
          >
            Search Campaigns
          </Typography>

          <TextField
            label="Search Campaign"
            value={campaignSearch}
            sx={searchBarStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setCampaignSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCampaignSearch();
              }
            }}
          />

          <Paper elevation={0} sx={searchResultsStyle}>
            {campaigns
              .filter((campaign) => {
                return campaignResults.length === 0
                  ? true
                  : campaignResults.includes(campaign.name);
              })
              .map((campaign, index) => (
                <ManageCampaignBlock
                  key={index}
                  campaign={campaign}
                  getCampaigns={getCampaigns}
                />
              ))}
          </Paper>
        </Box>
      </Paper>
    </>
  );
};

export default ManageCampaignsPanel;

import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import CampaignsBlock from "./CampaignsBlock";
import { useEffect, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SortIcon from "@mui/icons-material/Sort";
import SearchIcon from "@mui/icons-material/Search";
import CreateCampaignModal from "./CreateCampaignModal";
import { useRouter } from "next/router";

const CampaignPanel = () => {
  ////////// STATE VARIABLES //////////
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [alignment, setAlignment] = useState("Active");
  const [campaigns, setCampaigns] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const handleAlignmentChange = (e) => {
    setAlignment(e.target.value);
  };

  const getCampaigns = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/get_all_campaigns_for_managers?campaign_manager_username=${localStorage.getItem(
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
      setCampaigns(data["campaigns"]);
    }
  };

  const handleSortCampaigns = () => {
    let filtered = [...campaigns];
    filtered.reverse();

    setCampaigns(filtered);
  };

  const handleSearchArchived = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/search_for_manager_archived_campaigns?input_string=${search}&username=${router.query.user}`,
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

  ////////// STYLES //////////
  const panelContainer = {
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

  const toggleStyle = {
    width: { xs: "100px", sm: "110px", md: "130px", lg: "150px" },
    textTransform: "none",
  };

  const campaignsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: { xs: "100%", sm: "90%", md: "70%", lg: "50%" },
    height: { xs: "400px", sm: "500px", md: "600px" },
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    overflow: "auto",
    background: theme.palette.primary.main,
  };

  const searchBarStyle = {
    width: { xs: "250px", sm: "300px", lg: "350px" },
    height: { lg: "80px" },
    marginBottom: "-30px",
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
    getCampaigns();
    setAlignment("Active");
    setSearch("");
  }, []);

  return (
    <>
      <CreateCampaignModal
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        getCampaigns={getCampaigns}
      />

      <Box bgcolor={theme.palette.primary.main} sx={panelContainer}>
        <Typography variant="h2" sx={{ marginTop: "1vh", textAlign: "center" }}>
          My Campaigns
        </Typography>

        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={(e) => {
            handleAlignmentChange(e);
          }}
        >
          <ToggleButton value="Active" sx={toggleStyle}>
            Active
          </ToggleButton>

          <ToggleButton value="Archived" sx={toggleStyle}>
            Archived
          </ToggleButton>

          <ToggleButton value="Completed" sx={toggleStyle}>
            Completed
          </ToggleButton>
        </ToggleButtonGroup>

        {alignment === "Archived" && (
          <TextField
            label="Search Archived"
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
                handleSearchArchived();
              }
            }}
          />
        )}

        <Box
          className="flex"
          sx={{
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: { xs: "100%", sm: "90%", md: "70%", lg: "50%" },
            }}
          >
            <Tooltip title="Create a campaign">
              <IconButton
                onClick={() => {
                  setCreateOpen(true);
                }}
              >
                <AddBoxIcon sx={{ width: 40, height: 40, color: "#8c52ff" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sort by Date">
              <IconButton
                onClick={() => {
                  handleSortCampaigns();
                }}
              >
                <SortIcon sx={{ width: 40, height: 40, color: "#8c52ff" }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={campaignsContainerStyle}>
            <CampaignsBlock
              campaigns={campaigns}
              getCampaigns={getCampaigns}
              alignment={alignment}
              results={results}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CampaignPanel;

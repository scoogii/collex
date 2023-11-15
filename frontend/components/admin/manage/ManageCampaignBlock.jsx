import { useTheme } from "@emotion/react";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import ManageCampaignModal from "./ManageCampaignModal";

const ManageCampaignBlock = ({ campaign, getCampaigns }) => {
  ////////// STATE VARIABLES //////////
  const [participants, setParticipants] = useState(0);
  const [collectibles, setCollectibles] = useState([]);
  const [manageOpen, setManageOpen] = useState(false);
  const theme = useTheme();

  ////////// HANDLERS //////////
  const getCampaignCollectibles = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/get_campaign?campaign_name=${campaign.name}`,
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
      setCollectibles(data["campaign"]["series_collectibles"]);
      setParticipants(data["campaign"]["num_participants"]);
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

  const campaignBlockStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: { xs: "250px", md: "255px" },
    width: { xs: "85%", sm: "48%", md: "32%" },
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    color: theme.palette.text.main,
    textTransform: "none",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getCampaignCollectibles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ManageCampaignModal
        manageOpen={manageOpen}
        setManageOpen={setManageOpen}
        campaign={campaign}
        getCampaigns={getCampaigns}
        collectibles={collectibles}
        participants={participants}
      />

      <Button
        className={styles.selectButton}
        sx={campaignBlockStyle}
        onClick={() => {
          setManageOpen(true);
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

          <Typography sx={{ textAlign: "center", overflowWrap: "anywhere" }}>
            {campaign.description}
          </Typography>
        </Box>
      </Button>
    </>
  );
};

export default ManageCampaignBlock;

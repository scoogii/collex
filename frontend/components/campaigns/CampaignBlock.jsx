import {
  Box,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTheme } from "@emotion/react";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import AlertBar from "../AlertBar";
import { useRouter } from "next/router";
import SuccessBar from "../SuccessBar";
import { ArchiveRounded, Delete, UnarchiveRounded } from "@mui/icons-material";

const CampaignBlock = ({ campaign, getCampaigns }) => {
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const router = useRouter();
  const theme = useTheme();

  ////////// HANDLERS //////////
  const handleOpenCampaign = () => {
    router.push(`/campaigns/${campaign.name}`);
  };

  const handleArchiveCampaign = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/archive_campaign?campaign_name=${campaign.name}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      getCampaigns();
      setSuccessMessage("Successfully archived campaign!");
      setSuccessOpen(true);
    }
  };

  const handleUnarchiveCampaign = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/reactivate_campaign?campaign_name=${campaign.name}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      getCampaigns();
      setSuccessMessage("Successfully reactivated campaign!");
      setSuccessOpen(true);
    }
  };

  const handleDeleteCampaign = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/delete_campaign?campaign_name=${campaign.name
      }&username=${localStorage.getItem("username")}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      setSuccessMessage("Successfully deleted campaign!");
      setSuccessOpen(true);
      getCampaigns();
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

  const statusColours = {
    Active: "#40cf7e",
    Archived: "#fa8e2f",
    Completed: "#8c52ff",
  };

  const campaignStyle = {
    padding: "10px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: { xs: "190px", sm: "200px", md: "210px" },
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.tertiary.main,
    overflow: "auto",
  };

  const deleteButtonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textTransform: "none",
    color: "#de163b",
    marginLeft: "5px",
  };

  return (
    <>
      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message={successMessage}
      />

      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Paper elevation={0} sx={campaignStyle}>
        <Box className="flex" sx={{ width: "100%", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
              width: "80%",
              gap: "10px",
            }}
          >
            <Box
              className="flex"
              sx={{
                paddingRight: "10px",
                border: "1px solid",
                borderRadius: "12px",
                borderColor: theme.palette.border.main,
                background: theme.palette.tertiary.main,
                maxWidth: "60%",
              }}
            >
              <Tooltip title="View Campaign">
                <IconButton
                  onClick={() => {
                    handleOpenCampaign();
                  }}
                >
                  <VisibilityIcon
                    sx={{
                      color: "#8c52ff",
                      width: 30,
                      height: 30,
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Typography
                sx={{
                  fontWeight: "bold",
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {campaign.name}
              </Typography>

              <Tooltip title="Delete Campaign">
                <IconButton
                  className={styles.selectButton}
                  sx={deleteButtonStyle}
                  onClick={() => {
                    handleDeleteCampaign();
                  }}
                >
                  <Delete sx={{ width: 25, height: 25 }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Chip
              label={campaign.series_name}
              sx={{
                color: "white",
                fontSize: "11pt",
                background: seriesColours[campaign.series_name],
              }}
            />

            <Typography
              sx={{
                textAlign: "left",
                maxWidth: "80%",
                display: "block",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {campaign.description}
            </Typography>

            <Typography sx={{ fontStyle: "italic" }}>
              {campaign.date_range}
            </Typography>
          </Box>

          <Box
            className="flex"
            sx={{
              flexDirection: "column",
              width: "20%",
              height: "100%",
              gap: "10px",
            }}
          >
            <Chip
              label={campaign.status}
              sx={{
                fontSize: "11pt",
                color: "white",
                background: statusColours[campaign.status],
              }}
            />

            {campaign.status === "Active" && (
              <Tooltip title="Archive Campaign">
                <IconButton
                  size="large"
                  onClick={() => {
                    handleArchiveCampaign();
                  }}
                >
                  <ArchiveRounded
                    sx={{
                      color: statusColours["Archived"],
                      height: 30,
                      width: 30,
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}

            {campaign.status === "Archived" && (
              <Tooltip title="Unarchive Campaign">
                <IconButton
                  size="large"
                  onClick={() => {
                    handleUnarchiveCampaign();
                  }}
                >
                  <UnarchiveRounded
                    sx={{
                      color: statusColours["Active"],
                      height: 30,
                      width: 30,
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default CampaignBlock;

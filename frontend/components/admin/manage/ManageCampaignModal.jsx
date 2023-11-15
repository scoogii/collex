import SuccessBar from "@/components/SuccessBar";
import { useTheme } from "@emotion/react";
import { CloseRounded, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import AlertBar from "@/components/AlertBar";
import CollectibleContainer from "@/components/CollectibleContainer";

const ManageCampaignModal = ({
  manageOpen,
  setManageOpen,
  campaign,
  getCampaigns,
  collectibles,
  participants,
}) => {
  ////////// STATE VARIABLES //////////
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
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
      setManageOpen(false);
    }
  };

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    gap: "10px",
    padding: "10px",
    overflow: "auto",
  };

  const nameButtonStyle = {
    textTransform: "none",
    color: theme.palette.text.main,
  };

  const contentContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "95%",
    height: { xs: "395px", sm: "345px", md: "530px", lg: "575px" },
    border: "1px solid",
    padding: "20px",
    borderColor: theme.palette.border.main,
    borderRadius: "10px",
    background: theme.palette.tertiary.main,
    overflow: "auto",
  };

  const collectiblesContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    height: { xs: "250px", sm: "200px", md: "250px", lg: "300px" },
    border: "1px solid",
    borderRadius: "12px",
    padding: "20px",
    borderColor: theme.palette.border.main,
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const deleteButtonStyle = {
    marginTop: "20px",
    background: "#de163b",
    fontSize: "14pt",
    width: "110px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#de163b",
    },
  };

  const collectibleBlockStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "120px",
    gap: "10px",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.tertiary.main,
    padding: "10px",
    overflow: "auto",
  };

  const imageStyle = {
    height: { xs: "50px", sm: "50px", lg: "60px" },
    borderRadius: "12px",
  };

  const analyticBlockStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "50%",
    padding: "5px",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    color: theme.palette.text.main,
    background: theme.palette.primary.main,
    overflow: "auto",
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

      <Modal
        disableAutoFocus={true}
        open={manageOpen}
        onClose={() => {
          setManageOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          sx={{
            width: { xs: "380px", sm: "500px", md: "650px", lg: "800px" },
            height: { xs: "550px", sm: "500px", md: "650px", lg: "700px" },
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              width: "100%",
              height: "3vh",
            }}
          >
            <IconButton
              size="small"
              onClick={() => {
                setManageOpen(false);
              }}
            >
              <CloseRounded
                sx={{
                  color: "#e65c53",
                  width: { xs: 30, md: 35, lg: 40 },
                  height: { xs: 30, md: 35, lg: 40 },
                }}
              />
            </IconButton>
          </Box>

          <Box sx={modalContainerStyle}>
            <Button
              className={styles.hoverPurple}
              sx={nameButtonStyle}
              onClick={() => {
                router.push(`/campaigns/${campaign.name}`);
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "-1.5vh",
                }}
              >
                {campaign.name}
              </Typography>
            </Button>

            <Box sx={contentContainerStyle}>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", marginBottom: "30px" }}
              >
                {participants === 1
                  ? "1 participant"
                  : `${participants} participants`}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  textDecoration: "underline",
                  marginBottom: "20px",
                }}
              >
                Collectibles
              </Typography>

              <Box sx={collectiblesContainerStyle}>
                <Box
                  className="flex"
                  sx={{ flexDirection: "column", gap: "10px", width: "100%" }}
                >
                  {collectibles.map((collectible, index) => (
                    <Box key={index} sx={collectibleBlockStyle}>
                      <Box
                        className="flex"
                        sx={{ flexDirection: "column", width: "30%" }}
                      >
                        <CollectibleContainer
                          collectible={collectible}
                          imageStyle={imageStyle}
                          isProfile={false}
                        />

                        <Typography
                          sx={{
                            textAlign: "center",
                            maxWidth: "80%",
                            display: "block",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {collectible.name}
                        </Typography>
                      </Box>

                      <Box sx={analyticBlockStyle}>
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontStyle: "italic",
                          }}
                        >
                          Total Trades
                        </Typography>

                        <Typography sx={{ textAlign: "center" }}>
                          {collectible.total}
                        </Typography>
                      </Box>

                      <Box sx={analyticBlockStyle}>
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontStyle: "italic",
                          }}
                        >
                          Success Rate
                        </Typography>

                        <Typography sx={{ textAlign: "center" }}>
                          {collectible.successful}
                        </Typography>
                      </Box>

                      <Box sx={analyticBlockStyle}>
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontStyle: "italic",
                          }}
                        >
                          Failure Rate
                        </Typography>

                        <Typography sx={{ textAlign: "center" }}>
                          {collectible.declined}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Tooltip title="Delete Campaign">
                <Button
                  className={styles.selectButton}
                  sx={deleteButtonStyle}
                  onClick={() => {
                    handleDeleteCampaign();
                  }}
                >
                  <Delete sx={{ width: 30, height: 30 }} />
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default ManageCampaignModal;

import { useEffect, useState } from "react";
import AlertBar from "../AlertBar";
import {
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTheme } from "@emotion/react";
import styles from "@/styles/Home.module.css";
import SuccessBar from "../SuccessBar";

const CreateCampaignPostModal = ({
  campaign,
  getCampaignPosts,
  createOpen,
  setCreateOpen,
}) => {
  ////////// STATE VARIABLES //////////
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const theme = useTheme();

  ////////// HANDLERS //////////
  const handleCreateCampaignPost = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/create_campaign_post`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          account_username: localStorage.getItem("username"),
          campaign_name: campaign.name,
          post_description: description,
          post_title: title,
        }),
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
      getCampaignPosts();
      setCreateOpen(false);
      setSuccessOpen(true);
    }
  };

  ////////// STYLES //////////
  const containerStyle = {
    flexDirection: "column",
    width: { xs: "90vw", md: "40vw" },
    height: { xs: "70vh", md: "50vh" },
    background: theme.palette.primary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const formContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "column",
    background: theme.palette.tertiary.main,
    width: "90%",
    height: "75%",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    padding: "10px",
    gap: "20px",
    overflow: "auto",
  };

  const textFieldStyle = {
    background: theme.palette.primary.main,
    color: theme.palette.text.main,
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

  const inputFieldStyle = {
    width: "100%",
    background: "transparent",
  };

  const createButtonStyle = {
    background: "#8c52ff",
    fontSize: { lg: "12pt" },
    width: { xs: "140px", md: "160px" },
    minHeight: { xs: "60px", md: "70px" },
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
  };

  useEffect(() => {
    if (!createOpen) {
      setTitle("");
      setDescription("");
    }
  }, [createOpen]);

  return (
    <>
      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message="Successfully created new campaign post!"
      />

      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper className="flex" sx={containerStyle}>
          <Button
            className={styles.scaleButton}
            onClick={() => {
              setCreateOpen(false);
            }}
            sx={{
              position: "absolute",
              right: { xs: "calc(5vw)", md: "calc(30vw)" },
              top: { xs: "calc(15vh)", md: "calc(25vh)" },
            }}
          >
            <CloseRoundedIcon
              sx={{
                color: "#e65c53",
                width: { xs: 30, md: 35, lg: 40 },
                height: { xs: 30, md: 35, lg: 40 },
              }}
            />
          </Button>

          <Typography
            variant="h3"
            sx={{
              marginTop: "1vh",
              marginBottom: "1vh",
              fontSize: { xs: "20pt", sm: "22pt", md: "25pt", lg: "30pt" },
            }}
          >
            New Post
          </Typography>

          <Paper elevation={0} sx={formContainerStyle}>
            <Box className="flex" sx={inputFieldStyle}>
              <Typography sx={{ width: "35%", textAlign: "left" }}>
                Title:&nbsp;
              </Typography>

              <TextField
                value={title}
                placeholder="Enter a post title"
                sx={textFieldStyle}
                style={{ width: "60%" }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Box>

            <Box className="flex" sx={inputFieldStyle}>
              <Typography sx={{ width: "35%", textAlign: "left" }}>
                Description:&nbsp;
              </Typography>

              <TextField
                multiline
                rows={2}
                value={description}
                placeholder="Enter a description"
                sx={textFieldStyle}
                style={{ width: "60%" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                inputProps={{
                  sx: {
                    height: { xs: "100px" },
                  },
                }}
              />
            </Box>

            <Button
              className={styles.selectButton}
              sx={createButtonStyle}
              onClick={() => {
                handleCreateCampaignPost();
              }}
            >
              Create Post
            </Button>
          </Paper>
        </Paper>
      </Modal>
    </>
  );
};

export default CreateCampaignPostModal;

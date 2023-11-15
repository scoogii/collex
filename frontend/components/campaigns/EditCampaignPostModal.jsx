import { useTheme } from "@emotion/react";
import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import styles from "@/styles/Home.module.css";
import SuccessBar from "../SuccessBar";
import AlertBar from "../AlertBar";

const EditCampaignPostModal = ({
  post,
  editOpen,
  setEditOpen,
  getCampaignPosts,
}) => {
  const [successOpen, setSuccessOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [description, setDescription] = useState("");
  const theme = useTheme();

  ////////// HANDLERS //////////
  const handleEditPost = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/edit_campaign_post`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          account_username: localStorage.getItem("username"),
          new_description: description,
          post_id: post.id,
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
      setEditOpen(false);
      setSuccessOpen(true);
    }
  };

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const textFieldStyle = {
    width: "90%",
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

  const editButtonStyle = {
    background: "#8c52ff",
    fontSize: { lg: "12pt" },
    width: { xs: "140px", md: "150px" },
    minHeight: { xs: "60px", md: "60px" },
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
  };

  return (
    <>
      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message="Post successfully edited!"
      />

      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          sx={{
            display: "flex",
            width: { xs: "80vw", sm: "40vw" },
            height: { xs: "50vh", sm: "40vh" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
            gap: "30px",
          }}
        >
          <Button
            className={styles.scaleButton}
            onClick={() => {
              setEditOpen(false);
            }}
            sx={{
              position: "absolute",
              right: { xs: "calc(8.5vw)", sm: "calc(29.5vw)" },
              top: { xs: "calc(25vh)", sm: "calc(30vh)" },
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

          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Edit Description
          </Typography>

          <TextField
            multiline
            rows={2}
            value={description}
            placeholder="Enter a description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            sx={textFieldStyle}
            inputProps={{
              sx: {
                height: { xs: "70px" },
              },
            }}
          />

          <Button
            className={styles.selectButton}
            sx={editButtonStyle}
            onClick={() => {
              handleEditPost();
            }}
          >
            Confirm Change
          </Button>
        </Paper>
      </Modal>
    </>
  );
};

export default EditCampaignPostModal;

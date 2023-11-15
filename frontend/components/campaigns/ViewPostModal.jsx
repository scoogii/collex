import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTheme } from "@emotion/react";
import styles from "@/styles/Home.module.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useEffect, useState } from "react";
import EditCampaignPostModal from "./EditCampaignPostModal";
import { Delete } from "@mui/icons-material";
import AlertBar from "../AlertBar";
import SuccessBar from "../SuccessBar";

const ViewPostModal = ({
  post,
  isAuthor,
  readOpen,
  setReadOpen,
  getCampaignPosts,
}) => {
  ////////// STATE VARIABLES //////////
  const [isAdmin, setIsAdmin] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const theme = useTheme();

  ////////// HANDLERS //////////
  const handleDeletePost = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/delete_campaign_post?username=${localStorage.getItem(
        "username",
      )}&post_id=${post.id}`,
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
      setSuccessMessage("Successfully deleted campaign post!");
      setSuccessOpen(true);
      getCampaignPosts();
    }
  };

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const contentContainerStyle = {
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  };

  const descriptionContentStyle = {
    marginTop: "2vh",
    width: "90%",
    height: "70%",
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (readOpen) {
      let admin = parseInt(localStorage.getItem("is_admin"));
      if (admin === 1) {
        console.log(admin);
        setIsAdmin(admin);
      }
    }
  }, [readOpen]);

  return (
    <>
      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message={successMessage}
      />

      <EditCampaignPostModal
        post={post}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        getCampaignPosts={getCampaignPosts}
      />

      <Modal
        open={readOpen}
        onClose={() => {
          setReadOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          className="flex"
          sx={{
            flexDirection: "column",
            width: { xs: "90vw", sm: "70vw" },
            height: { xs: "80vh", sm: "80vh" },
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
          }}
        >
          <Button
            className={styles.scaleButton}
            onClick={() => {
              setReadOpen(false);
            }}
            sx={{
              position: "absolute",
              right: { xs: "calc(5vw)", sm: "calc(15vw)" },
              top: { xs: "calc(10vh)", sm: "calc(10vh)" },
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

          <Box sx={contentContainerStyle}>
            <Typography
              variant="h3"
              sx={{
                marginTop: "1vh",
                marginBottom: "1vh",
                fontSize: { xs: "20pt", sm: "22pt", md: "25pt", lg: "30pt" },
                color: "#8c52ff",
              }}
            >
              {post.post_title}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Published by: {post.author_username}
            </Typography>

            <Typography sx={{ textAlign: "center", fontStyle: "italic" }}>
              {post.time_created}
            </Typography>

            <Box
              sx={{
                display: "flex",
                width: "90%",
              }}
            >
              {isAuthor && (
                <Tooltip title="Edit Description">
                  <IconButton
                    onClick={() => {
                      setEditOpen(true);
                    }}
                  >
                    <EditRoundedIcon
                      sx={{ width: 35, height: 35, color: "#8c52ff" }}
                    />
                  </IconButton>
                </Tooltip>
              )}

              {(isAdmin || isAuthor) && (
                <Tooltip title="Delete Post">
                  <IconButton
                    onClick={() => {
                      handleDeletePost();
                    }}
                  >
                    <Delete sx={{ width: 35, height: 35, color: "#de163b" }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Paper elevation={0} sx={descriptionContentStyle}>
              <Typography
                sx={{
                  textAlign: "center",
                  overflowWrap: "anywhere",
                  marginTop: "1vh",
                  fontSize: "14pt",
                }}
              >
                {post.post_description}
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default ViewPostModal;

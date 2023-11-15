import {
  Box,
  Button,
  Modal,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AlertBar from "../AlertBar";
import SuccessBar from "../SuccessBar";
import { useTheme } from "@emotion/react";
import styles from "@/styles/Home.module.css";

const ReviewModal = ({ reviewOpen, setReviewOpen, getReputation }) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  ////////// HANDLERS //////////
  const handleSubmitReview = async () => {
    const response = await fetch(
      `http://localhost:8080/reputation/add_review?reviewer=${localStorage.getItem(
        "username",
      )}&reviewee=${router.query.user
      }&rating=${rating}&message=${reviewMessage}`,
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
      setSuccessOpen(true);
      getReputation();
      setReviewOpen(false);
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
    padding: "10px",
    overflow: "auto",
  };

  const ratingStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: { xs: "60px", sm: "80px", md: "100px" },
  };

  const reviewStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: { xs: "160px", sm: "180px", md: "200px" },
  };

  const submitStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: { xs: "150px", sm: "170px", md: "190px" },
  };

  const textFieldStyle = {
    width: { xs: "250px", sm: "400px", md: "450px" },
    color: "black",
    "& label.Mui-focused": {
      color: "#8c52ff",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#8c52ff",
      },
    },
  };

  const reviewButtonStyle = {
    background: "#8c52ff",
    fontSize: "14pt",
    width: { xs: "150px", md: "160px" },
    height: { xs: "55px", md: "65px" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (!reviewOpen) {
      setRating(0);
      setReviewMessage("");
    }
  }, [reviewOpen]);

  return (
    <>
      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message="Successfully left a review!"
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
        open={reviewOpen}
        onClose={() => {
          setReviewOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          sx={{
            width: { xs: "350px", sm: "500px", md: "600px" },
            height: { xs: "450px", sm: "500px", md: "600px" },
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
          }}
        >
          <Box sx={modalContainerStyle}>
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography variant="h4" sx={{ marginTop: "3vh" }}>
                Write a Review
              </Typography>
            </Box>

            <Box sx={ratingStyle}>
              <Rating
                precision={1}
                onChange={(e) => {
                  setRating(e.target.value);
                }}
                icon={
                  <StarRateRoundedIcon
                    fontSize="inherit"
                    sx={{
                      width: { xs: "30px", md: "40px" },
                      height: { xs: "30px", md: "40px" },
                    }}
                  />
                }
                emptyIcon={
                  <StarBorderRoundedIcon
                    fontSize="inherit"
                    sx={{
                      width: { xs: "30px", md: "40px" },
                      height: { xs: "30px", md: "40px" },
                    }}
                  />
                }
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#fac13c",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#faaf00",
                  },
                }}
              />
            </Box>

            <Box sx={reviewStyle}>
              <Typography variant="h6">Comments</Typography>
              <TextField
                multiline
                rows={4}
                label="Write a comment"
                value={reviewMessage}
                onChange={(e) => {
                  setReviewMessage(e.target.value);
                }}
                sx={textFieldStyle}
                inputProps={{
                  sx: {
                    height: { xs: "100px" },
                  },
                }}
              />
            </Box>

            <Box sx={submitStyle}>
              <Button
                className={styles.selectButton}
                onClick={() => {
                  handleSubmitReview();
                }}
                sx={reviewButtonStyle}
              >
                Leave Review
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default ReviewModal;

import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  Paper,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { useEffect, useState } from "react";
import ReviewModal from "./ReviewModal";
import ReviewBlock from "./ReviewBlock";
import { useRouter } from "next/router";

const ExperiencePanel = ({
  rating,
  numRatings,
  reviews,
  getReputation,
  canAdd,
}) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const router = useRouter();
  const [level, setLevel] = useState(0);
  const [token, setToken] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  ////////// HANDLERS //////////
  const getLevel = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/get_user_level?username=${router.query.user}`,
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
      setLevel(data["level"]);
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

  const reviewContainerStyle = {
    textAlign: "center",
    width: "100%",
    height: { xs: "350px", sm: "400px", md: "450px", lg: "500px" },
    background: theme.palette.primary.main,
    padding: "10px",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    overflow: "auto",
  };

  const reviewStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    background: theme.palette.tertiary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    height: { xs: "110px", sm: "125px", md: "145px", lg: "130px" },
    width: "100%",
    padding: "10px",
    textAlign: "left",
    overflow: "auto",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.user) {
      getLevel();
    }
  }, [router.query.user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, [router.query.user]);

  return (
    <>
      <ReviewModal
        reviewOpen={reviewOpen}
        setReviewOpen={setReviewOpen}
        getReputation={getReputation}
      />

      <Paper sx={gridPaperStyle}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Experience
        </Typography>

        <Box
          sx={{
            padding: "0 3vw",
            width: "100%",
            textAlign: "left",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", marginBottom: "5vh" }}
          >
            Level {level}
            <WhatshotRoundedIcon sx={{ marginLeft: "1vw" }} />
          </Typography>

          <Box
            sx={{
              marginBottom: "8vh",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1vw",
                marginBottom: "1vh",
              }}
            >
              <Tooltip title={`${numRatings} reviews`}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Reviews
                </Typography>
              </Tooltip>

              <Rating
                readOnly
                value={rating}
                icon={
                  <StarRateRoundedIcon
                    fontSize="inherit"
                    sx={{ width: "30px", height: "30px" }}
                  />
                }
                emptyIcon={
                  <StarBorderRoundedIcon
                    fontSize="inherit"
                    sx={{ width: "30px", height: "30px" }}
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

              {!canAdd && token && (
                <IconButton
                  sx={{ marginLeft: "-1vw" }}
                  onClick={() => {
                    setReviewOpen(true);
                  }}
                >
                  <Tooltip title="Leave a review">
                    <RateReviewIcon
                      sx={{ color: "#8c52ff", width: 30, height: 30 }}
                    />
                  </Tooltip>
                </IconButton>
              )}
            </Box>

            <Paper elevation={0} sx={reviewContainerStyle}>
              {reviews.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography>No current reviews.</Typography>
                </Box>
              )}

              {reviews.length !== 0 && (
                <Box
                  className="flex"
                  sx={{ flexDirection: "column", width: "100%", gap: "10px" }}
                >
                  {reviews.map((review, index) => (
                    <Paper key={index} elevation={0} sx={reviewStyle}>
                      <ReviewBlock
                        review={review}
                        isProfile={
                          router.query.user === localStorage.getItem("username")
                        }
                        getReputation={getReputation}
                      />
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ExperiencePanel;

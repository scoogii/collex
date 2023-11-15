import { Box, Paper, Rating, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import ReviewBlock from "../experience/ReviewBlock";
import { StarRateRounded } from "@mui/icons-material";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import { useRouter } from "next/router";

const UserExperiencePreview = ({ reviews, rating, getReputation }) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const router = useRouter();

  ////////// STYLES //////////
  const reviewContainerStyle = {
    textAlign: "center",
    width: { xs: "80%", md: "60%" },
    height: { xs: "300px", md: "400px", lg: "500px" },
    background: theme.palette.primary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
    overflow: "auto",
    marginBottom: "50px",
  };

  const reviewStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    background: theme.palette.tertiary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
    height: "12vh",
    width: "100%",
    padding: "10px",
    textAlign: "left",
    overflow: "auto",
  };

  return (
    <>
      <Box
        className="flex"
        sx={{ flexDirection: "column", width: "100%", gap: "20px" }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.main,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Reviews
        </Typography>

        <Rating
          readOnly
          value={rating}
          icon={
            <StarRateRounded
              fontSize="inherit"
              sx={{ width: "40px", height: "40px" }}
            />
          }
          emptyIcon={
            <StarBorderRounded
              fontSize="inherit"
              sx={{ width: "40px", height: "40px" }}
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

        <Paper elevation={0} sx={reviewContainerStyle}>
          {reviews.length === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                border: "1px solid",
                borderColor: theme.palette.border.main,
              }}
            >
              <Typography>No current reviews.</Typography>
            </Box>
          )}

          {reviews.length !== 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
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
    </>
  );
};

export default UserExperiencePreview;

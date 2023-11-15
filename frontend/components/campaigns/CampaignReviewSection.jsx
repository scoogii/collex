import { useTheme } from "@emotion/react";
import {
  AddBoxRounded,
  StarBorderRounded,
  StarRateRounded,
} from "@mui/icons-material";
import { Box, IconButton, Rating, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReviewCampaignModal from "./ReviewCampaignModal";
import CampaignReviewBlock from "./CampaignReviewBlock";

const CampaignReviewSection = ({
  getCampaignReviews,
  rating,
  numRatings,
  reviews,
  managerName,
  username,
}) => {
  ////////// STATE VARIABLES //////////
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [createReviewOpen, setCreateReviewOpen] = useState(false);
  const theme = useTheme();

  ////////// STYLES //////////
  const reviewSectionStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: { xs: "300px", md: "400px", lg: "500px" },
    width: { xs: "100%", md: "60%" },
    padding: "10px",
    marginTop: "-30px",
    marginBottom: "50px",
    background: theme.palette.primary.main,
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
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
    height: { xs: "110px", sm: "125px", md: "145px", lg: "160px" },
    width: "100%",
    padding: "10px",
    textAlign: "left",
    overflow: "auto",
  };

  ////////// USE EFFECTs //////////
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <ReviewCampaignModal
        reviewOpen={createReviewOpen}
        setReviewOpen={setCreateReviewOpen}
        getCampaignReviews={getCampaignReviews}
      />

      <Typography variant="h3" sx={{ textAlign: "center", marginTop: "3vh" }}>
        Reviews
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: { xs: "95%", md: "58%" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "5px",
          }}
        >
          <Tooltip
            title={numRatings !== 1 ? `${numRatings} reviews` : "1 review"}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Rating
            </Typography>
          </Tooltip>

          <Rating
            readOnly
            value={rating}
            icon={
              <StarRateRounded
                fontSize="inherit"
                sx={{ width: "30px", height: "30px" }}
              />
            }
            emptyIcon={
              <StarBorderRounded
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

          {managerName !== username && isLoggedIn && (
            <Tooltip title="Leave a review">
              <IconButton
                onClick={() => {
                  setCreateReviewOpen(true);
                }}
              >
                <AddBoxRounded
                  sx={{
                    width: 35,
                    height: 35,
                    color: "#8c52ff",
                    marginLeft: "-5px",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box sx={reviewSectionStyle}>
        {reviews.length === 0 && (
          <Box className="flex" sx={{ width: "100%", height: "100%" }}>
            No current campaigns for this campaign.
          </Box>
        )}

        {reviews.length !== 0 && (
          <Box
            className="flex"
            sx={{ flexDirection: "column", width: "100%", gap: "10px" }}
          >
            {reviews.map((review, index) => (
              <Box key={index} sx={reviewStyle}>
                <CampaignReviewBlock
                  review={review}
                  isProfile={review.reviewer === username}
                  getCampaignReviews={getCampaignReviews}
                  managerName={managerName}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default CampaignReviewSection;

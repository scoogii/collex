import {
  Box,
  Button,
  IconButton,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useTheme } from "@emotion/react";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import AlertBar from "../AlertBar";
import SuccessBar from "../SuccessBar";
import { useState } from "react";
import ViewReviewModal from "../experience/ViewReviewModal";

const CampaignReviewBlock = ({
  review,
  isProfile,
  getCampaignReviews,
  managerName,
}) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const [viewOpen, setViewOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  ////////// HANDLERS //////////
  const handleRemoveReview = async () => {
    const response = await fetch(
      `http://localhost:8080/reputation/remove_campaign_review?review_id=${review["id"]}`,
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
      getCampaignReviews();
      setSuccessOpen(true);
    }
  };

  return (
    <>
      <ViewReviewModal
        viewOpen={viewOpen}
        setViewOpen={setViewOpen}
        review={review}
      />

      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message="Review successfully removed!"
      />

      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          component="img"
          src="/profile_image.png"
          sx={{
            width: "30px",
            height: "30px",
          }}
        />
        <Button
          className={styles.scaleButton}
          component={Link}
          href={`/profile/${review["reviewer"]}`}
          target="_blank"
          sx={{
            color: theme.palette.text.main,
            textTransform: "none",
          }}
        >
          <Typography variant="h6">{review["reviewer"]}</Typography>
        </Button>

        <Rating
          readOnly
          value={review["rating"]}
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

        <Tooltip title="View review">
          <IconButton
            onClick={() => {
              setViewOpen(true);
            }}
          >
            <RemoveRedEyeRoundedIcon sx={{ color: "#8c52ff" }} />
          </IconButton>
        </Tooltip>

        {review["reviewer"] === localStorage.getItem("username") ||
          (managerName === localStorage.getItem("username") && (
            <Tooltip title="Remove review">
              <IconButton
                onClick={() => {
                  handleRemoveReview();
                }}
              >
                <DeleteRoundedIcon sx={{ color: "#d93848" }} />
              </IconButton>
            </Tooltip>
          ))}

        {isProfile && (
          <Tooltip title="Remove review">
            <IconButton
              onClick={() => {
                handleRemoveReview();
              }}
            >
              <DeleteRoundedIcon sx={{ color: "#d93848" }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box width="100%">
        <Typography
          sx={{
            maxWidth: "80%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {review["message"]}
        </Typography>
      </Box>
    </>
  );
};

export default CampaignReviewBlock;

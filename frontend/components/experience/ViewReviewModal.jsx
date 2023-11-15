import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { CloseRounded } from "@mui/icons-material";

const ViewReviewModal = ({ viewOpen, setViewOpen, review }) => {
  const theme = useTheme();

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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    height: { xs: "250px", sm: "270px", md: "320px" },
    width: { xs: "250px", sm: "400px", md: "450px" },
    border: "1px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    padding: "10px",
  };

  return (
    <>
      <Modal
        disableAutoFocus={true}
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
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
                  setViewOpen(false);
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

            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography variant="h4" sx={{ marginTop: "3vh" }}>
                {review["reviewer"]}&apos;s Review
              </Typography>
            </Box>

            <Box sx={ratingStyle}>
              <Rating
                readOnly
                value={review["rating"]}
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
              <Box width="100%">
                <Typography sx={{ wordBreak: "break-word" }}>
                  {review["message"]}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default ViewReviewModal;

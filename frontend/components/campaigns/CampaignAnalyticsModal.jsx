import { useTheme } from "@emotion/react";
import { CloseRounded } from "@mui/icons-material";
import { Box, IconButton, Modal, Paper, Typography } from "@mui/material";
import CollectibleContainer from "../CollectibleContainer";

const CampaignAnalyticsModal = ({
  campaign,
  collectibles,
  analyticsOpen,
  setAnalyticsOpen,
}) => {
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
    background: theme.palette.tertiary.main,
  };

  const contentStyle = {
    alignItems: "center",
    textAlign: "center",
    width: "95%",
    height: "80%",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.primary.main,
    padding: "10px",
    gap: "10px",
    overflow: "auto",
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
    height: { xs: "30px", sm: "50px", lg: "60px" },
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
      <Modal
        disableAutoFocus={true}
        open={analyticsOpen}
        onClose={() => {
          setAnalyticsOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          sx={{
            width: { xs: "350px", sm: "550px", md: "700px", lg: "800px" },
            height: { xs: "450px", sm: "500px", md: "600px", lg: "650px" },
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
                  setAnalyticsOpen(false);
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

            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {campaign.series_name}
            </Typography>

            <Box sx={contentStyle}>
              <Box
                className="flex"
                sx={{ flexDirection: "column", gap: "10px" }}
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

                      <Typography>{collectible.name}</Typography>
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
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default CampaignAnalyticsModal;

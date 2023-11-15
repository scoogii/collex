import { useTheme } from "@emotion/react";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import CollectibleContainer from "../CollectibleContainer";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const TradesHistory = ({ historicalTrades, tradeContainerStyle }) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();

  ////////// STYLES //////////
  const imageStyle = { height: { xs: "65px" }, borderRadius: "12px" };

  const collectibleContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    height: { xs: "80px" },
    border: "1px solid",
    borderColor: theme.palette.border.main,
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const tradeListingStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    background: theme.palette.tertiary.main,
    width: "100%",
    height: { xs: "160px", md: "200px" },
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
  };

  return (
    <>
      <Paper elevation={0} sx={tradeContainerStyle}>
        {historicalTrades.length === 0 && (
          <Box
            className="flex"
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Typography>No trades in history.</Typography>
          </Box>
        )}

        {historicalTrades.map((trade, index) => (
          <Paper key={index} elevation={0} sx={tradeListingStyle}>
            <Box className="flex" sx={{ width: "80%" }}>
              <Box sx={{ width: "50%", marginLeft: "10px" }}>
                <Box className="flex">
                  <Box
                    component="img"
                    src="/profile_image.png"
                    sx={{ width: "30px", height: "30px" }}
                  />
                  <Button
                    className={styles.scaleButton}
                    component={Link}
                    href={`/profile/${trade["initiator"]}`}
                    target="_blank"
                    sx={{
                      color: theme.palette.text.main,
                      textTransform: "none",
                    }}
                  >
                    <Typography variant="h5">{trade["initiator"]}</Typography>
                  </Button>
                </Box>
                <Paper elevation={0} sx={collectibleContainerStyle}>
                  {trade["offered_collectibles"].map((collectible, index) => (
                    <CollectibleContainer
                      key={index}
                      collectible={collectible}
                      imageStyle={imageStyle}
                      isProfile={false}
                    />
                  ))}
                </Paper>
                <Typography variant="h7" sx={{ fontStyle: "italic" }}>
                  {trade["offered_collectibles"].length === 1 ? (
                    <>{trade["offered_collectibles"].length} item</>
                  ) : (
                    <>{trade["offered_collectibles"].length} items </>
                  )}
                </Typography>
              </Box>

              <SwapHorizIcon
                sx={{
                  width: "30px",
                  marginTop: "1vh",
                  color: "#8c52ff",
                }}
              />

              <Box sx={{ width: "50%" }}>
                <Box className="flex">
                  <Box
                    component="img"
                    src="/profile_image.png"
                    sx={{ width: "30px", height: "30px" }}
                  />
                  <Button
                    className={styles.scaleButton}
                    component={Link}
                    href={`/profile/${trade["target"]}`}
                    target="_blank"
                    sx={{
                      color: theme.palette.text.main,
                      textTransform: "none",
                    }}
                  >
                    <Typography variant="h5">{trade["target"]}</Typography>
                  </Button>
                </Box>
                <Paper elevation={0} sx={collectibleContainerStyle}>
                  {trade["requested_collectibles"].map((collectible, index) => (
                    <CollectibleContainer
                      key={index}
                      collectible={collectible}
                      imageStyle={imageStyle}
                      isProfile={false}
                    />
                  ))}
                </Paper>
                <Typography variant="h7" sx={{ fontStyle: "italic" }}>
                  {trade["requested_collectibles"].length === 1 ? (
                    <>{trade["requested_collectibles"].length} item</>
                  ) : (
                    <>{trade["requested_collectibles"].length} items </>
                  )}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: "15%", marginLeft: "3%" }}>
              <Box
                className="flex"
                sx={{ flexDirection: "column", gap: "1.5rem" }}
              >
                <Box
                  className="flex"
                  sx={{ flexDirection: "column", gap: "1.1rem" }}
                >
                  {trade["is_successful"] ? (
                    <Chip
                      label="Accepted"
                      sx={{
                        width: { xs: "80%", sm: "85%", md: "100%" },
                        background: "#40cf7e",
                        fontSize: { sm: "10pt", md: "12pt", lg: "13pt" },
                      }}
                    />
                  ) : (
                    <Chip
                      label="Declined"
                      sx={{
                        width: { xs: "80%", sm: "85%", md: "100%" },
                        background: "#e62246",
                        fontSize: { sm: "10pt", md: "12pt", lg: "13pt" },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Paper>
    </>
  );
};

export default TradesHistory;

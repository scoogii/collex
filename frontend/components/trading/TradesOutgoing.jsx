import { useTheme } from "@emotion/react";
import { Box, Button, Paper, Typography } from "@mui/material";
import CollectibleContainer from "../CollectibleContainer";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useEffect, useState } from "react";
import AlertBar from "../AlertBar";
import SuccessBar from "../SuccessBar";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const TradesOutgoing = ({
  outgoingTrades,
  getOutgoingTrades,
  tradeContainerStyle,
}) => {
  ////////// STATE VARIABLES //////////
  const [isProfile, setIsProfile] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const handleCancelTrade = async (id) => {
    const response = await fetch(
      `http://localhost:8080/trading/remove_trade_listing?trade_id=${id}`,
      {
        method: "POST",
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
      getOutgoingTrades();
      setSuccessOpen(true);
    }
  };

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

  const cancelButtonStyle = {
    background: "#e62246",
    fontSize: { xs: "10pt", sm: "11pt" },
    width: { xs: "10%", lg: "100%" },
    height: { lg: "100%" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#b01733",
    },
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.user) {
      if (router.query.user === localStorage.getItem("username")) {
        setIsProfile(true);
      }
    }
  }, [router.query.user]);

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
        message="Trade successfully cancelled!"
      />

      <Paper elevation={0} sx={tradeContainerStyle}>
        {outgoingTrades.length === 0 && (
          <Box
            className="flex"
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Typography>No outgoing trades.</Typography>
          </Box>
        )}

        {outgoingTrades.map((trade, index) => (
          <Paper key={index} elevation={0} sx={tradeListingStyle}>
            <Box className="flex" sx={{ width: isProfile ? "80%" : "100%" }}>
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

              <Box
                sx={{ width: "50%", marginRight: isProfile ? "0px" : "10px" }}
              >
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

            {isProfile && (
              <Box sx={{ width: "15%", marginLeft: "3%" }}>
                <Box
                  className="flex"
                  sx={{ flexDirection: "column", gap: "1.5rem" }}
                >
                  <Box
                    className="flex"
                    sx={{ flexDirection: "column", gap: "1.1rem" }}
                  >
                    {localStorage.getItem("username") ===
                      trade["initiator"] && (
                        <Button
                          className={styles.selectButton}
                          sx={cancelButtonStyle}
                          onClick={() => {
                            handleCancelTrade(trade["id"]);
                          }}
                        >
                          Cancel Trade
                        </Button>
                      )}
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        ))}
      </Paper>
    </>
  );
};

export default TradesOutgoing;

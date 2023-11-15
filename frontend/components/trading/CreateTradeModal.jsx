import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useState } from "react";
import TradeBlock from "./TradeBlock";
import SuccessBar from "../SuccessBar";
import AlertBar from "../AlertBar";
import TradingCollectionContainer from "./TradingCollectionContainer";

const CreateTradeModal = ({
  target,
  createOpen,
  setCreateOpen,
  getOutgoingTrades,
}) => {
  const theme = useTheme();
  const [colesSeries, setColesSeries] = useState([]);
  const [wooliesSeries, setWooliesSeries] = useState([]);
  const [alignment, setAlignment] = useState("initiator");
  const [initiator, setInitiator] = useState("");
  const [initiatorCollection, setInitiatorCollection] = useState([]);
  const [targetCollection, setTargetCollection] = useState([]);
  const [initiatorCollectibles, setInitiatorCollectibles] = useState([]);
  const [targetCollectibles, setTargetCollectibles] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  ////////// HANDLERS //////////
  const getAllCollectiblesBySeries = async () => {
    const response = await fetch(
      "http://localhost:8080/collectible/get_all_collectibles_and_series",
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
      setWooliesSeries(data["Woolworths"]);
      setColesSeries(data["Coles"]);
    }
  };

  const handleChange = (e) => {
    setAlignment(e.target.value);
  };

  const handleInitToggle = (collectible) => {
    if (initiatorCollectibles.includes(collectible)) {
      setInitiatorCollectibles(
        initiatorCollectibles.filter((item) => item !== collectible),
      );
    } else {
      setInitiatorCollectibles([...initiatorCollectibles, collectible]);
    }
  };

  const handleTargetToggle = (collectible) => {
    if (targetCollectibles.includes(collectible)) {
      setTargetCollectibles(
        targetCollectibles.filter((item) => item !== collectible),
      );
    } else {
      setTargetCollectibles([...targetCollectibles, collectible]);
    }
  };

  const handleCreateTrade = async () => {
    let initiatorIDs = initiatorCollectibles.map((item) => item.id);
    let targetIDs = targetCollectibles.map((item) => item.id);

    const response = await fetch(
      `http://localhost:8080/trading/create_trade_listing`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          initiator_username: localStorage.getItem("username"),
          target_username: target,
          offered_collectible_ids: initiatorIDs,
          requested_collectible_ids: targetIDs,
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      if (response.status !== 200) {
        setAlertMessage(data.message);
        setAlertOpen(true);
        return;
      } else {
        getOutgoingTrades();
        setSuccessOpen(true);
      }

      setCreateOpen(false);
    }
  };

  const getInitiatorCollection = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/get_tradable?username=${localStorage.getItem(
        "username",
      )}`,
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
      setInitiatorCollection(data["tradable"]["collectibles"]);
    }
  };

  const getTargetCollection = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/get_tradable?username=${target}`,
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
      setTargetCollection(data["tradable"]["collectibles"]);
    }
  };

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const leftGridPaneStyle = {
    padding: "15px",
    overflow: "auto",
    borderRight: "1px solid",
    borderColor: theme.palette.border.main,
  };

  const rightGridPaneStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    padding: "15px",
    overflow: "auto",
    borderLeft: "1px solid",
    borderColor: theme.palette.border.main,
  };

  const toggleButtonStyle = {
    width: "50%",
    textTransform: "none",
    overflow: "auto",
  };

  const createButtonStyle = {
    background: "#8c52ff",
    fontSize: "15pt",
    width: { xs: "150px", md: "200px" },
    height: { xs: "55px", md: "60px" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
    marginTop: { xs: "20vh", sm: "10vh" },
  };

  ////////// STYLES //////////
  useEffect(() => {
    if (createOpen) {
      setAlignment("initiator");
      getAllCollectiblesBySeries();
      getInitiatorCollection();
      getTargetCollection();
    } else {
      setInitiatorCollectibles([]);
      setTargetCollectibles([]);
    }
  }, [createOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let init = localStorage.getItem("username");
    if (init) {
      setInitiator(init);
    }
  }, []);

  return (
    <>
      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message="Trade successfully sent!"
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
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          className="flex"
          sx={{
            flexDirection: "column",
            width: "90vw",
            height: "90vh",
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
          }}
        >
          <Button
            className={styles.scaleButton}
            onClick={() => {
              setCreateOpen(false);
            }}
            sx={{
              position: "absolute",
              right: { xs: "calc(3vw)", sm: "calc(5vw)" },
              top: "calc(5vh)",
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

          <Box
            className="flex"
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "20pt", sm: "22pt", md: "25pt", lg: "30pt" },
                marginTop: "3vh",
              }}
            >
              Create a Trade
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              className="flex"
              sx={{
                marginTop: "2vh",
                height: "80%",
                height: { xs: "50vh", sm: "60vh" },
              }}
            >
              <Grid
                container
                sx={{
                  marginTop: "5vh",
                  height: "60vh",
                  width: "90vw",
                  border: "1px solid",
                  borderColor: theme.palette.border.main,
                  overflow: "auto",
                }}
              >
                <Grid item xs={12} sm={6} sx={leftGridPaneStyle}>
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    sx={{
                      marginBottom: "3vh",
                      width: { xs: "250px", sm: "200px", lg: "280px" },
                    }}
                  >
                    <ToggleButton value="initiator" sx={toggleButtonStyle}>
                      {initiator}
                    </ToggleButton>
                    <ToggleButton value="target" sx={toggleButtonStyle}>
                      {target}
                    </ToggleButton>
                  </ToggleButtonGroup>

                  {alignment === "initiator" && (
                    <TradingCollectionContainer
                      wooliesSeries={wooliesSeries}
                      colesSeries={colesSeries}
                      collection={initiatorCollection}
                      selectedCollectibles={initiatorCollectibles}
                      handler={handleInitToggle}
                    />
                  )}
                  {alignment === "target" && (
                    <TradingCollectionContainer
                      wooliesSeries={wooliesSeries}
                      colesSeries={colesSeries}
                      collection={targetCollection}
                      selectedCollectibles={targetCollectibles}
                      handler={handleTargetToggle}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6} sx={rightGridPaneStyle}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: "1px solid",
                      borderColor: theme.palette.border.main,
                      padding: "1px",
                    }}
                  >
                    <Box
                      sx={{
                        height: "50%",
                        borderBottom: "1px solid",
                        borderColor: theme.palette.border.main,
                      }}
                    >
                      <TradeBlock
                        username={initiator}
                        collectibles={initiatorCollectibles}
                      />
                    </Box>
                    <Box
                      sx={{
                        height: "50%",
                        borderTop: "1px solid",
                        borderColor: theme.palette.tertiary.main,
                      }}
                    >
                      <TradeBlock
                        username={target}
                        collectibles={targetCollectibles}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            <Box className="flex" sx={{ height: "10%" }}>
              <Button
                disabled={
                  initiatorCollectibles.length === 0 &&
                  targetCollectibles.length === 0
                }
                className={styles.selectButton}
                sx={createButtonStyle}
                onClick={() => {
                  handleCreateTrade();
                }}
              >
                Send Trade
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default CreateTradeModal;

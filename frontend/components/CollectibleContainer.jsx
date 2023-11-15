import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Chip,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Link from "next/link";
import AlertBar from "./AlertBar";
import SuccessBar from "./SuccessBar";

const CollectibleContainer = ({
  collectible,
  imageStyle,
  isProfile,
  tradableOpen,
  untradableOpen,
}) => {
  ////////// STATE VARIABLES //////////
  const [infoOpen, setInfoOpen] = useState(false);
  const [series, setSeries] = useState("");
  const [tradable, setTradable] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const theme = useTheme();

  ////////// HANDLERS //////////
  const getSeries = async () => {
    const response = await fetch(
      `http://localhost:8080/collectible/get_series_by_collectible?collectible_id=${collectible["id"]}`,
      {
        method: "GET",
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
      setSeries(data["series"]);
    }
  };

  const getTradable = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/get_is_tradable?username=${localStorage.getItem(
        "username",
      )}&collectible_id=${collectible["id"]}`,
      {
        method: "GET",
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
      setTradable(data["is_collectible_tradable"]);
    }
  };

  const handleCollectibleClick = () => {
    setInfoOpen(true);
  };

  const handleTradable = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/add_as_tradable?username=${localStorage.getItem(
        "username",
      )}&collectible_id=${collectible["id"]}`,
      {
        method: "PUT",
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
      setSuccessMessage("Collectible is now marked as tradable!");
      setSuccessOpen(true);
      setTradable(true);
      getTradable();
    }
  };

  const handleUntradable = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/remove_as_tradable?username=${localStorage.getItem(
        "username",
      )}&collectible_id=${collectible["id"]}`,
      {
        method: "PUT",
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
      setSuccessMessage("Collectible is now marked as untradable!");
      setSuccessOpen(true);
      setTradable(false);
      getTradable();
    }
  };

  ////////// STYLES //////////
  const rarities = {
    Common: "#6e6e6e",
    Rare: "#3373f2",
    "Ultra-Rare": "#d24ff0",
    Legendary: "#f78725",
  };

  const seriesColours = {
    "Swag Monkeys": "#e0964c",
    "Epic Gamers": "#31a8d4",
    "Super Pets": "#5abd39",
    "Crazy Legends": "#ed4c37",
    "Astro World": "#477fba",
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const modalContainerStyle = {
    flexDirection: "row",
    width: { xs: "80vw", sm: "55vw", lg: "45vw" },
    height: { xs: "50vh", sm: "35vh", lg: "40vh" },
    background: theme.palette.primary.main,
    gap: { xs: "30px", md: "50px", lg: "70px" },
    overflow: "auto",
    padding: "10px",
    border: "2px solid",
    borderColor: theme.palette.border.main,
  };

  const buttonStyle = {
    background: "#8c52ff",
    fontSize: { lg: "14pt" },
    width: { xs: "130px", md: "170px" },
    height: { xs: "50px", md: "60px" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
    marginTop: "2vh",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (isProfile) {
      getTradable();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isProfile) {
      getTradable();
    }
  }, [tradableOpen, untradableOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getSeries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getSeries();
  }, [infoOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message={successMessage}
      />
      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Modal
        open={infoOpen}
        onClose={() => {
          setInfoOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper className="flex" sx={modalContainerStyle}>
          <Button
            className={styles.scaleButton}
            onClick={() => {
              setInfoOpen(false);
            }}
            sx={{
              position: "absolute",
              right: {
                xs: "calc(7.5vw)",
                sm: "calc(22.5vw)",
                lg: "calc(27vw)",
              },
              top: { xs: "calc(25vh)", sm: "calc(33vh)", lg: "calc(30vh)" },
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
            component="img"
            src={collectible["image_id"]}
            sx={{
              width: { xs: "100px", sm: "120px", md: "150px", lg: "200px" },
              height: { xs: "100px", sm: "120px", md: "150px", lg: "200px" },
              borderRadius: "18px",
              border: "4px solid",
              borderColor: rarities[collectible.rarity],
            }}
          />
          <Box
            className="flex"
            sx={{
              flexDirection: "column",
              height: "100%",
              background: theme.palette.primary.main,
              gap: "1vh",
            }}
          >
            <Box className="flex" sx={{ gap: "5px" }}>
              <Typography
                variant="h5"
                sx={{ textAlign: "left", fontWeight: "bold" }}
              >
                {collectible["name"]}
              </Typography>
            </Box>

            <Box
              component="img"
              src={`/${series.provider}.png`}
              sx={{ width: "50px" }}
            />

            <Chip
              label={series["name"]}
              sx={{
                fontSize: "11pt",
                color: "white",
                background: seriesColours[series["name"]],
              }}
            />

            <Chip
              label={collectible.rarity}
              sx={{
                fontSize: "11pt",
                color: "white",
                background: rarities[collectible.rarity],
              }}
            />

            {isProfile && (
              <Chip
                clickable={true}
                onClick={() => {
                  tradable ? handleUntradable() : handleTradable();
                }}
                label={tradable ? "Tradable" : "Untradable"}
                sx={{
                  color: "white",
                  background: tradable ? "#78d470" : "#787878",
                  fontSize: "12pt",
                }}
              />
            )}

            <Button
              component={Link}
              href={`/marketplace/collectible/${collectible.name}`}
              className={styles.selectButton}
              sx={buttonStyle}
            >
              On Marketplace
            </Button>
          </Box>
        </Paper>
      </Modal>
      <Tooltip title={collectible["name"]}>
        <Button onClick={handleCollectibleClick}>
          {isProfile && (
            <Box
              component="img"
              src={collectible["image_id"]}
              sx={imageStyle}
              style={
                tradable
                  ? { border: "3px solid #7cd996" }
                  : { border: "2px dotted #787878" }
              }
            />
          )}

          {!isProfile && (
            <Box
              component="img"
              src={collectible["image_id"]}
              sx={imageStyle}
            />
          )}
        </Button>
      </Tooltip>
    </>
  );
};

export default CollectibleContainer;

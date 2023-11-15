import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import styles from "@/styles/Home.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import SwapHorizontalCircleRoundedIcon from "@mui/icons-material/SwapHorizontalCircleRounded";
import DoNotDisturbOnTotalSilenceSharpIcon from "@mui/icons-material/DoNotDisturbOnTotalSilenceSharp";
import { useEffect, useState } from "react";
import AddCollectionModal from "./AddCollectionModal";
import RemoveCollectionModal from "./RemoveCollectionModal";
import CollectibleContainer from "../CollectibleContainer";
import TradableCollectionModal from "./TradableCollectionModal";
import UntradableCollectionModal from "./UntradableCollectionModal";

const EditModal = ({
  editOpen,
  setEditOpen,
  myCollectibles,
  getMyCollectibles,
}) => {
  ////////// STATE VARIABLeS //////////
  const [colesSeries, setColesSeries] = useState([]);
  const [wooliesSeries, setWooliesSeries] = useState([]);
  const theme = useTheme();
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [tradableOpen, setTradableOpen] = useState(false);
  const [untradableOpen, setUntradableOpen] = useState(false);

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

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const collectionContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  };

  const imageContainerStyle = {
    display: "flex",
    width: "10vh",
    height: "10vh",
    justifyContent: "center",
    alignItems: "center",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "18px",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getAllCollectiblesBySeries();
  }, []);

  return (
    <>
      <AddCollectionModal
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        wooliesSeries={wooliesSeries}
        colesSeries={colesSeries}
        getMyCollectibles={getMyCollectibles}
        myCollectibles={myCollectibles}
      />
      <RemoveCollectionModal
        removeOpen={removeOpen}
        setRemoveOpen={setRemoveOpen}
        wooliesSeries={wooliesSeries}
        colesSeries={colesSeries}
        getMyCollectibles={getMyCollectibles}
        myCollectibles={myCollectibles}
      />
      <TradableCollectionModal
        tradableOpen={tradableOpen}
        setTradableOpen={setTradableOpen}
        wooliesSeries={wooliesSeries}
        colesSeries={colesSeries}
        getMyCollectibles={getMyCollectibles}
        myCollectibles={myCollectibles}
      />

      <UntradableCollectionModal
        untradableOpen={untradableOpen}
        setUntradableOpen={setUntradableOpen}
        wooliesSeries={wooliesSeries}
        colesSeries={colesSeries}
        getMyCollectibles={getMyCollectibles}
        myCollectibles={myCollectibles}
      />

      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          className="flex"
          sx={{
            flexDirection: "column",
            width: { xs: "90vw", sm: "70vw" },
            height: { xs: "70vh", sm: "80vh" },
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
          }}
        >
          <Button
            className={styles.scaleButton}
            onClick={() => {
              setEditOpen(false);
            }}
            sx={{
              position: "absolute",
              right: { xs: "calc(5vw)", sm: "calc(15vw)" },
              top: { xs: "calc(15vh)", sm: "calc(10vh)" },
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

          <Typography
            variant="h3"
            sx={{
              marginTop: "1vh",
              marginBottom: "1vh",
              fontSize: { xs: "20pt", sm: "22pt", md: "25pt", lg: "30pt" },
            }}
          >
            Edit Collection
          </Typography>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "flex-start",
              marginLeft: "10vw",
            }}
          >
            <Tooltip title="Add to Collection">
              <IconButton
                onClick={() => {
                  setAddOpen(true);
                }}
                size="medium"
              >
                <AddBoxRoundedIcon
                  sx={{
                    color: "#8c52ff",
                    width: { xs: 30, md: 35, lg: 40 },
                    height: { xs: 30, md: 35, lg: 40 },
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Remove from Collection">
              <IconButton
                onClick={() => {
                  setRemoveOpen(true);
                }}
                size="medium"
              >
                <RemoveCircleRoundedIcon
                  sx={{
                    color: "#8c52ff",
                    width: { xs: 30, md: 35, lg: 40 },
                    height: { xs: 30, md: 35, lg: 40 },
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Make collectibles tradable">
              <IconButton
                onClick={() => {
                  setTradableOpen(true);
                }}
                size="medium"
              >
                <SwapHorizontalCircleRoundedIcon
                  sx={{
                    color: "#8c52ff",
                    width: { xs: 30, md: 35, lg: 40 },
                    height: { xs: 30, md: 35, lg: 40 },
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Make collectibles untradable">
              <IconButton
                onClick={() => {
                  setUntradableOpen(true);
                }}
                size="medium"
              >
                <DoNotDisturbOnTotalSilenceSharpIcon
                  sx={{
                    color: "#8c52ff",
                    width: { xs: 30, md: 35, lg: 40 },
                    height: { xs: 30, md: 35, lg: 40 },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          <Paper
            elevation={0}
            sx={{
              background: theme.palette.tertiary.main,
              width: { xs: "80vw", sm: "60vw" },
              height: { xs: "48vh", sm: "58vh" },
              border: "1px solid",
              borderColor: theme.palette.border.main,
              padding: "10px",
              overflow: "auto",
            }}
          >
            <Box sx={collectionContainerStyle}>
              {myCollectibles.map((collectible, index) => (
                <Box
                  className={styles.scaleButton}
                  sx={imageContainerStyle}
                  key={index}
                >
                  <CollectibleContainer
                    collectible={collectible}
                    imageStyle={imageStyle}
                    isProfile={true}
                    tradableOpen={tradableOpen}
                    untradableOpen={untradableOpen}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Paper>
      </Modal>
    </>
  );
};

export default EditModal;

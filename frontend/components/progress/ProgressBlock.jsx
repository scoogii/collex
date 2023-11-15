import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CollectibleContainer from "../CollectibleContainer";

const ProgressBlock = ({ series }) => {
  const [collected, setCollected] = useState([]);
  const [seriesCollectibles, setSeriesCollectibles] = useState([]);
  const [progress, setProgress] = useState({});
  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const getCollected = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/get_collection?username=${router.query.user}`,
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
      setCollected(
        data["collection"]["collectibles"].map(
          (collectible) => collectible.name,
        ),
      );
    }
  };

  const getSeriesCollectibles = async () => {
    const response = await fetch(
      `http://localhost:8080/collectible/get_series?series_id=${series.id}`,
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
      setSeriesCollectibles(data["series"]["collectibles"]);
    }
  };

  const getProgress = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/retrieve_progress?username=${router.query.user}&series_id=${series.id}`,
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
      setProgress(data["progress"]);
    }
  };

  ////////// STYLES //////////
  const seriesContentStyle = {
    display: "flex",
    alignItems: "center",
    height: "150px",
    width: "100%",
    border: "1px solid",
    padding: "10px",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.tertiary.main,
    marginBottom: "30px",
  };

  const collectiblesContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    height: "100%",
    width: "60%",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const progressContainerStyle = {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "40%",
  };

  const imageStyle = {
    height: "110px",
    borderRadius: "12px",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getCollected();
    getSeriesCollectibles();
    getProgress();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box className="flex" sx={{ flexDirection: "column" }}>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", marginBottom: "5px" }}
        >
          {series.name}
        </Typography>

        <Box sx={seriesContentStyle}>
          <Box sx={collectiblesContainerStyle}>
            {seriesCollectibles.map((collectible, index) => (
              <Box
                key={index}
                sx={{
                  opacity: collected.includes(collectible.name) ? "1" : "0.25",
                }}
              >
                <CollectibleContainer
                  collectible={collectible}
                  imageStyle={imageStyle}
                  isProfile={false}
                />
              </Box>
            ))}
          </Box>

          <Box sx={progressContainerStyle}>
            <CircularProgress
              variant="determinate"
              size={"100px"}
              thickness={5}
              value={parseInt(progress.percentage_collected)}
              sx={{ color: "#8c52ff" }}
            />

            <Typography
              className="flex"
              variant="h6"
              sx={{ position: "absolute" }}
            >
              {progress.percentage_collected}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProgressBlock;

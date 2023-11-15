import { useTheme } from "@emotion/react";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import UserCollectionPreview from "../user/UserCollectionPreview";
import UserExperiencePreview from "../user/UserExperiencePreview";
import { useEffect, useState } from "react";
import UserWishlistPreview from "./UserWishlistPreview";

const UserDashboard = () => {
  ////////// STATE VARIABLES //////////
  const [username, setUsername] = useState("");

  const [collectibles, setCollectibles] = useState([]);

  const [level, setLevel] = useState(0);
  const [rating, setRating] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [reviews, setReviews] = useState([]);

  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const getCollectibles = async () => {
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
      setCollectibles(data["collection"]["collectibles"]);
    }
  };

  const getLevel = async () => {
    const response = await fetch(
      `http://localhost:8080/collection/get_user_level?username=${router.query.user}`,
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
      setLevel(data["level"]);
    }
  };

  const getReputation = async () => {
    // Send request to backend for user's collectibles
    const response = await fetch(
      `http://localhost:8080/reputation/get_reputation?username=${router.query.user}`,
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
      setRating(data["reputation"]["average_rating"]);
      setNumRatings(data["reputation"]["number_of_ratings"]);
      setReviews(data["reputation"]["reviews"]);
    }
  };

  ////////// STYLES //////////
  const gridPaperStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    height: "calc(100vh - 85px)",
    paddingTop: "10px",
    paddingBottom: "10px",
    background: theme.palette.tertiary.main,
    gap: "50px",
    overflow: "auto",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.user) {
      setUsername(router.query.user);
      getCollectibles();
      getLevel();
      getReputation();
    }
  }, [router.query.user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Paper sx={gridPaperStyle}>
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.text.main,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {router.query.user}&apos;s Profile
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.main, textAlign: "center" }}
        >
          Level {level}
          &nbsp;•&nbsp;
          {collectibles.length} collectibles&nbsp;•&nbsp;
          {numRatings} ratings
        </Typography>
      </Box>

      <UserCollectionPreview collectibles={collectibles} />

      <UserWishlistPreview name={username} />

      <UserExperiencePreview
        reviews={reviews}
        rating={rating}
        getReputation={getReputation}
      />
    </Paper>
  );
};

export default UserDashboard;

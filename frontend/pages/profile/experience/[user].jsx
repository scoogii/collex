import { Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import Nav from "@/components/Nav";
import UserPanel from "@/components/user/UserPanel";
import ExperiencePanel from "@/components/experience/ExperiencePanel";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProfileExperience = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [rating, setRating] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [canAdd, setCanAdd] = useState(false);
  const router = useRouter();
  const theme = useTheme();

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

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.user) {
      getReputation();
    }
  }, [router.query.user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (router.query.user === localStorage.getItem("username")) {
      setCanAdd(true);
    }
  }, [router.query.user]);

  useEffect(() => {
    let isAdmin = localStorage.getItem("is_admin");
    if (parseInt(isAdmin) === 1) {
      router.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Nav toggleTheme={toggleTheme} />
      <Box
        bgcolor={theme.palette.primary.main}
        sx={{
          color: theme.palette.text.main,
          minHeight: "calc(100vh - 85px)",
          marginTop: "85px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            display: "flex",
            width: "100vw",
          }}
        >
          <Grid item xs={12} sm={3}>
            <UserPanel />
          </Grid>
          <Grid item xs={12} sm={9}>
            <ExperiencePanel
              rating={rating}
              numRatings={numRatings}
              reviews={reviews}
              getReputation={getReputation}
              canAdd={canAdd}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileExperience;

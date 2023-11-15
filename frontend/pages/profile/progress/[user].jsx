import { Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import Nav from "@/components/Nav";
import UserPanel from "@/components/user/UserPanel";
import ProgressPanel from "@/components/progress/ProgressPanel";
import { useEffect, useState } from "react";

const ProfileProgress = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [allSeries, setAllSeries] = useState([]);
  const theme = useTheme();

  ////////// HANDLERS //////////
  const getAllSeries = async () => {
    const response = await fetch(
      `http://localhost:8080/collectible/get_all_series`,
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
      setAllSeries(data["series"]);
    }
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    let isAdmin = localStorage.getItem("is_admin");
    if (parseInt(isAdmin) === 1) {
      router.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getAllSeries();
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
            <ProgressPanel allSeries={allSeries} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileProgress;

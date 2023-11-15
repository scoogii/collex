import { useTheme } from "@emotion/react";
import { Campaign, Group, SmartToy } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SeriesBlock from "../series/SeriesBlock";

const AdminDashboard = () => {
  ////////// STATE VARIABLES //////////
  const [numUsers, setNumUsers] = useState(0);
  const [numCampaigns, setNumCampaigns] = useState(0);
  const [series, setSeries] = useState([]);
  const router = useRouter();
  const theme = useTheme();

  ////////// HANDLERS //////////
  const getNumUsers = async () => {
    const response = await fetch("http://localhost:8080/auth/get_all_users", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      setNumUsers(data["accounts"].length);
    }
  };

  const getNumCampaigns = async () => {
    const response = await fetch(
      "http://localhost:8080/campaign/get_all_campaigns_for_users",
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
      setNumCampaigns(data["campaigns"].length);
    }
  };

  const getAllSeries = async () => {
    const response = await fetch(
      "http://localhost:8080/collectible/get_all_series",
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
      setSeries(data["series"]);
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
    gap: "3vh",
    overflow: "auto",
  };

  const overviewContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: { xs: "90%", lg: "60%" },
    height: { xs: "450px", sm: "500px", md: "600px" },
    padding: "10px",
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    color: theme.palette.text.main,
  };

  const seriesContainerStyle = {
    marginTop: "10px",
    padding: "10px",
    height: { xs: "200px", sm: "250px", lg: "400px" },
    width: "80%",
    background: theme.palette.primary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    overflow: "auto",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getNumUsers();
    getNumCampaigns();
    getAllSeries();
  }, []);

  return (
    <>
      <Paper sx={gridPaperStyle}>
        <Typography
          variant="h3"
          sx={{
            color: theme.palette.text.main,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {router.query.user}&apos;s Dashboard
        </Typography>

        <Box
          className="flex"
          sx={{
            flexDirection: "column",
            color: theme.palette.text.main,
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Overview
          </Typography>

          <Box sx={overviewContainerStyle}>
            <Typography
              className="flex"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              <Group sx={{ width: 30, height: 30, marginRight: "10px" }} />
              {numUsers} registered users
            </Typography>

            <Typography
              className="flex"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              <Campaign sx={{ width: 30, height: 30, marginRight: "10px" }} />
              {numCampaigns} active campaigns
            </Typography>

            <Box
              className="flex"
              sx={{ flexDirection: "column", width: "100%" }}
            >
              <Typography
                className="flex"
                variant="h5"
                sx={{ textAlign: "center" }}
              >
                <SmartToy sx={{ width: 30, height: 30, marginRight: "10px" }} />
                {series.length} collectible series:
              </Typography>

              <Box sx={seriesContainerStyle}>
                <Box
                  className="flex"
                  sx={{ flexDirection: "column", gap: "10px" }}
                >
                  {series.map((serie, index) => (
                    <SeriesBlock key={index} serie={serie} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default AdminDashboard;

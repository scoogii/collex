import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTheme } from "@emotion/react";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import "dayjs/locale/en-au";
import AlertBar from "../AlertBar";
import SuccessBar from "../SuccessBar";

const CreateCampaignModal = ({ createOpen, setCreateOpen, getCampaigns }) => {
  ////////// STATE VARIABLES //////////
  const [seriesNames, setSeriesNames] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState({});
  const [endDate, setEndDate] = useState({});
  const [campaignDescription, setCampaignDescription] = useState("");
  const [series, setSeries] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const theme = useTheme();

  ////////// HANDLERS //////////
  const getSeriesNames = async () => {
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
      setSeriesNames(data.series.map((serie) => serie.name));
    }
  };

  const handleChangeDate = (e) => {
    if (e[0]) {
      const start = e[0];
      setStartDate({
        day: start.$D,
        month: start.$M + 1,
        year: start.$y,
      });
    }

    if (e[1]) {
      const end = e[1];

      setEndDate({
        day: end.$D,
        month: end.$M + 1,
        year: end.$y,
      });
    }
  };

  const handleCreateCampaign = async () => {
    const response = await fetch(
      "http://localhost:8080/campaign/create_campaign",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          campaign_description: campaignDescription,
          campaign_start_date: `${startDate.day}/${startDate.month}/${startDate.year}`,
          campaign_end_date: `${endDate.day}/${endDate.month}/${endDate.year}`,
          campaign_manager_username: localStorage.getItem("username"),
          campaign_name: campaignName,
          series_name: series,
        }),
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      setCreateOpen(false);
      getCampaigns();
      setSuccessOpen(true);
    }
  };

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const formContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "column",
    background: theme.palette.tertiary.main,
    width: "90%",
    height: "80%",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    padding: "10px",
    gap: "20px",
    overflow: "auto",
  };

  const textFieldStyle = {
    width: "100%",
    background: theme.palette.primary.main,
    color: theme.palette.text.main,
    "& label.Mui-focused": {
      color: "#8c52ff",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#8c52ff",
      },
    },
    "& fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.main,
    },
    "&:hover fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: "#8c52ff",
    },
  };

  const inputFieldStyle = {
    width: "80%",
    background: "transparent",
  };

  const createButtonStyle = {
    background: "#8c52ff",
    fontSize: { lg: "12pt" },
    width: { xs: "140px", md: "160px" },
    minHeight: { xs: "60px", md: "70px" },
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
  };

  const seriesColours = {
    "Swag Monkeys": "#e0964c",
    "Epic Gamers": "#31a8d4",
    "Super Pets": "#5abd39",
    "Crazy Legends": "#ed4c37",
    "Astro World": "#477fba",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (!createOpen) {
      setCampaignName("");
      setStartDate("");
      setEndDate("");
      setCampaignDescription("");
      setSeries("");
    }
  }, [createOpen]);

  useEffect(() => {
    if (createOpen) {
      getSeriesNames();
    }
  }, [createOpen]);

  return (
    <>
      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message="Successfully created new campaign!"
      />

      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Modal
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
            width: { xs: "90vw", sm: "70vw" },
            height: { xs: "80vh", sm: "80vh" },
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
              right: { xs: "calc(5vw)", sm: "calc(15vw)" },
              top: { xs: "calc(10vh)", sm: "calc(10vh)" },
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
            New Campaign
          </Typography>

          <Paper elevation={0} sx={formContainerStyle}>
            <Paper elevation={0} className="flex" sx={inputFieldStyle}>
              <Typography>Name:&nbsp;</Typography>

              <TextField
                value={campaignName}
                placeholder="Enter a name"
                sx={textFieldStyle}
                onChange={(e) => {
                  setCampaignName(e.target.value);
                }}
              />
            </Paper>

            <Paper elevation={0} className="flex" sx={inputFieldStyle}>
              <Typography>Dates:&nbsp;</Typography>

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-au"
              >
                <DateRangePicker
                  disablePast
                  localeText={{ start: "Start date", end: "End date" }}
                  sx={textFieldStyle}
                  onChange={(e) => {
                    handleChangeDate(e);
                  }}
                  adapterLocale="en-au"
                />
              </LocalizationProvider>
            </Paper>

            <Paper elevation={0} className="flex" sx={inputFieldStyle}>
              <Typography>Description:&nbsp;</Typography>

              <TextField
                multiline
                rows={2}
                value={campaignDescription}
                placeholder="Enter a description"
                sx={textFieldStyle}
                onChange={(e) => {
                  setCampaignDescription(e.target.value);
                }}
              />
            </Paper>

            <Paper elevation={0} className="flex" sx={inputFieldStyle}>
              <Typography>Series:&nbsp;</Typography>

              <FormControl sx={{ width: "100%" }}>
                <InputLabel>Select Series</InputLabel>
                <Select
                  value={series}
                  label="Select Series"
                  onChange={(e) => {
                    setSeries(e.target.value);
                  }}
                  sx={textFieldStyle}
                  renderValue={(series) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        key={series}
                        label={series}
                        sx={{
                          background: seriesColours[series],
                          color: "white",
                          fontSize: "11pt",
                        }}
                      />
                    </Box>
                  )}
                >
                  {seriesNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            <Button
              className={styles.selectButton}
              sx={createButtonStyle}
              onClick={() => {
                handleCreateCampaign();
              }}
            >
              Create Campaign
            </Button>
          </Paper>
        </Paper>
      </Modal>
    </>
  );
};

export default CreateCampaignModal;

import { useTheme } from "@emotion/react";
import { Box, Paper, Typography } from "@mui/material";
import ProgressBlock from "./ProgressBlock";

const ProgressPanel = ({ allSeries }) => {
  const theme = useTheme();

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

  const allSeriesContainerStyle = {
    width: "90%",
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.primary.main,
    padding: "10px",
    marginBottom: "50px",
  };

  return (
    <Paper sx={gridPaperStyle}>
      <Typography variant="h3" sx={{ fontWeight: "bold" }}>
        Progress
      </Typography>

      <Box sx={allSeriesContainerStyle}>
        {allSeries.map((series, index) => (
          <ProgressBlock key={index} series={series} />
        ))}
      </Box>
    </Paper>
  );
};

export default ProgressPanel;

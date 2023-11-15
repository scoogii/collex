import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import TradesIncoming from "./TradesIncoming";
import TradesHistory from "./TradesHistory";
import TradesOutgoing from "./TradesOutgoing";
import SelectTradeModal from "./SelectTradeModal";

const TradingPanel = ({
  incomingTrades,
  outgoingTrades,
  getIncomingTrades,
  getOutgoingTrades,
  getHistoricalTrades,
  historicalTrades,
  canAdd,
}) => {
  const [alignment, setAlignment] = useState("Incoming");
  const [selectOpen, setSelectOpen] = useState(false);
  const theme = useTheme();

  ////////// HANDLERS //////////
  const handleChange = (e) => {
    setAlignment(e.target.value);
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

  const tradeContainerStyle = {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    width: "100%",
    height: { xs: "500px", md: "550px", lg: "600px" },
    background: theme.palette.primary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    padding: "10px",
    gap: "10px",
    overflow: "auto",
  };

  return (
    <>
      <SelectTradeModal
        selectOpen={selectOpen}
        setSelectOpen={setSelectOpen}
        getOutgoingTrades={getOutgoingTrades}
      />

      <Paper sx={gridPaperStyle}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Trading
        </Typography>
        <Box
          sx={{
            padding: "0 3vw",
            width: "100%",
            textAlign: "left",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5vh",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Trades
            </Typography>

            {canAdd && (
              <IconButton
                onClick={() => {
                  setSelectOpen(true);
                }}
              >
                <Tooltip title="Create a trade">
                  <AddCircleIcon
                    sx={{ color: "#8c52ff", width: 25, height: 25 }}
                  />
                </Tooltip>
              </IconButton>
            )}
          </Box>

          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={(e) => {
              handleChange(e);
            }}
            sx={{ marginBottom: "1vh" }}
          >
            <ToggleButton value="Incoming">Incoming</ToggleButton>
            <ToggleButton value="Outgoing">Outgoing</ToggleButton>
            <ToggleButton value="History">History</ToggleButton>
          </ToggleButtonGroup>

          {alignment === "Incoming" && (
            <TradesIncoming
              incomingTrades={incomingTrades}
              getIncomingTrades={getIncomingTrades}
              getHistoricalTrades={getHistoricalTrades}
              tradeContainerStyle={tradeContainerStyle}
            />
          )}

          {alignment === "Outgoing" && (
            <TradesOutgoing
              outgoingTrades={outgoingTrades}
              getOutgoingTrades={getOutgoingTrades}
              tradeContainerStyle={tradeContainerStyle}
            />
          )}

          {alignment === "History" && (
            <TradesHistory
              historicalTrades={historicalTrades}
              tradeContainerStyle={tradeContainerStyle}
            />
          )}
        </Box>
      </Paper>
    </>
  );
};

export default TradingPanel;

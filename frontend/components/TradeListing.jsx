import styles from "@/styles/Home.module.css";
import Link from "next/link";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CollectibleContainer from "./CollectibleContainer";

const { useTheme } = require("@emotion/react");
const { Paper, Box, Button, Typography, Chip } = require("@mui/material");

const TradeListing = ({ trade }) => {
  const theme = useTheme();

  ////////// STYLES //////////
  const collectibleContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    height: { xs: "80px" },
    border: "1px solid",
    borderColor: theme.palette.border.main,
    background: theme.palette.tertiary.main,
    overflow: "auto",
  };

  const listingStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    background: theme.palette.primary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
    overflow: "auto",
  };

  const imageStyle = { height: { xs: "65px" }, borderRadius: "12px" };

  return (
    <Paper elevation={0} sx={listingStyle}>
      <Box className="flex" sx={{ width: "80%", textAlign: "center" }}>
        <Box sx={{ width: "45%", marginLeft: "10px" }}>
          <Box className="flex">
            <Box
              component="img"
              src="/profile_image.png"
              sx={{ width: "30px", height: "30px" }}
            />
            <Button
              className={styles.scaleButton}
              component={Link}
              href={`/profile/${trade["initiator"]}`}
              target="_blank"
              sx={{
                color: theme.palette.text.main,
                textTransform: "none",
              }}
            >
              <Typography variant="h5">{trade["initiator"]}</Typography>
            </Button>
          </Box>

          <Paper elevation={0} sx={collectibleContainerStyle}>
            {trade["offered_collectibles"].map((collectible, index) => (
              <CollectibleContainer
                key={index}
                collectible={collectible}
                imageStyle={imageStyle}
                isProfile={false}
              />
            ))}
          </Paper>

          <Typography variant="h7" sx={{ fontStyle: "italic" }}>
            {trade["offered_collectibles"].length === 1 ? (
              <>{trade["offered_collectibles"].length} item</>
            ) : (
              <>{trade["offered_collectibles"].length} items </>
            )}
          </Typography>
        </Box>

        <SwapHorizIcon
          sx={{
            width: "30px",
            marginTop: "1.5vh",
            color: "#8c52ff",
          }}
        />

        <Box sx={{ width: "45%" }}>
          <Box className="flex">
            <Box
              component="img"
              src="/profile_image.png"
              sx={{ width: "30px", height: "30px" }}
            />
            <Button
              className={styles.scaleButton}
              component={Link}
              href={`/profile/${trade["target"]}`}
              target="_blank"
              sx={{
                color: theme.palette.text.main,
                textTransform: "none",
              }}
            >
              <Typography variant="h5">{trade["target"]}</Typography>
            </Button>
          </Box>

          <Paper elevation={0} sx={collectibleContainerStyle}>
            {trade["requested_collectibles"].map((collectible, index) => (
              <CollectibleContainer
                key={index}
                collectible={collectible}
                imageStyle={imageStyle}
                isProfile={false}
              />
            ))}
          </Paper>

          <Typography variant="h7" sx={{ fontStyle: "italic" }}>
            {trade["requested_collectibles"].length === 1 ? (
              <>{trade["requested_collectibles"].length} item</>
            ) : (
              <>{trade["requested_collectibles"].length} items </>
            )}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: "15%", marginLeft: "3%" }}>
        <Chip
          label={trade["is_active"] ? "Active" : "Completed"}
          sx={{
            background: trade["is_active"] ? "#40cf7e" : "#6552ba",
            fontSize: { sm: "10pt", md: "12pt", lg: "13pt" },
          }}
        />
      </Box>
    </Paper>
  );
};

export default TradeListing;

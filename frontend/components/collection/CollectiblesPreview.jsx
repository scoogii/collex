import { Box, Paper, ToggleButton, Tooltip, Typography } from "@mui/material";
import styles from "@/styles/Home.module.css";
import { useTheme } from "@emotion/react";

const CollectiblesPreview = ({
  series,
  collectibles,
  handler,
  buffer,
  containerStyle,
}) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();

  ////////// STYLES //////////
  const imageStyle = {
    maxWidth: { xs: "50px", sm: "60px", md: "70px", lg: "75px" },
    maxHeight: { xs: "50px", sm: "60px", md: "70px", lg: "75px" },
    borderRadius: "18px",
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontStyle: "italic",
          color: theme.palette.text.main,
        }}
      >
        {series}
      </Typography>

      <Paper elevation={0} sx={containerStyle}>
        {collectibles.length === 0 && (
          <Box
            className="flex"
            sx={{
              textAlign: "center",
              color: theme.palette.text.main,
              height: { xs: "50px", sm: "60px", md: "70px", lg: "75px" },
            }}
          >
            No valid collectibles from this series.
          </Box>
        )}

        {collectibles.map((collectible, index) => (
          <Box key={index} value={collectible}>
            <ToggleButton
              value={collectible["name"]}
              selected={buffer.includes(collectible)}
              className={styles.selectButton}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                border: "none",
              }}
              onClick={() => {
                handler(collectible);
              }}
            >
              <Tooltip title={collectible["name"]}>
                <Box
                  component="img"
                  src={collectible["image_id"]}
                  sx={imageStyle}
                />
              </Tooltip>
            </ToggleButton>
          </Box>
        ))}
      </Paper>
    </>
  );
};

export default CollectiblesPreview;

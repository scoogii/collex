import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import CollectibleContainer from "../CollectibleContainer";
import styles from "@/styles/Home.module.css";

const UserCollectionPreview = ({ collectibles }) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();

  ////////// STYLES //////////
  const collectiblesPreviewStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    height: "150px",
    width: { xs: "80%", md: "60%" },
    padding: "10px",
    gap: "10px",
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const imageContainerStyle = {
    display: "flex",
    width: { xs: "100px", sm: "110px", md: "120px" },
    height: { xs: "100px", sm: "110px", md: "120px" },
    justifyContent: "center",
    alignItems: "center",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "18px",
  };

  return (
    <>
      <Box
        className="flex"
        sx={{ flexDirection: "column", width: "100%", gap: "20px" }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.main,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Collectibles
        </Typography>

        <Box sx={collectiblesPreviewStyle}>
          {collectibles.map((collectible, index) => (
            <Box
              className={styles.scaleButton}
              sx={imageContainerStyle}
              key={index}
            >
              <CollectibleContainer
                collectible={collectible}
                imageStyle={imageStyle}
                isProfile={false}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default UserCollectionPreview;

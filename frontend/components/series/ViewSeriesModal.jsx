import { useTheme } from "@emotion/react";
import { CloseRounded } from "@mui/icons-material";
import { Box, IconButton, Modal, Paper, Typography } from "@mui/material";
import CollectibleContainer from "../CollectibleContainer";

const ViewSeriesModal = ({
  viewSeriesOpen,
  setViewSeriesOpen,
  serie,
  collectibles,
}) => {
  const theme = useTheme();

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    gap: "10px",
    padding: "10px",
    overflow: "auto",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px",
    height: "65%",
    width: "90%",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.tertiary.main,
  };

  const collectiblesContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
    padding: "2px",
    marginTop: "30px",
    width: "100%",
    height: { xs: "90px", sm: "100px" },
    border: "1px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const imageStyle = {
    height: { xs: "70px", sm: "80px" },
    borderRadius: "12px",
  };

  return (
    <Modal
      disableAutoFocus={true}
      open={viewSeriesOpen}
      onClose={() => {
        setViewSeriesOpen(false);
      }}
      sx={modalStyle}
    >
      <Paper
        sx={{
          width: { xs: "380px", sm: "550px", md: "600px" },
          height: { xs: "420px", md: "350px" },
          background: theme.palette.primary.main,
          border: "2px solid",
          borderColor: theme.palette.border.main,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            width: "100%",
            height: "3vh",
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setViewSeriesOpen(false);
            }}
          >
            <CloseRounded
              sx={{
                color: "#e65c53",
                width: { xs: 30, md: 35, lg: 40 },
                height: { xs: 30, md: 35, lg: 40 },
              }}
            />
          </IconButton>
        </Box>

        <Box sx={modalContainerStyle}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            {serie.name}
          </Typography>

          <Box sx={contentStyle}>
            <Typography variant="h5">
              {serie.total_number_of_collectibles} collectibles
            </Typography>

            <Box sx={collectiblesContainerStyle}>
              {collectibles.map((collectible, index) => (
                <CollectibleContainer
                  key={index}
                  collectible={collectible}
                  imageStyle={imageStyle}
                  isProfile={false}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ViewSeriesModal;

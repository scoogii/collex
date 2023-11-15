import { useTheme } from "@emotion/react";
import { Box, Button, Paper, Typography } from "@mui/material";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const TradeBlock = ({ username, collectibles }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: theme.palette.primary.main,
        overflow: "auto",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <Box
          component="img"
          src="/profile_image.png"
          sx={{
            height: { xs: "35px", sm: "40px", md: "50px" },
            width: { xs: "35px", sm: "40px", md: "50px" },
          }}
        />
        <Button
          className={styles.scaleButton}
          component={Link}
          href={`/profile/${username}`}
          target="_blank"
          sx={{
            color: theme.palette.text.main,
            textTransform: "none",
          }}
        >
          <Typography variant="h6">{username}</Typography>
        </Button>
      </Box>

      <Box
        className="flex"
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Paper
          elevation={0}
          className="flex"
          sx={{
            flexWrap: "wrap",
            width: "100%",
            background: theme.palette.tertiary.main,
            padding: "10px",
            border: "1px solid",
            borderColor: theme.palette.border.main,
            borderRadius: "12px",
            overflow: "auto",
            gap: "10px",
            minHeight: {
              xs: "90px",
              md: "100px",
              lg: "110px",
            },
            maxHeight: {
              xs: "90px",
              md: "190px",
              lg: "210px",
            },
          }}
        >
          {collectibles.map((collectible, index) => (
            <Box
              key={index}
              component="img"
              src={collectible["image_id"]}
              sx={{
                borderRadius: "14px",
                width: {
                  xs: "70px",
                  sm: "70px",
                  md: "80px",
                  lg: "90px",
                },
                height: {
                  xs: "70px",
                  sm: "70px",
                  md: "80px",
                  lg: "90px",
                },
              }}
            />
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default TradeBlock;

import { useTheme } from "@emotion/react";
import { Box, Paper } from "@mui/material";
import CampaignBlock from "./CampaignBlock";

const CampaignsBlock = ({ campaigns, getCampaigns, alignment, results }) => {
  const theme = useTheme();

  ////////// STYLES //////////
  const containerStyle = {
    width: "100%",
    height: "100%",
    overflow: "auto",
    background: theme.palette.primary.main,
  };

  return (
    <Paper elevation={0} sx={containerStyle}>
      {campaigns.length === 0 ? (
        <Box className="flex" sx={{ flexDirection: "column", height: "96%" }}>
          No {alignment} Campaigns.
        </Box>
      ) : null}

      <Box
        sx={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "auto",
        }}
      >
        {campaigns
          .filter((campaign) => {
            return campaign.status === alignment;
          })
          .filter((campaign) => {
            return results.length === 0
              ? true
              : results.includes(campaign.name);
          })
          .map((campaign, index) => (
            <CampaignBlock
              key={index}
              campaign={campaign}
              getCampaigns={getCampaigns}
            />
          ))}
      </Box>
    </Paper>
  );
};

export default CampaignsBlock;

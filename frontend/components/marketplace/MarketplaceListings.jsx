import { Box } from "@mui/material";
import TradeListing from "../TradeListing";

const MarketplaceListings = ({ listings }) => {
  ////////// STYLES //////////
  const listingsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  };

  return (
    <>
      {listings.length === 0 && (
        <Box
          className="flex"
          sx={{
            height: "100%",
            textAlign: "center",
          }}
        >
          No current trade listings for collectible.
        </Box>
      )}

      {listings.length !== 0 && (
        <Box sx={listingsContainerStyle}>
          {listings.map((trade, index) => (
            <TradeListing key={index} trade={trade} />
          ))}
        </Box>
      )}
    </>
  );
};

export default MarketplaceListings;

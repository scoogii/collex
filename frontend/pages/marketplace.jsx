import Nav from "@/components/Nav";
import MarketPlacePanel from "@/components/marketplace/MarketPlacePanel";

const marketplace = ({ toggleTheme }) => {
  return (
    <>
      <Nav toggleTheme={toggleTheme} />
      <MarketPlacePanel />
    </>
  );
};

export default marketplace;

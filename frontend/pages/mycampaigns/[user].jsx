import Nav from "@/components/Nav";
import CampaignPanel from "@/components/campaigns/CampaignPanel";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CampaignDashboard = ({ toggleTheme }) => {
  const [isShown, setIsShown] = useState(false);
  const router = useRouter();

  ////////// USE EFFECT //////////
  useEffect(() => {
    if (router.query.user) {
      let name = localStorage.getItem("username");
      if (name !== router.query.user) {
        router.push("/");
      } else {
        setIsShown(true);
      }
    }
  }, [router.query.user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isShown && (
        <>
          <Nav toggleTheme={toggleTheme} />
          <CampaignPanel />
        </>
      )}
    </>
  );
};

export default CampaignDashboard;

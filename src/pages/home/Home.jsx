import React from "react";
import HeroHome from "./HeroHome";
import PartnerMarque from "../../components/PartnerMarque";
import ServicesOverview from "./ServicesOverview";
import Industries from "./Industries";
import ProcessSteps from "./ProcessSteps";
import GlobalPresence from "./GlobalPresence";
import ImpactStats from "./ImpactStats";
import SuccessStories from "./SuccessStories";
import InsightsCarousel from "./InsightsCarousel";
import FinalCTA from "./FinalCTA";

const Home = () => {
  return (
    <div>
      <HeroHome />
      <PartnerMarque />
      <ServicesOverview />
      <Industries />
      <ProcessSteps />
      <GlobalPresence />
      <ImpactStats />
      <SuccessStories />
      <InsightsCarousel />
      <FinalCTA />
    </div>
  );
};

export default Home;

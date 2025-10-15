import React from "react";
import styled from "styled-components";
import Hero from "./Hero";
import FeaturedTemples from "./FeaturedTemples";
import HelpSection from "./HelpSection";
import Background from "./Background";
import Testimonials from "./Testimonials";
import Information from "./Information";

const HomeContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

function Home() {
  return (
    <HomeContainer>
      <Hero />
      <FeaturedTemples />
      <HelpSection />
      <Background />
      <Testimonials />
      <Information></Information>
    </HomeContainer>
  );
}

export default Home;

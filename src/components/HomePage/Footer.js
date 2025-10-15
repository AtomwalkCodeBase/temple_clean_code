"use client";
import styled from "styled-components";
// import { motion } from "framer-motion"
import footerTree from "../../assets/img/footer_01.png";
import footerTemple from "../../assets/img/footer_02.png";
import testimonialBg from "../../assets/img/testimonial_01.png";

const FooterContainer = styled.footer`
  background-image: url(${testimonialBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  color: #ededed;
  padding: 0;
  overflow: hidden;
  min-height: auto;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.82);
    z-index: 1;
  }

  @media (max-width: 768px) {
    min-height: auto;
  }
`;

const FooterContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 0;

  @media (min-width: 768px) {
    padding: 80px 60px 0;
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 60px;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 80px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 576px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 40px;
  }
`;

const Logo = styled.h2`
  font-weight: 700;
  font-size: 2rem;
  color: #ffffff;
  margin: 0;

  span {
    color: #f59e0b;
  }

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-weight: 300;
  font-size: 1rem;
  color: #f3f4f6;
  max-width: 280px;
  line-height: 1.5;
  margin: 0;
`;

const NewsletterSection = styled.div`
  text-align: left;

  @media (min-width: 992px) {
    text-align: right;
  }
`;

const NewsletterTitle = styled.h3`
  font-weight: 600;
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 15px;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 576px) {
    flex-direction: row;
    align-items: center;
  }
`;

const NewsletterInput = styled.input`
  padding: 12px 20px;
  border-radius: 30px;
  border: none;
  width: 100%;
  font-size: 1rem;
  background-color: #ffffff;
  color: #333;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #f59e0b;
  }

  @media (min-width: 576px) {
    width: 300px;
    padding: 15px 20px;
  }
`;

const SubmitButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6a00, #ff8c00);
  border: none;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 106, 0, 0.3);
  }

  @media (min-width: 576px) {
    align-self: center;
  }
`;

const LinksSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 60px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 60px;
    margin-bottom: 80px;
  }
`;

const LinksColumn = styled.div``;

const ColumnTitle = styled.h3`
  font-weight: 600;
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
`;

const LinkItem = styled.a`
  display: block;
  font-weight: 300;
  font-size: 0.9rem;
  color: #f3f4f6;
  margin-bottom: 10px;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #f59e0b;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const FooterBottomBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  position: relative;
  z-index: 4;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  @media (min-width: 768px) {
    justify-content: flex-start;
    gap: 12px;
    padding: 20px 0 40px;
  }
`;

const FooterBottomItem = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #f3f4f6;
  white-space: nowrap;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #f59e0b;
  }

  @media (min-width: 576px) {
    font-size: 14px;
    font-weight: 600;
    margin: 0 8px;
  }

  @media (min-width: 768px) {
    font-size: 15px;
    margin: 0 12px;
  }
`;

const TreeImg = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 150px;
  z-index: 3;
  opacity: 0.8;
  display: none;

  @media (min-width: 992px) {
    display: block;
  }
`;

const TempleImg = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 200px;
  z-index: 3;
  opacity: 0.8;
  display: none;

  @media (min-width: 992px) {
    display: block;
    width: 300px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <TreeImg src={footerTemple} alt="Small Temple Illustration" />
      <TempleImg src={footerTree} alt="Big Temple Illustration" />
      <FooterContent>
        <TopSection>
          <BrandSection>
            <Logo>
              AGA<span>MANDIRA</span>
            </Logo>
            <Tagline>
              Because we take you to the most peaceful and divine places.
            </Tagline>
          </BrandSection>

          <NewsletterSection>
            <NewsletterTitle>Get Updates</NewsletterTitle>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Enter your email..." />
              <SubmitButton type="submit" aria-label="Subscribe">
                →
              </SubmitButton>
            </NewsletterForm>
          </NewsletterSection>
        </TopSection>

        <LinksSection>
          <LinksColumn>
            <ColumnTitle>Quick Links</ColumnTitle>
            <LinkItem href="/">Home</LinkItem>
            <LinkItem href="/temples">Temples</LinkItem>
            <LinkItem href="/book-puja">Book Puja</LinkItem>
            <LinkItem href="/about-us">About Us</LinkItem>
          </LinksColumn>

          <LinksColumn>
            <ColumnTitle>Contact</ColumnTitle>
            <LinkItem href="mailto:support@agamandira.com">
              support@agamandira.com
            </LinkItem>
            <LinkItem href="tel:+9108028476770">+91 08028476770</LinkItem>
          </LinksColumn>
        </LinksSection>
        <FooterBottomBar>
          <FooterBottomItem>© 2024 Temple</FooterBottomItem>
          <FooterBottomItem>Support</FooterBottomItem>
          <FooterBottomItem>Privacy Policy</FooterBottomItem>
          <FooterBottomItem>Terms of Use</FooterBottomItem>
          <FooterBottomItem>Cookie Policy</FooterBottomItem>
        </FooterBottomBar>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

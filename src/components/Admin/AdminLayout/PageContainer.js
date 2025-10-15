"use client";

import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 8px 28px rgba(0, 86, 214, 0.08);
  overflow: visible;
  border: 1px solid #cfe0ff;
`;

const Header = styled.div`
  background: ${(props) =>
    props.gradient || "linear-gradient(135deg, #0056d6 0%, #0a4db4 100%)"};
  color: #ffffff;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  /* Removed dotted overlay for a clean, modern header */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  z-index: 2;

  .icon {
    font-size: 2.5rem;
    color: #eaf2ff;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.25);
  }

  .text {
    h1 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      color: #ffffff;
    }

    p {
      opacity: 0.95;
      margin: 0;
      color: #e0edff;
      font-size: 1rem;
      max-width: 600px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;

    .icon {
      font-size: 2rem;
      padding: 0.5rem;
    }

    .text h1 {
      font-size: 1.75rem;
    }
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Content = styled.div`
  padding: 0;
  background: #ffffff;
`;

const DecorativeBorder = styled.div`
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent,
    #a8c6ff,
    #0056d6,
    #a8c6ff,
    transparent
  );
  margin: 0 1rem;
  border-radius: 2px;
`;

const PageContainer = ({
  title,
  description,
  icon,
  gradient,
  actions,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Header gradient={gradient}>
          <HeaderContent>
            {icon && <div className="icon">{icon}</div>}
            <div className="text">
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
          </HeaderContent>
          {actions && <ActionsContainer>{actions}</ActionsContainer>}
        </Header>
        <DecorativeBorder />
        <Content>{children}</Content>
      </Container>
    </motion.div>
  );
};

export default PageContainer;

import React, { useState } from "react";
import styled from "styled-components";
import blogLocal from "../../assets/img/blog.png";

const Section = styled.section`
  padding: 4rem 0;
  background: #fff;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ReadAllLink = styled.a`
  color: #ff6b35;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #e55a2b;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.75rem;
  width: 90%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 153, 51, 0.2);
`;

const ModalTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #111;
`;

const ModalMessage = styled.p`
  margin: 0.5rem 0 1.25rem 0;
  color: #444;
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ModalButton = styled.button`
  background: linear-gradient(135deg, #ff9933, #daa520);
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background: ${({ bgColor }) => bgColor};
  background-image: ${({ imageUrl }) =>
    imageUrl ? `url(${imageUrl})` : "none"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #fff;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.8rem;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  flex: 1;
`;

const CardReadAll = styled.a`
  color: #ff6b35;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.3s ease;

  &:hover {
    color: #e55a2b;
    text-decoration: underline;
  }
`;

const categories = [
  {
    id: 1,
    title: "Aarti",
    description:
      "Find the lyrics and significance of popular Aartis to enrich your daily worship rituals.",
    imageUrl:
      "https://localnation.co.in/cdn/shop/products/YW2t9tqdzm.jpg?v=1665294178",
    bgColor: "#FF9933",
    link: "/aarti",
  },
  {
    id: 2,
    title: "Chalisa",
    description:
      "Read powerful Chalisas dedicated to various deities. Chant to seek blessings and divine grace.",
    imageUrl:
      "https://img.freepik.com/free-photo/view-ancient-scroll-writing-documenting-history_23-2151751702.jpg?semt=ais_hybrid&w=740",
    bgColor: "#E86A33",
    link: "/chalisa",
  },
  {
    id: 3,
    title: "Mantra",
    description:
      "Discover potent Vedic mantras to bring peace, focus, and spiritual strength into your life.",
    imageUrl:
      "https://moditoys.com/cdn/shop/articles/The-Power-of-Chanting-Vedic-Mantras-Explained.jpg?v=1739479315",
    bgColor: "#3B5998",
    link: "/mantra",
  },
  {
    id: 4,
    title: "Blogs",
    description:
      "Read inspiring devotional blogs on fasting tips, festivals, Vedic stories, and spiritual journeys.",
    imageUrl: blogLocal,
    bgColor: "#6C5CE7",
    link: "/blogs",
  },
];

const Information = () => {
  const [showModal, setShowModal] = useState(false);

  const openComingSoon = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  return (
    <Section>
      <Container>
        <Header>
          <Title>Discover Devotional Wisdom from Sanatan Dharma</Title>
          <Subtitle>
            Explore enlightening articles on festivals, fasts, mantras, rituals,
            and holistic living — rooted in the timeless teachings of Sanatan
            Dharma.
          </Subtitle>
          <ReadAllLink href="/blogs" onClick={openComingSoon}>
            Explore All Articles →
          </ReadAllLink>
        </Header>

        <CardsGrid>
          {categories.map((category) => (
            <Card key={category.id}>
              <CardImage
                bgColor={category.bgColor}
                imageUrl={category.imageUrl}
              ></CardImage>
              <CardContent>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
                <CardReadAll href={category.link} onClick={openComingSoon}>
                  Read All →
                </CardReadAll>
              </CardContent>
            </Card>
          ))}
        </CardsGrid>

        {showModal && (
          <ModalOverlay onClick={closeModal}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Coming Soon 🙏</ModalTitle>
              <ModalMessage>
                This seva/feature is not yet active. Our temple team is working
                to make it available for devotees very soon. We appreciate your
                patience and blessings.
              </ModalMessage>
              <ModalActions>
                <ModalButton onClick={closeModal}>Okay</ModalButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}
      </Container>
    </Section>
  );
};

export default Information;

"use client";
import styled from "styled-components";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gettemplist } from "../../services/productServices";

const TempleContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fef7e0 0%, #fff8dc 50%, #f5f5dc 100%);
  padding-top: 80px;
`;

const HeaderSection = styled.div`
  background: linear-gradient(45deg, #8b4513 0%, #a0522d 50%, #cd853f 100%);
  color: white;
  text-align: center;
  padding: 60px 20px 40px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="lotus" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23lotus)"/></svg>');
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const TempleTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TempleLocation = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const DeityName = styled(motion.p)`
  font-size: 1.1rem;
  font-style: italic;
  opacity: 0.8;
`;

const ImageSection = styled.section`
  max-width: 1200px;
  margin: -20px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const MainImage = styled(motion.div)`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 4px solid #daa520;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ImageIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
`;

const Indicator = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.active ? "#daa520" : "#ccc")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #daa520;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: start;
  position: sticky;
  top: 100px;
`;

const Section = styled(motion.section)`
  background: white;
  padding: 30px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #daa520;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #8b4513;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "🕉️";
    font-size: 1.2rem;
  }
`;

const SectionContent = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  text-align: justify;
`;

const InfoCard = styled(motion.div)`
  background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
  padding: 25px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
`;

const InfoCardTitle = styled.h3`
  font-size: 1.4rem;
  color: #8b4513;
  margin-bottom: 15px;
  font-weight: 600;
  text-align: center;
`;

const TimingsGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const TimingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #faf0e6;
  border-radius: 8px;
  border-left: 3px solid #daa520;
`;

const TimingLabel = styled.span`
  font-weight: 600;
  color: #8b4513;
`;

const TimingValue = styled.span`
  color: #444;
`;

const OfferingsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const OfferingTag = styled.span`
  background: linear-gradient(45deg, #daa520, #b8860b);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const BookSevaButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 30px auto 0;
  display: block;
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  }
`;

const QuickInfo = styled.div`
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const QuickInfoItem = styled.div`
  margin: 10px 0;

  strong {
    display: block;
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 5px;
  }

  span {
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #8b4513;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  color: #c00;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background: #8b4513;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #a0522d;
  }
`;

const DEFAULT_IMAGE =
  "https://www.poojn.in/wp-content/uploads/2025/02/Govindaraja-Temple-History-Architecture-and-Significance.jpeg.jpg";

const TempleDetails = () => {
  const { templeId } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [templeData, setTempleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTempleDetails = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching temple details for ID:", templeId);

        // Use the existing working API to get all temples
        const response = await gettemplist();

        console.log("API Response:", response);
        console.log("Response data:", response?.data);

        if (response?.data && Array.isArray(response.data)) {
          console.log("Temple list length:", response.data.length);

          // Find the specific temple by ID
          const temple = response.data.find((t) => {
            const templeIdNum = t.temple_id || t.id;
            console.log(
              `Checking temple: ${t.name}, ID: ${templeIdNum}, Looking for: ${templeId}`
            );
            return templeIdNum == templeId;
          });

          console.log("Found temple:", temple);

          if (temple) {
            // Transform API data to match our component structure
            const transformedData = {
              id: temple.temple_id || temple.id,
              name: temple.name || "Unnamed Temple",
              location:
                temple.location ||
                [temple.address_line_3, temple.state_code]
                  .filter(Boolean)
                  .join(", ") ||
                "Location not specified",
              deity: temple.deity || "Deity not specified",
              timingsText: getTimingsText(
                temple.additional_field_list?.temple_timings
              ),
              // Use temple_data_list for dynamic sections
              sections: getTempleSections(
                temple.additional_field_list?.temple_data_list
              ),
              timings: getDetailedTimings(
                temple.additional_field_list?.temple_timings
              ),
              // Collect all available images
              images: getAllTempleImages(temple),
            };

            console.log("Transformed data:", transformedData);
            setTempleData(transformedData);
          } else {
            setError("Temple not found");
          }
        } else {
          setError("Failed to load temple data");
        }
      } catch (err) {
        console.error("Error fetching temple details:", err);
        setError("Failed to load temple details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (templeId) {
      fetchTempleDetails();
    }
  }, [templeId]);

  // Helper function to get all temple images
  const getAllTempleImages = (temple) => {
    const images = [];

    console.log("Processing images for temple:", temple.name);
    console.log("Main image:", temple.image);

    // Add main image if exists
    if (temple.image) {
      images.push(temple.image);
      console.log("Added main image:", temple.image);
    }

    // Add additional images (image_1, image_2, etc.)
    for (let i = 1; i <= 9; i++) {
      const imageKey = `image_${i}`;
      if (temple[imageKey]) {
        images.push(temple[imageKey]);
        console.log(`Added ${imageKey}:`, temple[imageKey]);
      }
    }

    console.log("Total images collected:", images.length);
    console.log("All images:", images);

    // If no images found, use default
    if (images.length === 0) {
      images.push(DEFAULT_IMAGE);
      console.log("No images found, using default");
    }

    return images;
  };

  // Helper function to create dynamic sections from temple_data_list
  const getTempleSections = (templeDataList) => {
    console.log("Processing temple_data_list:", templeDataList);

    if (!templeDataList || !Array.isArray(templeDataList)) {
      console.log("No temple_data_list found, using fallback");
      return [
        {
          title: "Information",
          content: "Temple information not available.",
        },
      ];
    }

    const sections = templeDataList.map((item) => ({
      title: item.title || "Section",
      content: item.paragraph || "Content not available.",
    }));

    console.log("Processed sections:", sections);
    return sections;
  };

  // Helper function to format timings text from selected_time_slots
  const getTimingsText = (timingsObj) => {
    console.log("Processing timings object:", timingsObj);

    if (
      !timingsObj ||
      !timingsObj.selected_time_slots ||
      !Array.isArray(timingsObj.selected_time_slots)
    ) {
      console.log("No selected_time_slots found");
      return "Timings not available";
    }

    const timeSlots = timingsObj.selected_time_slots;
    console.log("Time slots found:", timeSlots);

    if (timeSlots.length === 0) {
      return "Timings not available";
    }

    // Format as "6:30 AM - 11:30 AM, 2:30 PM - 8:30 PM"
    const formattedTimings = timeSlots
      .map((slot) => {
        const start = slot.start || "";
        const end = slot.end || "";
        return `${start} - ${end}`;
      })
      .join(", ");

    console.log("Formatted timings:", formattedTimings);
    return formattedTimings;
  };

  // Helper function to create detailed timings from selected_time_slots
  const getDetailedTimings = (timingsObj) => {
    console.log("Processing detailed timings:", timingsObj);

    if (
      !timingsObj ||
      !timingsObj.selected_time_slots ||
      !Array.isArray(timingsObj.selected_time_slots)
    ) {
      console.log("No selected_time_slots for detailed timings");
      return [{ title: "General Timings", time: "Information not available" }];
    }

    const timeSlots = timingsObj.selected_time_slots;
    console.log("Time slots for detailed timings:", timeSlots);

    if (timeSlots.length === 0) {
      return [{ title: "General Timings", time: "Information not available" }];
    }

    // Convert selected_time_slots to our timing format
    const detailedTimings = timeSlots.map((slot) => ({
      title: slot.name || "Time Slot",
      time: `${slot.start || ""} - ${slot.end || ""}`,
    }));

    console.log("Detailed timings created:", detailedTimings);
    return detailedTimings;
  };

  useEffect(() => {
    if (templeData && templeData.images && templeData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % templeData.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [templeData]);

  if (loading) {
    return (
      <LoadingContainer>
        <div>🕉️ Loading temple details...</div>
      </LoadingContainer>
    );
  }

  if (error || !templeData) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error || "Something went wrong"}</ErrorMessage>
        <RetryButton onClick={() => window.location.reload()}>
          Try Again
        </RetryButton>
      </ErrorContainer>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <TempleContainer>
      <HeaderSection>
        <TempleTitle variants={itemVariants} initial="hidden" animate="visible">
          {templeData.name}
        </TempleTitle>
        <TempleLocation
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          📍 {templeData.location}
        </TempleLocation>
        <DeityName
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Dedicated to {templeData.deity}
        </DeityName>
      </HeaderSection>

      <ImageSection>
        <MainImage
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <CarouselImage
            src={
              templeData.images && templeData.images.length > 0
                ? templeData.images[currentImage]
                : DEFAULT_IMAGE
            }
            alt={`${templeData.name} Image ${currentImage + 1}`}
            onError={(e) => {
              console.log("Image failed to load, using default");
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </MainImage>
        {templeData.images && templeData.images.length > 1 && (
          <ImageIndicators>
            {templeData.images.map((_, index) => (
              <Indicator
                key={index}
                active={index === currentImage}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </ImageIndicators>
        )}
      </ImageSection>

      <ContentContainer>
        <MainContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {templeData.sections && templeData.sections.length > 0 ? (
              templeData.sections.map((section, index) => (
                <Section key={index} variants={itemVariants}>
                  <SectionTitle>{section.title}</SectionTitle>
                  <SectionContent>{section.content}</SectionContent>
                </Section>
              ))
            ) : (
              <Section variants={itemVariants}>
                <SectionTitle>About This Temple</SectionTitle>
                <SectionContent>
                  Welcome to {templeData.name}. This sacred place offers
                  spiritual solace and divine blessings to all devotees. The
                  temple is located in {templeData.location} and is dedicated to{" "}
                  {templeData.deity}.
                </SectionContent>
              </Section>
            )}

            <BookSevaButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate("/book-seva", { state: { templeId: templeData.id } })
              }
            >
              🙏 Book Seva
            </BookSevaButton>
          </motion.div>
        </MainContent>

        <Sidebar>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <InfoCard variants={itemVariants}>
              <QuickInfo>
                <QuickInfoItem>
                  <strong>Temple Timings</strong>
                  <span>{templeData.timingsText}</span>
                </QuickInfoItem>
                <QuickInfoItem>
                  <strong>Primary Deity</strong>
                  <span>{templeData.deity}</span>
                </QuickInfoItem>
              </QuickInfo>
            </InfoCard>

            <InfoCard variants={itemVariants}>
              <InfoCardTitle>🕐 Detailed Timings</InfoCardTitle>
              <TimingsGrid>
                {templeData.timings.map((timing, index) => (
                  <TimingRow key={index}>
                    <TimingLabel>{timing.title}</TimingLabel>
                    <TimingValue>{timing.time}</TimingValue>
                  </TimingRow>
                ))}
              </TimingsGrid>
            </InfoCard>

            <InfoCard variants={itemVariants}>
              <InfoCardTitle>🙏 Sacred Offerings</InfoCardTitle>
              <div
                style={{ textAlign: "center", color: "#888", padding: "20px" }}
              >
                Offerings information not available
              </div>
            </InfoCard>
          </motion.div>
        </Sidebar>
      </ContentContainer>
    </TempleContainer>
  );
};

export default TempleDetails;

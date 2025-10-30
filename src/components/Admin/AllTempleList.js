"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { gettemplist } from "../../services/productServices";
import { getStoredTempleId } from "../../services/authServices";
import ManageTemple from "./../Admin/ManageTemple";
import { GiLotus, GiTempleGate } from "react-icons/gi";
import { FiMapPin, FiPhone, FiMail, FiClock, FiEdit } from "react-icons/fi";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.75rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 1rem 0;
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
      font-size: 2.25rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    font-weight: 400;
  }
`;

const TemplesGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$single ? "1fr" : "repeat(3, 1fr)"};
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: ${(props) =>
      props.$single ? "1fr" : "repeat(2, 1fr)"};
    gap: 1.5rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const TempleCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  position: relative;
  transition: all 0.3s ease;
  min-width: 0; /* prevent overflow in grid items */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const TempleImageContainer = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;

  @media (max-width: 1200px) {
    height: 260px;
  }
  @media (max-width: 768px) {
    height: 220px;
  }
`;

const TempleImage = styled.div`
  height: 100%;
  background: ${(props) =>
    props.image
      ? `url(${props.image})`
      : "linear-gradient(135deg, #0056d6 0%, #0077ff 100%)"};
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s ease;

  ${TempleCard}:hover & {
    transform: scale(1.03);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(props) =>
      props.image
        ? "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)"
        : "rgba(0, 0, 0, 0.1)"};
  }
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  svg {
    font-size: 5rem;
    color: rgba(255, 255, 255, 0.9);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.92);
  color: #059669;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
  }
`;

const TempleContent = styled.div`
  padding: 2.25rem;
`;

const TempleHeader = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const TempleTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1.3;
  letter-spacing: -0.25px;

  svg {
    color: #0056d6;
    font-size: 1.75rem;
  }
`;

const TempleId = styled.span`
  display: inline-flex;
  align-items: center;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  letter-spacing: 0.25px;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailCard = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 86, 214, 0.08);
  }
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
  line-height: 1.4;
`;

const InfoSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #bae6fd;
  position: relative;
  overflow: hidden;
`;

const TimingSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #bae6fd;
  position: relative;
  overflow: hidden;
`;

const SectionLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: 0.25px;
`;

const SectionContent = styled.div`
  color: #475569;
  line-height: 1.6;
  font-size: 1rem;
  font-weight: 400;
`;

const TimingSlots = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const TimingSlot = styled.div`
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #0056d6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 86, 214, 0.1);
  }
`;

const ActionArea = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &.primary {
    background: #0056d6;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 86, 214, 0.2);

    &:hover {
      background: #0045b3;
      box-shadow: 0 8px 15px rgba(0, 86, 214, 0.3);
      transform: translateY(-2px);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  flex-direction: column;
  gap: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #0056d6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  color: #64748b;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const EmptyIcon = styled.div`
  font-size: 6rem;
  color: #e2e8f0;
  margin-bottom: 2rem;
  opacity: 0.7;

  svg {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05));
  }
`;

const EmptyTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.25px;
`;

const EmptyDescription = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 400;
`;

const AddButton = styled(motion.button)`
  background: #0056d6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 86, 214, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: #0045b3;
    box-shadow: 0 8px 15px rgba(0, 86, 214, 0.3);
    transform: translateY(-2px);
  }
`;

const AllTempleList = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const userTempleId = getStoredTempleId();

  useEffect(() => {
    fetchTemples();
  }, []);

  // Auto-open edit by query param (?edit=T_123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    if (!editId) return;
    (async () => {
      try {
        const res = await gettemplist();
        const list = res?.data?.data || res?.data || [];
        const found = list.find((t) => String(t.temple_id) === String(editId));
        if (found) {
          setSelectedTemple(found);
          setShowAddModal(true);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);
  const TempleCarousel = ({ temple }) => {
    // Collect all non-null image URLs
    const images = Object.keys(temple)
      .filter((key) => key.startsWith("image") && temple[key])
      .map((key) => temple[key]);

    const [current, setCurrent] = useState(0);

    // Auto-slide every 3 seconds
    useEffect(() => {
      if (images.length <= 1) return;
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) {
      return (
        <TempleImage image={null}>
          <PlaceholderIcon>
            <GiTempleGate />
          </PlaceholderIcon>
        </TempleImage>
      );
    }

    return (
      <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={images[current]}
            src={images[current]}
            alt={`Temple image ${current + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "0px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </AnimatePresence>

        {/* Dots indicator */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              zIndex: 5,
            }}
          >
            {images.map((_, idx) => (
              <motion.div
                key={idx}
                onClick={() => setCurrent(idx)}
                whileHover={{ scale: 1.2 }}
                style={{
                  width: current === idx ? "10px" : "8px",
                  height: current === idx ? "10px" : "8px",
                  borderRadius: "50%",
                  background: current === idx ? "#0056d6" : "#cbd5e1",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const fetchTemples = async () => {
    try {
      setLoading(true);
      const response = await gettemplist();
      const allTemples = response.data || [];

      // Filter temples to show only the user's assigned temple
      const userTemples = userTempleId
        ? allTemples.filter((temple) => temple.temple_id === userTempleId)
        : allTemples;

      setTemples(userTemples);
    } catch (error) {
      console.error("Error fetching temples:", error);
      setTemples([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemple = () => {
    setSelectedTemple(null);
    setShowAddModal(true);
  };

  const handleEditTemple = (temple) => {
    setSelectedTemple(temple);
    setShowAddModal(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("edit", temple.temple_id);
      window.history.pushState({}, "", url);
    } catch {}
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setSelectedTemple(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url);
    } catch {}
  };

  const handleTempleAdded = () => {
    fetchTemples();
    handleModalClose();
  };

  const renderTimings = (temple) => {
    if (temple.additional_field_list?.temple_timings?.selected_time_slots) {
      return temple.additional_field_list.temple_timings.selected_time_slots.map(
        (slot, index) => (
          <TimingSlot key={index}>
            <FiClock size={14} />
            {slot.name}: {slot.start} - {slot.end}
          </TimingSlot>
        )
      );
    }

    if (temple.temple_timings) {
      return (
        <>
          <TimingSlot>
            <FiClock size={14} />
            Morning: {temple.temple_timings.morning_opening} -{" "}
            {temple.temple_timings.morning_closing}
          </TimingSlot>
          <TimingSlot>
            <FiClock size={14} />
            Evening: {temple.temple_timings.evening_opening} -{" "}
            {temple.temple_timings.evening_closing}
          </TimingSlot>
        </>
      );
    }

    return (
      <TimingSlot>
        <FiClock size={14} />
        Timings not available
      </TimingSlot>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading sacred temple information...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <>
      {!showAddModal && (
        <PageContainer>
          {temples.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <GiTempleGate />
              </EmptyIcon>
              <EmptyTitle>No Temple Assigned</EmptyTitle>
              <EmptyDescription>
                You don't have any temple assigned to your account yet. Contact
                your administrator or add a new temple to get started on your
                spiritual journey.
              </EmptyDescription>
              <AddButton
                onClick={handleAddTemple}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>+</span>
                Add Your First Temple
              </AddButton>
            </EmptyState>
          ) : (
            <TemplesGrid $single={temples.length === 1}>
              {temples.map((temple, index) => (
                <TempleCard
                  key={temple.temple_id || index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ y: -5 }}
                >
                  <TempleImageContainer>
                    <TempleCarousel temple={temple} />
                    <StatusBadge>Active</StatusBadge>
                  </TempleImageContainer>

                  <TempleContent>
                    <TempleHeader>
                      <TempleTitle>
                        <GiLotus />
                        {temple.name}
                      </TempleTitle>
                      <TempleId>Temple ID: {temple.temple_id}</TempleId>
                    </TempleHeader>

                    <DetailsGrid>
                      <DetailCard>
                        <DetailLabel>
                          <FiMapPin size={14} />
                          Location
                        </DetailLabel>
                        <DetailValue>
                          {temple.location ||
                            `${temple.address_line_3}, ${temple.state_code}`}
                        </DetailValue>
                      </DetailCard>
                      <DetailCard>
                        <DetailLabel>
                          <FiPhone size={14} />
                          Contact
                        </DetailLabel>
                        <DetailValue>
                          {temple.mobile_number || "Not provided"}
                        </DetailValue>
                      </DetailCard>
                      <DetailCard>
                        <DetailLabel>
                          <FiMail size={14} />
                          Email
                        </DetailLabel>
                        <DetailValue>
                          {temple.email_id || "Not provided"}
                        </DetailValue>
                      </DetailCard>
                      <DetailCard>
                        <DetailLabel>🏛️ Temple Group</DetailLabel>
                        <DetailValue>
                          {temple.temple_group || "Not specified"}
                        </DetailValue>
                      </DetailCard>
                    </DetailsGrid>

                    {temple.remarks && (
                      <InfoSection>
                        <SectionLabel>📝 Remarks</SectionLabel>
                        <SectionContent>{temple.remarks}</SectionContent>
                      </InfoSection>
                    )}

                    <TimingSection>
                      <SectionLabel>
                        <FiClock size={16} />
                        Temple Timings
                      </SectionLabel>
                      <TimingSlots>{renderTimings(temple)}</TimingSlots>
                    </TimingSection>

                    {temple.additional_field_list
                      ?.supplier_document_name_list && (
                      <InfoSection>
                        <SectionLabel>📄 Required Documents</SectionLabel>
                        <SectionContent>
                          <div style={{ display: "grid", gap: "0.75rem" }}>
                            {temple.additional_field_list.supplier_document_name_list.map(
                              (doc, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.75rem 1rem",
                                    background: "white",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "500",
                                      color: "#334155",
                                    }}
                                  >
                                    {doc.name}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.875rem",
                                      fontWeight: "600",
                                      color:
                                        doc.is_mandatory === "True"
                                          ? "#dc2626"
                                          : "#059669",
                                      background:
                                        doc.is_mandatory === "True"
                                          ? "#fef2f2"
                                          : "#f0fdf4",
                                      padding: "0.25rem 0.75rem",
                                      borderRadius: "100px",
                                      border: `1px solid ${
                                        doc.is_mandatory === "True"
                                          ? "#fecaca"
                                          : "#bbf7d0"
                                      }`,
                                    }}
                                  >
                                    {doc.is_mandatory === "True"
                                      ? "Required"
                                      : "Optional"}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </SectionContent>
                      </InfoSection>
                    )}

                    {temple.additional_field_list?.temple_data_list && (
                      <InfoSection>
                        <SectionLabel>📋 Temple Information</SectionLabel>
                        <SectionContent>
                          {temple.additional_field_list.temple_data_list.map(
                            (data, idx) => (
                              <div key={idx} style={{ marginBottom: "1rem" }}>
                                <strong>{data.title}:</strong> {data.paragraph}
                              </div>
                            )
                          )}
                        </SectionContent>
                      </InfoSection>
                    )}

                    <ActionArea>
                      <ActionButton
                        className="primary"
                        onClick={() => handleEditTemple(temple)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiEdit size={16} />
                        Edit Temple Details
                      </ActionButton>
                    </ActionArea>
                  </TempleContent>
                </TempleCard>
              ))}
            </TemplesGrid>
          )}
        </PageContainer>
      )}

      <AnimatePresence>
        {showAddModal && (
          <ManageTemple
            templeId={userTempleId}
            selectedTemple={selectedTemple}
            onClose={handleModalClose}
            onSuccess={handleTempleAdded}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AllTempleList;

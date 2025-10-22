import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { gettemplist } from "../../services/productServices";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  getmyApplication,
  processSellerApplication,
} from "../../services/customerServices";
import { FaUpload, FaFileAlt } from "react-icons/fa";
// Styled components
const HeaderSection = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  .header-content {
    position: relative;
    z-index: 1;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
`;

const Subtitle = styled.h2`
  color: #555;
  margin-bottom: 1.5rem;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #ddd;
    z-index: 1;
  }
`;

const ProgressStep = styled.div`
  position: relative;
  z-index: 2;
  background: ${(props) => (props.active ? "#4CAF50" : "#ddd")};
  color: ${(props) => (props.active ? "white" : "#777")};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
`;

const Step1Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Step2Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TempleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TempleCard = styled.div`
  border: 2px solid
    ${(props) => {
      if (props.selected) return "#4CAF50";
      if (props.applied) return "#FFA000";
      return "#ddd";
    }};
  border-radius: 8px;
  overflow: hidden;
  cursor: ${(props) => (props.applied ? "default" : "pointer")};
  transition: all 0.3s ease;
  position: relative;

  ${(props) =>
    !props.applied &&
    `
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const AppliedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffa000;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const TempleImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const TempleName = styled.h3`
  padding: 1rem;
  margin: 0;
  color: #333;
`;

const TempleLocation = styled.p`
  padding: 0 1rem 1rem;
  margin: 0;
  color: #777;
`;

const DocumentList = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DocumentItem = styled.div`
  padding: 1.25rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #d0d0d0;
  }
`;

const DocumentLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const MandatoryStar = styled.span`
  color: #e53935;
  margin-left: 4px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #1976d2;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: #1565c0;
  }
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #388e3c;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const NextButton = styled(Button)`
  background: #4caf50;
  color: white;
  margin-left: auto;

  &:hover:not(:disabled) {
    background: #3d8b40;
  }
`;

const BackButton = styled(Button)`
  background: #f1f1f1;
  color: #333;

  &:hover {
    background: #ddd;
  }
`;

const SubmitButton = styled(Button)`
  background: #2196f3;
  color: white;

  &:hover:not(:disabled) {
    background: #0b7dda;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #777;
  font-style: italic;
`;

const ApplicationStatus = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 8px;
  background: ${(props) => (props.isApproved ? "#E8F5E9" : "#FFF8E1")};
  border-left: 4px solid
    ${(props) => (props.isApproved ? "#4CAF50" : "#FFA000")};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: bold;
  background: ${(props) => (props.isApproved ? "#4CAF50" : "#FFA000")};
  color: white;
  margin-right: 1rem;
`;

const SellerRegistration = () => {
  const [step, setStep] = useState(1);
  const [temples, setTemples] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nextButtonRef = useRef(null);

  // Fetch temple list and my applications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [templeData, applicationData] = await Promise.all([
          gettemplist(),
          getmyApplication(),
        ]);
        setTemples(templeData.data);
        setMyApplications(applicationData || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if a temple has already been applied to
  const hasAppliedToTemple = (templeId) => {
    return myApplications.some((app) => app.temple_id === templeId);
  };

  // Get application status for a temple
  const getApplicationStatus = (templeId) => {
    return myApplications.find((app) => app.temple_id === templeId);
  };

  // Handle temple selection
  const handleTempleSelect = (temple) => {
    // Don't allow selection if already applied
    if (hasAppliedToTemple(temple.temple_id)) return;

    // Initialize documents state
    let docs = {};
    if (temple.additional_field_list.supplier_document_name_list) {
      setSelectedTemple(temple);
      temple.additional_field_list.supplier_document_name_list.forEach(
        (doc, index) => {
          docs[`document_file_${index + 1}`] = null;
        }
      );
    } else {
      toast.error("No document list found for this temple.");
      return;
    }

    setDocuments(docs || []);

    // Scroll to next button after a short delay to allow state update
    setTimeout(() => {
      if (nextButtonRef.current) {
        nextButtonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  // Handle file input change
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments({
        ...documents,
        [`document_file_${index + 1}`]: file,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const sellerRefCode = localStorage.getItem("customerRefCode");
      if (!sellerRefCode) {
        throw new Error("Seller reference code not found. Please login again.");
      }

      const formData = new FormData();
      formData.append("temple_id", selectedTemple.temple_id);
      formData.append("call_mode", "ADD_SELLER_DOCUMENT");
      formData.append("seller_ref_code", sellerRefCode);

      // Append all document files
      Object.keys(documents).forEach((key) => {
        if (documents[key]) {
          formData.append(key, documents[key]);
        }
      });

      const response = await processSellerApplication(formData);
      console.log(response, "response");
      if (response.status !== 200) {
        throw new Error("Registration failed. Please try again.");
      }
      // Registration successful
      toast.success("Registration successful!");

      // Refresh applications list
      const applicationData = await getmyApplication();
      setMyApplications(applicationData || []);

      // Reset form
      setSelectedTemple(null);
      setDocuments({});
      setStep(1);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if all mandatory documents are uploaded
  const canProceedToStep2 = () => {
    if (!selectedTemple) return false;

    const mandatoryDocs =
      selectedTemple.additional_field_list.supplier_document_name_list.filter(
        (doc) => doc.is_mandatory === "True"
      );

    return mandatoryDocs.every(
      (doc, index) => documents[`document_file_${index + 1}`]
    );
  };

  return (
    <CustomerLayout>
      <HeaderSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="title">📝 Seller Registration</div>
        <div className="subtitle">
          Discover divine temples and Register your spiritual journey with us
        </div>
      </HeaderSection>

      {myApplications.length > 0 && (
        <ApplicationStatus isApproved={myApplications[0].is_approved}>
          <h3>Your Applications</h3>
          {myApplications.map((app) => (
            <div key={app.temple_id} style={{ marginBottom: "1rem" }}>
              <StatusBadge isApproved={app.is_approved}>
                {app.is_approved ? "Approved" : "Pending"}
              </StatusBadge>
              <strong>{app.temple_name}</strong>
              <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Status: {app.is_active ? "Active" : "Inactive"}
                {app.approved_date && ` | Approved on: ${app.approved_date}`}
              </div>
            </div>
          ))}
        </ApplicationStatus>
      )}

      <ProgressBar>
        <ProgressStep active={step >= 1}>1. Select Temple</ProgressStep>
        <ProgressStep active={step >= 2}>2. Upload Documents</ProgressStep>
      </ProgressBar>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {step === 1 && (
        <Step1Container>
          <Subtitle>Select a Temple to Register As Seller</Subtitle>

          {loading ? (
            <LoadingText>Loading temples...</LoadingText>
          ) : (
            <TempleGrid>
              {temples.map((temple) => {
                const applied = hasAppliedToTemple(temple.temple_id);
                const application = applied
                  ? getApplicationStatus(temple.temple_id)
                  : null;

                return (
                  <TempleCard
                    key={temple.temple_id}
                    selected={selectedTemple?.temple_id === temple.temple_id}
                    applied={applied}
                    onClick={() => handleTempleSelect(temple)}
                  >
                    {applied && (
                      <AppliedBadge>
                        {application.is_approved ? "Approved" : "Applied"}
                      </AppliedBadge>
                    )}
                    <TempleImage
                      src={temple.image || "/placeholder-temple.jpg"}
                      alt={temple.name}
                    />
                    <TempleName>{temple.name}</TempleName>
                    <TempleLocation>{temple.location}</TempleLocation>
                    {applied && application && (
                      <div
                        style={{ padding: "0 1rem 1rem", fontSize: "0.8rem" }}
                      >
                        Status:{" "}
                        {application.is_approved ? "Approved" : "Pending"}
                      </div>
                    )}
                  </TempleCard>
                );
              })}
            </TempleGrid>
          )}

          <ButtonContainer ref={nextButtonRef}>
            <NextButton onClick={() => setStep(2)} disabled={!selectedTemple}>
              Next
            </NextButton>
          </ButtonContainer>
        </Step1Container>
      )}

      {step === 2 && selectedTemple && (
        <Step2Container>
          <Subtitle>
            Upload Required Documents for {selectedTemple.name}
          </Subtitle>

          <DocumentList>
            {selectedTemple.additional_field_list.supplier_document_name_list.map(
              (doc, index) => (
                <DocumentItem key={index}>
                  <DocumentLabel>
                    {doc.name}{" "}
                    {doc.is_mandatory === "True" && (
                      <MandatoryStar>*</MandatoryStar>
                    )}
                  </DocumentLabel>

                  {/* Upload button (styled label linked to hidden input) */}
                  <UploadButton htmlFor={`file-upload-${index}`}>
                    <FaUpload /> Upload File
                  </UploadButton>
                  <HiddenFileInput
                    id={`file-upload-${index}`}
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                    required={doc.is_mandatory === "True"}
                  />
                  {documents[`document_file_${index + 1}`] && (
                    <FileName>
                      <FaFileAlt />{" "}
                      {documents[`document_file_${index + 1}`].name}
                    </FileName>
                  )}
                </DocumentItem>
              )
            )}
          </DocumentList>

          <ButtonContainer>
            <BackButton onClick={() => setStep(1)}>Back</BackButton>
            <SubmitButton
              onClick={handleSubmit}
              disabled={!canProceedToStep2() || loading}
            >
              {loading ? "Submitting..." : "Complete Registration"}
            </SubmitButton>
          </ButtonContainer>
        </Step2Container>
      )}
    </CustomerLayout>
  );
};

export default SellerRegistration;

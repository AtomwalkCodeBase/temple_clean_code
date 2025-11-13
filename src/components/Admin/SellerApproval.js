import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  getSellerTempleList,
  updateSellerStatus,
} from "../../services/customerServices";
import { getCurrentTempleId } from "../../services/serviceUtils";
import {
  FiMail,
  FiPhone,
  FiFile,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import StatusBadges from "./AdminLayout/StatusBadges";

// ===============================================
// Reusable Components
// ===============================================

// Search Input
const SearchInput = ({ value, onChange, placeholder }) => (
  <SearchWrapper>
    <FiSearchIcon />
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search..."}
    />
  </SearchWrapper>
);

// Status Badge
const StatusBadge = ({ status, children }) => {
  const colors = {
    approved: { bg: "#ecfdf5", color: "#065f46", border: "#10b981" },
    pending: { bg: "#fffbeb", color: "#92400e", border: "#f59e0b" },
    rejected: { bg: "#fef2f2", color: "#991b1b", border: "#ef4444" },
  };
  const style = colors[status] || colors.rejected;

  return (
    <Badge style={{ background: style.bg, color: style.color, borderColor: style.border }}>
      {children}
    </Badge>
  );
};

// Document Thumbnails
const DocumentThumbs = ({ docs, size = "normal" }) => {
  if (!docs || docs.length === 0) {
    return (
      <NoDoc>
        <FiFile /> No documents
      </NoDoc>
    );
  }

  return (
    <ThumbGrid size={size}>
      {docs.map((doc, i) => (
        <ThumbLink key={i} href={doc} target="_blank" rel="noopener noreferrer">
          <ThumbImage src={doc} alt={`Doc ${i + 1}`} />
        </ThumbLink>
      ))}
    </ThumbGrid>
  );
};

// Action Button
const ActionButton = ({ variant, onClick, loading, children }) => {
  const variants = {
    approve: { color: "#059669", border: "#34d399", bg: "white" },
    reject: { color: "#b91c1c", border: "#f87171", bg: "white" },
  };
  const style = variants[variant] || variants.reject;

  return (
    <ActionBtn
      style={{
        color: style.color,
        borderColor: style.border,
        background: style.bg,
      }}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </ActionBtn>
  );
};

// Pagination
const Pagination = ({ page, total, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= total; i++) {
    pages.push(
      <PageBtn
        key={i}
        active={page === i}
        onClick={() => onPageChange(i)}
      >
        {i}
      </PageBtn>
    );
  }

  return (
    <PaginationWrapper>
      <PageInfo>
        Showing {(page - 1) * 6 + 1} to {Math.min(page * 6, total * 6)} of {total * 6} results
      </PageInfo>
      <PageButtons>
        <PageBtn
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <FiChevronLeft />
        </PageBtn>
        {pages}
        <PageBtn
          onClick={() => onPageChange(Math.min(total, page + 1))}
          disabled={page === total}
        >
          <FiChevronRight />
        </PageBtn>
      </PageButtons>
    </PaginationWrapper>
  );
};

// Loader
const FullLoader = () => (
  <LoaderOverlay>
    <BigSpinner />
  </LoaderOverlay>
);

// Empty State
const EmptyState = ({ search }) => (
  <EmptyWrapper>
    <EmptyIcon>Receipt</EmptyIcon>
    <EmptyTitle>No seller applications found</EmptyTitle>
    <EmptyText>
      {search
        ? "Try adjusting your search query"
        : "All applications have been processed"}
    </EmptyText>
  </EmptyWrapper>
);

// ===============================================
// Seller Card (Mobile)
// ===============================================
const SellerCard = ({ seller, onAction, processing }) => {
  const status = seller.is_approved ? "approved" : "rejected";

  return (
    <Card status={status}>
      <CardHeader>
        <div>
          <RefCode>{seller.seller_ref_code}</RefCode>
          <SellerName>{seller.seller_name}</SellerName>
        </div>
        <StatusBadge status={status}>
          {seller.is_approved ? "Approved" : "Rejected"}
        </StatusBadge>
      </CardHeader>

      <CardBody>
        {seller.seller_email && (
          <InfoLine>
            <FiMail /> {seller.seller_email}
          </InfoLine>
        )}
        {seller.seller_phone && (
          <InfoLine>
            <FiPhone /> {seller.seller_phone}
          </InfoLine>
        )}
      </CardBody>

      <CardSection>
        <SectionLabel>Documents</SectionLabel>
        <DocumentThumbs docs={seller.documents} size="small" />
      </CardSection>

      <CardFooter>
        {!seller.is_approved ? (
          <ActionButton
            variant="approve"
            onClick={() => onAction(seller, "approve")}
            loading={processing === `${seller.seller_ref_code}-approve`}
          >
            <FiCheckCircle /> Approve
          </ActionButton>
        ) : (
          <ActionButton
            variant="reject"
            onClick={() => onAction(seller, "reject")}
            loading={processing === `${seller.seller_ref_code}-reject`}
          >
            <FiXCircle /> Reject
          </ActionButton>
        )}
      </CardFooter>
    </Card>
  );
};

// ===============================================
// Main Component
// ===============================================
const SellerApproval = () => {
  const [data, setData] = useState({ loading: true, rows: [], error: null });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [processing, setProcessing] = useState(null);

  const templeId = getCurrentTempleId() || "";

  // Load sellers
  useEffect(() => {
    const loadSellers = async () => {
      setData((s) => ({ ...s, loading: true }));
      try {
        const list = await getSellerTempleList();
        const raw = Array.isArray(list)
          ? list
          : list?.results || list?.data || [];

        const filtered = raw.filter(
          (item) => String(item.temple_id) === String(templeId)
        );

        const rows = filtered.map((r, idx) => {
          const docs = [r.document_file_1, r.document_file_2, r.document_file_3]
            .filter(Boolean);

          const approved =
            typeof r.is_approved === "boolean"
              ? r.is_approved
              : String(r.is_approved).toLowerCase() === "true";

          return {
            id: r.seller_ref_code || `S-${idx + 1}`,
            seller_ref_code: r.seller_ref_code || "",
            seller_name: r.seller_name || "Unknown",
            seller_email: r.seller_email || "",
            seller_phone: r.seller_phone || "",
            documents: docs,
            is_approved: approved,
            raw: r,
          };
        });

        setData({ loading: false, rows, error: null });
      } catch (e) {
        setData({ loading: false, rows: [], error: e.message || "Failed" });
      }
    };

    loadSellers();
  }, [templeId]);

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return data.rows;

    return data.rows.filter(
      (r) =>
        r.seller_name.toLowerCase().includes(q) ||
        r.seller_ref_code.toLowerCase().includes(q) ||
        (r.seller_email && r.seller_email.toLowerCase().includes(q)) ||
        (r.seller_phone && r.seller_phone.toLowerCase().includes(q))
    );
  }, [data.rows, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPageData = filtered.slice((page - 1) * perPage, page * perPage);

  // Action handler
  const handleAction = async (seller, action) => {
    const key = `${seller.seller_ref_code}-${action}`;
    setProcessing(key);

    const mode = action === "approve" ? "APPROVE" : "INACTIVE";

    try {
      await updateSellerStatus({
        temple_id: templeId || seller.raw.temple_id,
        call_mode: mode,
        seller_ref_code: seller.seller_ref_code,
      });

      setData((prev) => ({
        ...prev,
        rows: prev.rows.map((item) => {
          if (item.seller_ref_code !== seller.seller_ref_code) return item;
          return {
            ...item,
            is_approved: action === "approve",
          };
        }),
      }));
    } catch (e) {
      console.error("Action failed:", e);
    } finally {
      setProcessing(null);
    }
  };

  if (data.loading) return <FullLoader />;

  return (
    <Container>
      <Header>
        <Title>Seller Approvals</Title>
        <SearchInput value={search} onChange={setSearch} placeholder="Search sellers..." />
      </Header>

      {filtered.length === 0 ? (
        <EmptyState search={!!search} />
      ) : (
        <>
          {/* Desktop Table */}
          <DesktopView>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Ref Code</Th>
                    <Th>Seller</Th>
                    <Th>Status</Th>
                    <Th>Documents</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((seller) => (
                    <Tr key={seller.id}>
                      <Td>
                        <Mono>{seller.seller_ref_code}</Mono>
                      </Td>
                      <Td>
                        <strong>{seller.seller_name}</strong>
                        <Contact>
                          {seller.seller_email && (
                            <div>
                              <FiMail size={12} /> {seller.seller_email}
                            </div>
                          )}
                          {seller.seller_phone && (
                            <div>
                              <FiPhone size={12} /> {seller.seller_phone}
                            </div>
                          )}
                        </Contact>
                      </Td>
                      <Td>
                        {/* <StatusBadge status={seller.is_approved ? "approved" : "rejected"}>
                          {seller.is_approved ? "Approved" : "Rejected"}
                        </StatusBadge> */}
<StatusBadges
  value={seller?.raw.status_display}
  // customLabels={{
  //   A: 'Approved',
  //   R: 'Rejected',
  //   P: 'Pending',
  //   X: 'Cancelled',
  //   C: 'Completed',
  //   S: 'Submitted'
  // }}
/>
                      </Td>
                      <Td>
                        <DocumentThumbs docs={seller.documents} size="small" />
                      </Td>
                      <Td>
                        {!seller.is_approved ? (
                          <ActionButton
                            variant="approve"
                            onClick={() => handleAction(seller, "approve")}
                            loading={processing === `${seller.seller_ref_code}-approve`}
                          >
                            <FiCheckCircle /> Approve
                          </ActionButton>
                        ) : (
                          <ActionButton
                            variant="reject"
                            onClick={() => handleAction(seller, "reject")}
                            loading={processing === `${seller.seller_ref_code}-reject`}
                          >
                            <FiXCircle /> Reject
                          </ActionButton>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </DesktopView>

          {/* Mobile Cards */}
          <MobileView>
            <CardGrid>
              {currentPageData.map((seller) => (
                <SellerCard
                  key={seller.id}
                  seller={seller}
                  onAction={handleAction}
                  processing={processing}
                />
              ))}
            </CardGrid>
          </MobileView>
        </>
      )}

      {filtered.length > 0 && (
        <Pagination page={page} total={totalPages} onPageChange={setPage} />
      )}
    </Container>
  );
};

export default SellerApproval;

// ===============================================
// Styled Components (Responsive)
// ===============================================

const Container = styled.div`
  max-width: 1480px;
  margin: 0 auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

// Search
const SearchWrapper = styled.div`
  position: relative;
  max-width: 300px;
`;
const FiSearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

// Table
const TableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;
const Th = styled.th`
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.8rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;
const Tr = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
  &:hover {
    background: #f8fafc;
  }
`;
const Td = styled.td`
  padding: 1rem 0.75rem;
  vertical-align: middle;
`;
const Mono = styled.div`
  font-family: monospace;
  font-weight: 700;
  font-size: 0.85rem;
  color: #1e293b;
`;
const Contact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
`;

// Badge
const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid;
`;

// Document Thumbs
const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ size }) => (size === "small" ? "50px" : "80px")}, 1fr));
  gap: 0.5rem;
`;
const ThumbLink = styled.a`
  display: block;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
  }
`;
const ThumbImage = styled.img`
  width: 100%;
  height: ${({ size }) => (size === "small" ? "40px" : "60px")};
  object-fit: cover;
`;
const NoDoc = styled.div`
  color: #9ca3af;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Action Button
const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid;
  background: white;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Pagination
const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const PageInfo = styled.div`
  font-size: 0.95rem;
  color: #64748b;
`;
const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? "#3b82f6" : "#e2e8f0")};
  background: ${({ active }) => (active ? "#3b82f6" : "white")};
  color: ${({ active }) => (active ? "white" : "#64748b")};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Loader
const LoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;
const BigSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

// Empty
const EmptyWrapper = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;
const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`;
const EmptyTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;
const EmptyText = styled.div`
  font-size: 0.95rem;
`;

// Responsive Views
const DesktopView = styled.div`
  display: none;
  @media (min-width: 992px) {
    display: block;
  }
`;
const MobileView = styled.div`
  display: block;
  @media (min-width: 992px) {
    display: none;
  }
`;

// Card Grid
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

// Card Styles
const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: ${({ status }) =>
      status === "approved"
        ? "linear-gradient(90deg, #10b981, #34d399)"
        : "linear-gradient(90deg, #ef4444, #f87171)"};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  }
`;
const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;
const RefCode = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const SellerName = styled.h3`
  margin: 0.25rem 0 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
`;
const CardBody = styled.div`
  padding: 0 1.5rem 1rem;
`;
const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 0.5rem;
`;
const CardSection = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
`;
const SectionLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`;
const CardFooter = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  background: #f8fafc;
  text-align: right;
`;

// Import missing icon
// const FiSearch = (props) => <FiMail {...props} style={{ transform: "rotate(90deg)" }} />;
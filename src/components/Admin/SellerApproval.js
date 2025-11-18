import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSellerTempleList, updateSellerStatus } from '../../services/customerServices';
import { getCurrentTempleId } from '../../services/serviceUtils';
import { toast } from 'react-toastify';

// SellerComponent imports
import { RemarkModal } from './SellerComponent/RemarkModal';
import { SellerTable } from './SellerComponent/SellerTable';
import { DocumentsPreviewModal } from './SellerComponent/DocumentsPreviewModal';
import { getCallMode } from './SellerComponent/utils';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: #1f2937;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #6b7280;
    margin: 0;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PaginationInfo = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Main Component
const SellerManagementScreen = () => {
  const [data, setData] = useState({ loading: true, rows: [], error: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    seller: null
  });
  const [documentsModalState, setDocumentsModalState] = useState({
    isOpen: false,
    documents: [],
    sellerName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templeId = getCurrentTempleId() || "";


  // Load sellers function
  const loadSellers = async () => {
    setData((s) => ({ ...s, loading: true }));
    try {
      const list = await getSellerTempleList();
      const raw = Array.isArray(list.data)
        ? list.data
        : list?.results || list?.data || [];

      const filtered = raw.filter(
        (item) => String(item.temple_id) === String(templeId)
      );

      const rows = filtered.map((r, idx) => {
        // Collect all document files
        const docs = [
          r.document_file_1, 
          r.document_file_2, 
          r.document_file_3
        ]
          .filter(Boolean) // Remove null/undefined
          .map(url => {
            // Determine document type based on file extension
            const extension = url.split('.').pop().toLowerCase();
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
            const type = imageExtensions.includes(extension) ? 'image' : 'pdf';
            
            return {
              type,
              url
            };
          });

        // Use status_display from API, with fallback logic
        let status_display = 'pending';
        if (r.status_display) {
          status_display = String(r.status_display).toLowerCase();
        } else if (typeof r.is_approved === "boolean") {
          status_display = r.is_approved ? 'approved' : 'rejected';
        } else if (r.is_approved !== null && r.is_approved !== undefined) {
          const approvedStr = String(r.is_approved).toLowerCase();
          if (approvedStr === "true") status_display = 'approved';
          else if (approvedStr === "false") status_display = 'rejected';
        }

        let status = 's';
        if (r.status) {
          status = String(r.status).toLowerCase();
        } else if (typeof r.is_approved === "boolean") {
          status = r.is_approved ? 'approved' : 'rejected';
        } else if (r.is_approved !== null && r.is_approved !== undefined) {
          const approvedStr = String(r.is_approved).toLowerCase();
          if (approvedStr === "true") status = 'approved';
          else if (approvedStr === "false") status = 'rejected';
        }

        return {
          id: r.id || r.seller_ref_code || `S-${idx + 1}`,
          seller_ref_code: r.seller_ref_code,
          name: r.seller_name || "Unknown",
          seller_email: r.seller_email || "",
          seller_phone: r.seller_phone || "",
          status: status_display, // Now uses status_display from API
          status_code: status, // Now uses status_display from API
          documents: docs,
          raw: r,
        };
      });

      setData({ loading: false, rows, error: null });
    } catch (e) {
      setData({ loading: false, rows: [], error: e.message || "Failed" });
    }
  };

  useEffect(() => {
    loadSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templeId]);

  const handleViewAllDocuments = (seller) => {
  setDocumentsModalState({
    isOpen: true,
    documents: seller.documents,
    sellerName: seller.name
  });
};
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return data.rows.filter(seller =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.seller_ref_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data.rows]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAction = (action, seller) => {
    setModalState({ isOpen: true, action, seller });
  };

  const handleModalSubmit = async (remark) => {
    if (!modalState.seller || !modalState.action) {
      toast.error('Missing seller or action information');
      return;
    }

    const call_mode = getCallMode(modalState.action);
    if (!call_mode) {
      toast.error(`Invalid action: ${modalState.action}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSellerStatus({
        temple_id: templeId,
        call_mode,
        seller_ref_code: modalState.seller.seller_ref_code,
        remark: remark || ''
      });

      const actionNames = {
        'approve': 'approved',
        'reject': 'rejected',
        'action needed': 'marked as action needed',
        'inactive': 'marked as inactive'
      };

      toast.success(`Seller ${actionNames[modalState.action.toLowerCase()] || 'updated'} successfully!`);
      
      setModalState({ isOpen: false, action: '', seller: null });
      
      // Reload sellers list
      await loadSellers();
    } catch (error) {
      console.error('Failed to update seller status:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update seller status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentView = (document) => {
    if (document.type === 'image') {
      window.open(document.url, '_blank');
    } else {
      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.url.split('/').pop();
      link.click();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>Seller Management</h1>
          <p>Review and manage seller applications</p>
        </Header>

        <SearchBar>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or seller code..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </SearchBar>

        <SellerTable
          data={paginatedData}
          onAction={handleAction}
          onDocumentView={handleDocumentView}
          onViewAllDocuments={handleViewAllDocuments}
            loading={data.loading}
          error={data.error}
        />

        <Pagination>
          <PaginationInfo>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || filteredData.length === 0}
            >
              Next
              <ChevronRight size={16} />
            </PaginationButton>
          </PaginationButtons>
        </Pagination>
      </Card>

      <RemarkModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: '', seller: null })}
        onSubmit={handleModalSubmit}
        action={modalState.action}
        seller={modalState.seller}
        isSubmitting={isSubmitting}
      />

      <DocumentsPreviewModal
        isOpen={documentsModalState.isOpen}
        onClose={() => setDocumentsModalState({ isOpen: false, documents: [], sellerName: '' })}
        documents={documentsModalState.documents}
        sellerName={documentsModalState.sellerName}
      />
    </Container>
  );
};

export default SellerManagementScreen;
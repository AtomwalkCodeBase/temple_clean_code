import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, Download } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { getActionsByStatus } from './utils';
import StatusBadges from '../AdminLayout/StatusBadges';

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);

  th {
    padding: 1rem;
    text-align: left;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const Tbody = styled.tbody`
  tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background 0.2s ease;

    &:hover {
      background: #f9fafb;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 1rem;
    color: #374151;
    font-size: 0.875rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DocumentButton = styled(motion.button)`
  padding: 0.5rem;
  border: 2px solid #3b82f6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #3b82f6;
  transition: all 0.2s ease;

  &:hover {
    background: #3b82f6;
    color: white;
  }

  svg {
    display: block;
  }
`;

const DocumentContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const DocumentCount = styled.span`
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const ErrorSubText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
`;

const EmptyText = styled.p`
  color: #374151;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const EmptySubText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

export const SellerTable = ({ data, onAction, onDocumentView, onViewAllDocuments, loading, error }) => {
  const renderActions = (seller) => {
    const actions = getActionsByStatus(seller.status_code);
    
    if (actions.length === 0) {
      return (
        <span style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>
          No actions available
        </span>
      );
    }
    
    return actions.map((action) => (
      <ActionButton
        key={action}
        action={action}
        seller={seller}
        onClick={onAction}
      />
    ));
  };

  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <th>Seller Code</th>
            <th>Name</th>
            <th>Status</th>
            <th>Document</th>
            <th>Actions</th>
          </tr>
        </Thead>
        <Tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                <LoadingSpinner />
                <LoadingText>Loading sellers...</LoadingText>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                <ErrorContainer>
                  <ErrorIcon>⚠️</ErrorIcon>
                  <ErrorText>{error}</ErrorText>
                  <ErrorSubText>Please try again later</ErrorSubText>
                </ErrorContainer>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                <EmptyState>
                  <EmptyIcon>📋</EmptyIcon>
                  <EmptyText>No sellers found</EmptyText>
                  <EmptySubText>Try adjusting your search filters</EmptySubText>
                </EmptyState>
              </td>
            </tr>
          ) : (
            data.map((seller) => (
              <motion.tr
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td style={{ fontWeight: 600 }}>{seller.seller_ref_code}</td>
                <td>{seller.name}</td>
                <td>
                  <StatusBadges value={seller.status} />
                </td>
                <td>
                  <DocumentContainer>
                    {seller.documents.length === 0 ? (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No documents</span>
                    ) : seller.documents.length <= 2 ? (
                      seller.documents.map((doc, idx) => (
                        <DocumentButton
                          key={idx}
                          onClick={() => onDocumentView(doc)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {doc.type === 'image' ? <Eye size={18} /> : <Download size={18} />}
                        </DocumentButton>
                      ))
                    ) : (
                      <>
                        <DocumentButton
                          onClick={() => onDocumentView(seller.documents[0])}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {seller.documents[0].type === 'image' ? <Eye size={18} /> : <Download size={18} />}
                        </DocumentButton>
                        <DocumentCount onClick={() => onViewAllDocuments(seller)}>
                          +{seller.documents.length - 1} more
                        </DocumentCount>
                      </>
                    )}
                  </DocumentContainer>
                </td>
                <td>
                  <ActionButtons>
                    {renderActions(seller)}
                  </ActionButtons>
                </td>
              </motion.tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableWrapper>
  );
};


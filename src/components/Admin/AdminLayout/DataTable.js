"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import { GiLotus, TempleGate } from "react-icons/gi";

const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  overflow: visible;
  box-shadow: 0 6px 24px rgba(0, 86, 214, 0.08);
  border: 1px solid #cfe0ff;
`;

const TableHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #cfe0ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: #f3f8ff;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    font-size: 1rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #374151;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
  }

  &::placeholder {
    color: #9ca3af;
    opacity: 0.6;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: visible;
`;

const TableHead = styled.thead`
  background: linear-gradient(180deg, #f6faff 0%, #eaf2ff 100%);

  th {
    padding: 1rem 2rem;
    text-align: left;
    font-weight: 600;
    color: #0a4db4;
    font-size: 0.9rem;
    border-bottom: 1px solid #d7e4ff;
    position: relative;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 60%;
      width: 1px;
      background: linear-gradient(to bottom, transparent, #d7e4ff, transparent);
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e6efff;
    transition: background-color 0.2s;
    background: #ffffff;
    position: relative;

    &:nth-child(even) {
      background: #f6faff;
    }

    &:hover {
      background: #eaf2ff;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 1rem 2rem;
    color: #0f172a;
    font-size: 0.9rem;
    vertical-align: middle;
  }
`;

const ActionCell = styled.td`
  text-align: right;
`;

const ActionButton = styled.button`
  background: #ffffff;
  border: 1px solid #cfe0ff;
  color: #0056d6;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  width: 36px;
  height: 36px;

  &:hover {
    background: #eaf2ff;
    color: #0a4db4;
    border-color: #a8c6ff;
  }
`;

const ActionMenu = styled(motion.div)`
  position: absolute;
  ${(props) => (props.openAbove ? "bottom: calc(100% + 4px);" : "top: calc(100% + 4px);")}
  right: 0;
  background: #ffffff;
  border: 1px solid #cfe0ff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 86, 214, 0.15);
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
  transform-origin: ${(props) => (props.openAbove ? "bottom right" : "top right")};
  /* Keep menu within viewport when near bottom */
  @media (max-height: 700px) {
    max-height: 60vh;
    overflow: auto;
  }
`;

const ActionWrapper = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
`;

const ActionMenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #0f172a;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #e6efff;

  &:hover {
    background: #eaf2ff;
    color: #0a4db4;
  }

  &.danger {
    color: #d64545;

    &:hover {
      background: #ffecec;
    }
  }

  .icon {
    font-size: 0.9rem;
    color: #0056d6;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #3b82f6;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #a8c6ff;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #0f172a;
  }

  p {
    margin: 0;
    opacity: 0.8;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  flex-direction: column;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 86, 214, 0.15);
    border-top: 4px solid #0056d6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: #3b82f6;
    font-size: 0.9rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const TableFooter = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid #cfe0ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f8ff;
  color: #3b82f6;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #cfe0ff;
  background: ${(props) => (props.active ? "#0056d6" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#0056d6")};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eaf2ff;
    color: #0a4db4;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  emptyIcon = <GiLotus />,
  emptyTitle = "No Data Found",
  emptyDescription = "There are no items to display at this time.",
  searchable = true,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [openAboveRowIndex, setOpenAboveRowIndex] = useState(null);

  const filteredData = searchable
    ? data.filter((item) =>
        columns.some((column) => {
          const value = item[column.key];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      )
    : data;

  const handleActionClick = (index, event) => {
    event.stopPropagation();
    if (activeActionMenu === index) {
      setActiveActionMenu(null);
      setOpenAboveRowIndex(null);
      return;
    }

    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenAbove = spaceBelow < 180; // approximate menu height + spacing
      setOpenAboveRowIndex(shouldOpenAbove ? index : null);
    } catch {
      setOpenAboveRowIndex(null);
    }

    setActiveActionMenu(index);
  };

  const handleActionItemClick = (action, item) => {
    setActiveActionMenu(null);
    setOpenAboveRowIndex(null);
    if (action === "edit" && onEdit) onEdit(item);
    if (action === "delete" && onDelete) onDelete(item);
    if (action === "view" && onView) onView(item);
  };

  // Close action menu when clicking outside
  useState(() => {
    const handleClickOutside = () => {
      setActiveActionMenu(null);
      setOpenAboveRowIndex(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <TableContainer>
        <LoadingContainer>
          <div className="spinner"></div>
          <div className="loading-text">Loading sacred records...</div>
        </LoadingContainer>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      {searchable && (
        <TableHeader>
          <SearchContainer>
            <FiSearch className="search-icon" />
            <SearchInput
              type="text"
              placeholder="Search sacred records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </TableHeader>
      )}

      {filteredData.length === 0 ? (
        <EmptyState>
          <div className="icon">{emptyIcon}</div>
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
        </EmptyState>
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.title}</th>
                ))}
                {(onEdit || onDelete || onView) && <th>Actions</th>}
              </tr>
            </TableHead>
            <TableBody>
              {filteredData.map((item, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render
                        ? column.render(item[column.key], item, rowIndex)
                        : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <ActionCell>
                      <ActionWrapper>
                        <ActionButton
                          aria-label="Row actions"
                          onClick={(e) => handleActionClick(rowIndex, e)}
                        >
                          <FiMoreVertical />
                        </ActionButton>

                        {activeActionMenu === rowIndex && (
                          <ActionMenu
                            openAbove={openAboveRowIndex === rowIndex}
                            initial={{ opacity: 0, scale: 0.98, y: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {onView && (
                              <ActionMenuItem
                                onClick={() =>
                                  handleActionItemClick("view", item)
                                }
                              >
                                <FiEye className="icon" />
                                View Details
                              </ActionMenuItem>
                            )}
                            {onEdit && (
                              <ActionMenuItem
                                onClick={() =>
                                  handleActionItemClick("edit", item)
                                }
                              >
                                <FiEdit className="icon" />
                                Edit
                              </ActionMenuItem>
                            )}
                            {onDelete && (
                              <ActionMenuItem
                                className="danger"
                                onClick={() =>
                                  handleActionItemClick("delete", item)
                                }
                              >
                                <FiTrash2 className="icon" />
                                Delete
                              </ActionMenuItem>
                            )}
                          </ActionMenu>
                        )}
                      </ActionWrapper>
                    </ActionCell>
                  )}
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {pagination && (
            <TableFooter>
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>
              <Pagination>
                <PageButton
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  Previous
                </PageButton>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <PageButton
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  Next
                </PageButton>
              </Pagination>
            </TableFooter>
          )}
        </>
      )}
    </TableContainer>
  );
};

export default DataTable;

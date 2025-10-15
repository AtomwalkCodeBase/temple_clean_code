"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { LuIndianRupee } from "react-icons/lu";
import {
  getAdvancePolicyList,
  processAdvancePolicyData,
} from "../../services/templeServices";
import { getStoredTempleId } from "../../services/authServices";
import DataTable from "./AdminLayout/DataTable";
import PageContainer from "./AdminLayout/PageContainer";
import AddAdvancePolicyModal from "./Modals/AddAdvancePolicyModal";

const AddButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const AdvancePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const templeId = getStoredTempleId();
  console.log(policies, "policies");
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await getAdvancePolicyList();
      // Filter by temple_id if needed
      const filteredPolicies = response.filter(
        (policy) => !templeId || policy.temple_id.toString() === templeId
      );
      setPolicies(filteredPolicies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPolicy = () => {
    setSelectedPolicy(null);
    setShowAddModal(true);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowAddModal(true);
  };

  const handleDeletePolicy = async (policy) => {
    if (window.confirm(`Are you sure you want to delete "${policy.name}"?`)) {
      try {
        await processAdvancePolicyData({
          call_mode: "DELETE",
          temple_id: templeId,
          adv_policy_id: policy.id,
        });
        fetchPolicies();
      } catch (error) {
        console.error("Error deleting policy:", error);
        alert("Failed to delete policy");
      }
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setSelectedPolicy(null);
  };

  const handlePolicySaved = () => {
    fetchPolicies();
    handleModalClose();
  };

  const columns = [
    {
      key: "name",
      title: "Policy Name",
      render: (value, item) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1f2937" }}>{value}</div>
          {item.is_default && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#059669",
                background: "#d1fae5",
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                marginTop: "0.25rem",
                display: "inline-block",
              }}
            >
              Default
            </span>
          )}
        </div>
      ),
    },
    {
      key: "percent",
      title: "Advance %",
      render: (value) => `${value}%`,
    },
    {
      key: "min_amount",
      title: "Min Amount",
      render: (value) => `₹${Number.parseFloat(value).toLocaleString()}`,
    },
    {
      key: "due_days_before",
      title: "Due Days Before",
      render: (value) => `${value} days`,
    },
    {
      key: "due_mode_str",
      title: "Due Mode",
    },
    {
      key: "is_active",
      title: "Status",
      render: (value) => (value ? "Active" : "Inactive"),
    },
  ];

  return (
    <>
      <PageContainer
        title="Advance Policies"
        description="Manage advance booking policies for your temple services"
        icon={<LuIndianRupee />}
        gradient="linear-gradient(135deg, #0056d6 0%, #0a4db4 100%)"
        actions={
          <AddButton
            onClick={handleAddPolicy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Policy
          </AddButton>
        }
      >
        <DataTable
          data={policies}
          columns={columns}
          loading={loading}
          onEdit={handleEditPolicy}
          onDelete={handleDeletePolicy}
          emptyIcon="💰"
          emptyTitle="No Advance Policies Found"
          emptyDescription="Create your first advance booking policy to get started."
        />
      </PageContainer>

      <AnimatePresence>
        {showAddModal && (
          <AddAdvancePolicyModal
            policy={selectedPolicy}
            onClose={handleModalClose}
            onSuccess={handlePolicySaved}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdvancePolicies;

"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiPlus } from "react-icons/fi";
import {
  getRefundPolicyList,
  processRefundPolicyData,
} from "../../services/templeServices";
import { getStoredTempleId } from "../../services/authServices";
import PageContainer from "./AdminLayout/PageContainer";
import DataTable from "./AdminLayout/DataTable";
import AddRefundPolicyModal from "./Modals/AddRefundPolicyModal";

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

const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RuleItem = styled.div`
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  border-left: 3px solid #0056d6;
  font-size: 0.8rem;
  line-height: 1.3;
`;

const RuleText = styled.div`
  color: #374151;
  font-weight: 500;
`;

const RuleDetail = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.125rem;
`;

const ExpandableRules = styled.div`
  max-height: 150px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const RefundPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const templeId = getStoredTempleId();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await getRefundPolicyList();
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
        await processRefundPolicyData({
          call_mode: "DELETE",
          temple_id: templeId,
          refund_policy_id: policy.id,
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

  const formatRuleText = (rule) => {
    if (rule.min_hours_before > 0) {
      return `${rule.refund_percent}% refund if cancelled ${
        rule.min_hours_before
      } hour${rule.min_hours_before !== 1 ? "s" : ""} before`;
    } else if (rule.min_days_before > 0) {
      return `${rule.refund_percent}% refund if cancelled ${
        rule.min_days_before
      } day${rule.min_days_before !== 1 ? "s" : ""} before`;
    } else {
      return `${rule.refund_percent}% refund (no time restriction)`;
    }
  };

  const getTimeType = (rule) => {
    if (rule.min_hours_before > 0) return "hours";
    if (rule.min_days_before > 0) return "days";
    return "immediate";
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
      key: "refund_rules",
      title: "Refund Rules",
      render: (rules) => (
        <div>
          <div
            style={{
              fontWeight: 500,
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            {rules?.length || 0} rule{rules?.length !== 1 ? "s" : ""}
          </div>

          {rules?.length > 0 && (
            <ExpandableRules>
              <RulesList>
                {rules.map((rule, index) => (
                  <RuleItem key={index}>
                    <RuleText>
                      Rule {index + 1}: {formatRuleText(rule)}
                    </RuleText>
                    {rule.notes && <RuleDetail>Note: {rule.notes}</RuleDetail>}
                  </RuleItem>
                ))}
              </RulesList>
            </ExpandableRules>
          )}
        </div>
      ),
    },
    {
      key: "temple_name",
      title: "Temple",
    },
    {
      key: "is_active",
      title: "Status",
      render: (value) => (
        <span
          style={{
            color: value ? "#059669" : "#dc2626",
            fontWeight: 600,
            background: value ? "#d1fae5" : "#fee2e2",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
          }}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageContainer
        title="Refund Policies"
        description="Manage refund policies and cancellation rules for your temple services"
        icon={<FiRefreshCw />}
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
          emptyIcon="🔄"
          emptyTitle="No Refund Policies Found"
          emptyDescription="Create your first refund policy to manage cancellations."
        />
      </PageContainer>

      <AnimatePresence>
        {showAddModal && (
          <AddRefundPolicyModal
            policy={selectedPolicy}
            onClose={handleModalClose}
            onSuccess={handlePolicySaved}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RefundPolicies;

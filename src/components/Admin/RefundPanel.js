import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledRefundPanel = styled.div`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Loading State */
  .refund-panel-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: rgba(60, 60, 67, 0.6);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(60, 60, 67, 0.1);
    border-top: 2px solid #007aff;
    border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    margin-bottom: 16px;
  }

  .loading-text {
    font-size: 17px;
    font-weight: 400;
    color: rgba(60, 60, 67, 0.6);
    letter-spacing: -0.41px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    margin: 0;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .empty-title {
    font-size: 22px;
    font-weight: 600;
    color: rgba(60, 60, 67, 1);
    margin-bottom: 8px;
    letter-spacing: -0.26px;
  }

  .empty-description {
    font-size: 17px;
    color: rgba(60, 60, 67, 0.6);
    line-height: 1.47;
    letter-spacing: -0.41px;
    max-width: 320px;
    margin: 0 auto;
  }

  /* Success Message */
  .success-message {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: rgba(52, 199, 89, 0.1);
    border: 1px solid rgba(52, 199, 89, 0.2);
    border-radius: 12px;
    color: rgba(30, 130, 76, 1);
    font-size: 17px;
    font-weight: 500;
    margin-bottom: 24px;
    letter-spacing: -0.41px;
  }

  .success-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    opacity: 0.8;
  }

  /* View Mode */
  .refund-panel-view {
    padding: 0;
  }

  .policy-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 40px rgba(0, 0, 0, 0.03);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 0;
  }

  .policy-card:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 24px 48px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  .policy-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 16px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    background: rgba(255, 255, 255, 0.6);
  }

  .policy-title {
    font-size: 18px;
    font-weight: 700;
    color: rgba(60, 60, 67, 1);
    margin: 0 0 4px 0;
    letter-spacing: -0.26px;
  }

  .policy-subtitle {
    font-size: 12px;
    color: rgba(60, 60, 67, 0.6);
    margin: 0;
    font-weight: 400;
    letter-spacing: -0.24px;
  }

  .edit-button {
    display: flex;
    align-items: center;
    padding: 8px 14px;
    background: #007aff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: -0.2px;
    box-shadow: 0 1px 3px rgba(0, 122, 255, 0.3);
  }

  .edit-button:hover {
    background: #0056cc;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
  }

  .edit-button:active {
    transform: translateY(0);
    transition: all 0.1s;
  }

  .edit-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }

  .policy-details {
    padding: 16px;
  }

  .content-chips {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .content-chip {
    padding: 6px 10px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    letter-spacing: -0.2px;
  }

  .policy-name-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .policy-name-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .policy-name {
    font-size: 17px;
    font-weight: 400;
    color: rgba(60, 60, 67, 1);
    margin: 0;
    letter-spacing: -0.2px;
  }

  .policy-badges {
    display: flex;
    gap: 8px;
  }

  .badge {
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-feature-settings: "tnum";
  }

  .badge-selected {
    background: rgba(52, 199, 89, 0.15);
    color: rgba(30, 130, 76, 1);
    border: 1px solid rgba(52, 199, 89, 0.3);
  }

  .badge-default {
    background: rgba(0, 122, 255, 0.15);
    color: rgba(0, 64, 221, 1);
    border: 1px solid rgba(0, 122, 255, 0.3);
  }

  /* Edit Mode */
  .refund-panel-edit {
    padding: 0;
    display: block;
  }

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 16px 16px 0 0;
    padding: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  .edit-title {
    font-size: 18px;
    font-weight: 700;
    color: rgba(60, 60, 67, 1);
    margin: 0 0 4px 0;
    letter-spacing: -0.26px;
  }

  .edit-subtitle {
    font-size: 12px;
    color: rgba(60, 60, 67, 0.6);
    margin: 0;
    letter-spacing: -0.24px;
  }

  .edit-mode-badge {
    padding: 6px 12px;
    background: rgba(255, 149, 0, 0.15);
    color: rgba(255, 149, 0, 1);
    border: 1px solid rgba(255, 149, 0, 0.3);
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .policy-selection-container {
    display: block;
  }

  .policy-selection {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-top: none;
    border-radius: 0 0 16px 16px;
    padding: 24px;
  }

  .policy-options {
    display: grid;
    gap: 12px;
    margin-bottom: 24px;
  }

  .policy-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  .policy-option:hover {
    border-color: rgba(0, 122, 255, 0.3);
    background: rgba(0, 122, 255, 0.03);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
  }

  .policy-option.selected {
    border-color: #007aff;
    background: rgba(0, 122, 255, 0.05);
    box-shadow: 0 0 0 1px rgba(0, 122, 255, 0.1);
  }

  .option-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  .policy-radio {
    width: 18px;
    height: 18px;
    accent-color: #007aff;
    cursor: pointer;
  }

  .option-details {
    display: flex;
    flex-direction: column;
  }

  .option-name {
    font-weight: 600;
    color: rgba(60, 60, 67, 1);
    font-size: 14px;
    letter-spacing: -0.2px;
    margin: 0 0 2px 0;
  }

  .option-specs {
    font-size: 12px;
    color: rgba(60, 60, 67, 0.6);
    letter-spacing: -0.24px;
    margin: 0;
  }

  .option-meta {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }

  .option-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    background: rgba(255, 255, 255, 0.8);
  }

  .cancel-button {
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.8);
    color: rgba(60, 60, 67, 1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: -0.2px;
    backdrop-filter: blur(10px);
  }

  .cancel-button:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .save-button {
    padding: 8px 14px;
    background: #3b82f6; /* blue */
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: -0.2px;
    box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
  }

  .save-button:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .save-button:disabled {
    background: rgba(60, 60, 67, 0.3);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .save-button:active:not(:disabled) {
    transform: translateY(0);
    transition: all 0.1s;
  }

  /* Force light theme */

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  .policy-details {
    .refund-rules-section {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .rules-title {
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .refund-timeline {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .timeline-item {
      display: flex;
      gap: 0.75rem;
    }

    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .timeline-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #0056d6;
      flex-shrink: 0;
    }

    .timeline-line {
      width: 1px;
      flex: 1;
      background: #d1d5db;
      margin-top: 0.25rem;
    }

    .timeline-content {
      flex: 1;
      padding-bottom: 0.75rem;
    }

    .rule-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .rule-percent {
      font-weight: 600;
      color: #059669;
      font-size: 0.9rem;
    }

    .rule-days {
      color: #6b7280;
      font-size: 0.8rem;
    }

    .rule-notes {
      color: #6b7280;
      font-size: 0.8rem;
      font-style: italic;
    }

    .default-badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
    }
  }

  .policy-option {
    .refund-rules-preview {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .preview-rule {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
    }

    .preview-percent {
      font-weight: 600;
      color: #059669;
    }

    .preview-condition {
      color: #6b7280;
    }

    .preview-more {
      color: #9ca3af;
      font-size: 0.75rem;
      font-style: italic;
    }

    .option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .option-rules-count {
      font-size: 0.8rem;
      color: #6b7280;
      margin-left: 3px;
    }
  }
`;

const RefundPanel = ({
  hall,
  refundPolicies = [],
  selectedRefundPolicyId,
  onSelect,
  onSave,
  successMessage,
  loading,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempSelectedPolicyId, setTempSelectedPolicyId] = useState(
    selectedRefundPolicyId
  );
  console.log(refundPolicies, "refundPolicies");

  // Reset edit mode when hall changes
  useEffect(() => {
    setIsEditMode(false);
    setTempSelectedPolicyId(selectedRefundPolicyId);
  }, [hall?.service_id, selectedRefundPolicyId]);

  // Get current policy (selected only; no cross-temple defaults)
  const getCurrentPolicy = () => {
    if (selectedRefundPolicyId) {
      return refundPolicies.find(
        (p) => Number(p.id) === Number(selectedRefundPolicyId)
      );
    }
    return undefined;
  };

  // Helper function to format refund rules for display
  const formatRefundRules = (policy) => {
    if (!policy?.refund_rules?.length) return [];

    // Sort rules by days before (descending) so most generous refund comes first
    return [...policy.refund_rules].sort((a, b) => {
      const daysA = a.min_days_before || 0;
      const daysB = b.min_days_before || 0;
      return daysB - daysA;
    });
  };

  const currentPolicy = getCurrentPolicy();
  const currentPolicyRules = currentPolicy
    ? formatRefundRules(currentPolicy)
    : [];

  const handleEditClick = () => {
    setIsEditMode(true);
    setTempSelectedPolicyId(selectedRefundPolicyId);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setTempSelectedPolicyId(selectedRefundPolicyId);
  };

  const handleSave = () => {
    onSelect(tempSelectedPolicyId);
    // Pass the tempSelectedPolicyId directly to onSave to avoid async state issues
    if (typeof onSave === "function") {
      onSave(tempSelectedPolicyId);
    }
    setIsEditMode(false);
  };

  const handlePolicySelect = (policyId) => {
    setTempSelectedPolicyId(policyId);
  };

  if (loading) {
    return (
      <StyledRefundPanel>
        <div className="refund-panel-loading">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading refund policies...</span>
        </div>
      </StyledRefundPanel>
    );
  }

  if (refundPolicies.length === 0) {
    return (
      <StyledRefundPanel>
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <h3 className="empty-title">No Refund Policies</h3>
          <p className="empty-description">
            Create policies in the Refund Policies section to get started
          </p>
        </div>
      </StyledRefundPanel>
    );
  }

  // View Mode
  if (!isEditMode) {
    return (
      <StyledRefundPanel>
        <div className="refund-panel-view">
          {successMessage && (
            <div className="success-message">
              <svg
                className="success-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          )}

          <div className="policy-card">
            <div className="policy-header">
              <div className="policy-title-section">
                <h2 className="policy-title">Refund Policy for {hall?.name}</h2>
                <p className="policy-subtitle">
                  {currentPolicy ? "Current Policy" : "No policy selected"}
                </p>
              </div>
              <button className="edit-button" onClick={handleEditClick}>
                <svg
                  className="edit-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {currentPolicy ? "Edit Policy" : "Add Policy"}
              </button>
            </div>

            {currentPolicy ? (
              <div className="policy-details">
                <div className="policy-name-section">
                  <div className="policy-name-container">
                    <h3 className="policy-name">{currentPolicy.name}</h3>
                    {currentPolicy.is_default && (
                      <span className="default-badge">Default Policy</span>
                    )}
                  </div>
                </div>

                {/* Refund Rules Timeline */}
                <div className="refund-rules-section">
                  <h4 className="rules-title">Refund Rules:</h4>
                  <div className="refund-timeline">
                    {currentPolicyRules.map((rule, index) => (
                      <div key={rule.id} className="timeline-item">
                        <div className="timeline-marker">
                          <div className="timeline-dot"></div>
                          {index < currentPolicyRules.length - 1 && (
                            <div className="timeline-line"></div>
                          )}
                        </div>
                        <div className="timeline-content">
                          <div className="rule-main">
                            <span className="rule-percent">
                              {Math.round(Number(rule.refund_percent || 0))}%
                              Refund
                            </span>
                            <span className="rule-days">
                              {rule.min_days_before === null ||
                              rule.min_days_before === undefined
                                ? "Any time"
                                : rule.min_days_before === 0
                                ? "Same day cancellation"
                                : `${rule.min_days_before} days before service`}
                            </span>
                          </div>
                          {rule.notes && (
                            <div className="rule-notes">{rule.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="policy-details">
                <div className="policy-name-section">
                  <div className="policy-name-container">
                    <h3 className="policy-name">No Refund Policy defined</h3>
                    <p className="no-policy-description">
                      Select a policy to define refund rules for this hall
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </StyledRefundPanel>
    );
  }

  // Edit Mode
  return (
    <StyledRefundPanel>
      <div className="refund-panel-edit">
        {successMessage && (
          <div className="success-message">
            <svg
              className="success-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="edit-header">
          <div>
            <h2 className="edit-title">Select Policy</h2>
            <p className="edit-subtitle">
              Choose a refund policy for {hall?.name}
            </p>
          </div>

          <div className="edit-mode-badge">Edit Mode</div>
        </div>

        <div className="policy-selection-container">
          <div className="policy-selection">
            <div className="policy-options">
              {refundPolicies.map((policy) => {
                const policyRules = formatRefundRules(policy);
                return (
                  <label
                    key={policy.id}
                    className={`policy-option ${
                      Number(tempSelectedPolicyId) === Number(policy.id)
                        ? "selected"
                        : ""
                    }`}
                  >
                    <div className="option-content">
                      <input
                        type="radio"
                        name={`refund_policy_${hall?.service_id}`}
                        value={String(policy.id)}
                        checked={
                          Number(tempSelectedPolicyId) === Number(policy.id)
                        }
                        onChange={() => handlePolicySelect(Number(policy.id))}
                        className="policy-radio"
                      />
                      <div className="option-details">
                        <div className="option-header">
                          <div className="option-name">{policy.name}</div>
                          <div className="option-rules-count">
                            {policyRules.length} rule
                            {policyRules.length !== 1 ? "s" : ""}
                          </div>
                        </div>

                        {/* Refund Rules Preview */}
                        <div className="refund-rules-preview">
                          {policyRules.slice(0, 2).map((rule) => (
                            <div key={rule.id} className="preview-rule">
                              <span className="preview-percent">
                                {Math.round(Number(rule.refund_percent || 0))}%
                              </span>
                              <span className="preview-condition">
                                {rule.min_days_before === null ||
                                rule.min_days_before === undefined
                                  ? "any time"
                                  : `${rule.min_days_before} days before`}
                              </span>
                            </div>
                          ))}
                          {policyRules.length > 2 && (
                            <div className="preview-more">
                              +{policyRules.length - 2} more rules
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="option-badges">
                      {Number(tempSelectedPolicyId) === Number(policy.id) && (
                        <span className="badge badge-selected">Selected</span>
                      )}
                      {policy.is_default && (
                        <span className="badge badge-default">Default</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="action-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="save-button"
                onClick={handleSave}
                disabled={!tempSelectedPolicyId}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </StyledRefundPanel>
  );
};

export default RefundPanel;

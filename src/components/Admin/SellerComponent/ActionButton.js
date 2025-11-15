import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle, Ban } from 'lucide-react';

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const ActionButton = ({ action, seller, onClick }) => {
  const buttonConfig = {
    approve: {
      text: 'Approve',
      icon: Check,
      bg: '#10b981',
      hoverBg: '#059669'
    },
    reject: {
      text: 'Reject',
      icon: X,
      bg: '#ef4444',
      hoverBg: '#dc2626'
    },
    'action needed': {
      text: 'Action Needed',
      icon: AlertCircle,
      bg: '#f59e0b',
      hoverBg: '#d97706'
    },
    inactive: {
      text: 'Inactive',
      icon: Ban,
      bg: '#6b7280',
      hoverBg: '#4b5563'
    }
  };

  const config = buttonConfig[action];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Button
      onClick={() => onClick(action, seller)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        background: config.bg,
        color: 'white',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = config.hoverBg}
      onMouseLeave={(e) => e.currentTarget.style.background = config.bg}
    >
      <Icon size={16} />
      {config.text}
    </Button>
  );
};


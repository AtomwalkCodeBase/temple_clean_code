import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: ${props => {
    const sizes = {
      sm: '4px',
      md: '6px',
      lg: '8px'
    };
    return sizes[props.size] || sizes.md;
  }};
  padding: ${props => {
    const sizes = {
      sm: '6px 12px',
      md: '8px 16px',
      lg: '12px 24px'
    };
    return sizes[props.size] || sizes.md;
  }};
  font-size: ${props => {
    const sizes = {
      sm: '14px',
      md: '16px',
      lg: '18px'
    };
    return sizes[props.size] || sizes.md;
  }};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  outline: none;
  position: relative;
  min-width: fit-content;
  
  background: ${props => {
    const colors = {
      blue: '#2563eb',
      red: '#dc2626',
      green: '#16a34a',
      orange: '#f7931e',
      gray: '#6b7280',
      purple: '#7c3aed',
      teal: '#0d9488',
      yellow: '#ca8a04'
    };
    const color = colors[props.color] || props.color || colors.blue;
    return props.variant === 'outline' ? 'transparent' : color;
  }};
  
  color: ${props => {
    const colors = {
      blue: '#2563eb',
      red: '#dc2626',
      green: '#16a34a',
      orange: '#f7931e',
      gray: '#6b7280',
      purple: '#7c3aed',
      teal: '#0d9488',
      yellow: '#ca8a04'
    };
    const color = colors[props.color] || props.color || colors.blue;
    return props.variant === 'outline' ? color : '#ffffff';
  }};
  
  border: ${props => {
    const colors = {
      blue: '#2563eb',
      red: '#dc2626',
      green: '#16a34a',
      orange: '#f7931e',
      gray: '#6b7280',
      purple: '#7c3aed',
      teal: '#0d9488',
      yellow: '#ca8a04'
    };
    const color = colors[props.color] || props.color || colors.blue;
    return props.variant === 'outline' ? `2px solid ${color}` : 'none';
  }};
  
  &:hover:not(:disabled) {
    background: ${props => {
      const colors = {
        blue: '#1d4ed8',
        red: '#b91c1c',
        green: '#15803d',
        orange: '#ea580c',
        gray: '#4b5563',
        purple: '#6d28d9',
        teal: '#0f766e',
        yellow: '#a16207'
      };
      const color = colors[props.color] || props.color || colors.blue;
      return props.variant === 'outline' ? 'rgba(0, 0, 0, 0.05)' : color;
    }};
    transform: ${props => props.variant === 'outline' ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => {
      const colors = {
        blue: '#2563eb',
        red: '#dc2626',
        green: '#16a34a',
        orange: '#f7931e',
        gray: '#6b7280',
        purple: '#7c3aed',
        teal: '#0d9488',
        yellow: '#ca8a04'
      };
      const color = colors[props.color] || props.color || colors.blue;
      return props.variant === 'outline' ? 'none' : `0 4px 12px ${color}40`;
    }};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => {
      const colors = {
        blue: '#2563eb',
        red: '#dc2626',
        green: '#16a34a',
        orange: '#f7931e',
        gray: '#6b7280',
        purple: '#7c3aed',
        teal: '#0d9488',
        yellow: '#ca8a04'
      };
      const color = colors[props.color] || props.color || colors.blue;
      return `0 0 0 3px ${color}30`;
    }};
  }
  
  &:active:not(:disabled) {
    transform: ${props => props.variant === 'outline' ? 'none' : 'translateY(0)'};
    box-shadow: ${props => {
      const colors = {
        blue: '#2563eb',
        red: '#dc2626',
        green: '#16a34a',
        orange: '#f7931e',
        gray: '#6b7280',
        purple: '#7c3aed',
        teal: '#0d9488',
        yellow: '#ca8a04'
      };
      const color = colors[props.color] || props.color || colors.blue;
      return props.variant === 'outline' ? 'none' : `0 2px 8px ${color}50`;
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &:hover {
      background: ${props => {
        const colors = {
          blue: '#2563eb',
          red: '#dc2626',
          green: '#16a34a',
          orange: '#f7931e',
          gray: '#6b7280',
          purple: '#7c3aed',
          teal: '#0d9488',
          yellow: '#ca8a04'
        };
        const color = colors[props.color] || props.color || colors.blue;
        return props.variant === 'outline' ? 'transparent' : color;
      }};
      transform: none;
      box-shadow: none;
    }
  }
  
  ${props => props.loading && `
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

const Button = ({
  children,
  variant = 'filled',
  color = 'blue',
  size = 'md',
  className,
  loading = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      className={className}
      loading={loading}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['filled', 'outline']),
  color: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

Button.defaultProps = {
  variant: 'filled',
  color: 'blue',
  size: 'md',
  loading: false,
  type: 'button'
};

export default Button; 
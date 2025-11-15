export const getActionsByStatus = (status) => {
  const statusActions = {
    'a': ['reject', 'inactive'],
    'x': [],
    'c': [],
    's': ['approve', 'reject', 'action needed']
  };
  return statusActions[status?.toLowerCase()] || [];
};

export const getCallMode = (action) => {
  const actionMap = {
    'approve': 'APPROVE',
    'reject': 'REJECT',
    'action needed': 'ACTION_NEEDED',
    'inactive': 'INACTIVE'
  };
  return actionMap[action?.toLowerCase()] || null;
};


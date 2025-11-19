export const getActionsByStatus = (status) => {
  const statusActions = {
    'a': ['inactive'],                            // a:- Approve
    'x': ['approve',],             // x: - CANCELLED/INACTIVE
    'c': ['active', 'reject'],                    // c: -  Action needed
    's': ['approve', 'reject', 'action needed']   // s: - Submitted
  };
  return statusActions[status?.toLowerCase()] || [];
};

export const getCallMode = (action) => {
  const actionMap = {
    'approve': 'APPROVE',
    // 'reject': 'REJECT',
    'reject': 'INACTIVE',
    'action needed': 'ACTION_NEEDED',
    'inactive': 'INACTIVE',
    'active': 'APPROVE'
  };
  return actionMap[action?.toLowerCase()] || null;
};


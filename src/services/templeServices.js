import axios from "axios";

const BASE_URL = "https://agamandira.com/temple/api";
const CUSTOMER_BASE_URL = "https://agamandira.com/customer/api";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  return {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  };
};

// Get service types
export const getServiceTypeList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_service_type_list/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get price types
export const getPriceTypeList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_price_type_list/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get week days
export const getWeekDayList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_week_day_list/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get advance policies
export const getAdvancePolicyList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_advance_policy_list/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get refund policies
export const getRefundPolicyList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_refund_policy_list/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get pricing rules
export const getPricingRuleList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_pricing_rule_list/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get temple services
export const getTempleServicesList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_temple_services_list/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getCustomerList = async () => {
  try {
    const response = await axios.get(
      `${CUSTOMER_BASE_URL}/get_customer_list/`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Process advance policy
export const processAdvancePolicyData = async (policyData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/process_adv_policy_data/`,
      {
        adv_policy_data: policyData,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Process refund policy
export const processRefundPolicyData = async (policyData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/process_refund_policy_data/`,
      {
        refund_policy_data: policyData,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Process pricing rule
export const processPricingRuleData = async (pricingData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/process_pricing_rule_data/`,
      {
        pricing_data: pricingData,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Process temple service
export const processTempleServiceData = async (serviceData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/process_temple_service_data/`,
      {
        service_data: serviceData,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const processTempleServiceImages = async (imageData, call_mode) => {
  try {
    // Create FormData for file uploads
    const formData = new FormData();
    if (call_mode) {
      formData.append("call_mode", call_mode);
    }
    // Add service_id
    formData.append("service_id", imageData.service_id);

    // Add main image (compulsory)
    if (imageData.image_file) {
      formData.append("image_file", imageData.image_file);
    }

    // Add optional images
    for (let i = 1; i <= 5; i++) {
      const imageKey = `image_file_${i}`;
      if (imageData[imageKey]) {
        formData.append(imageKey, imageData[imageKey]);
      }
    }

    const response = await axios.post(
      `${BASE_URL}/process_service_images/`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get booking list (supports optional filters)
// params example: { temple_id, service_type, status, date_from, date_to, search, page, page_size, ordering }
export const getAdminBookingList = async (params = {}) => {
  try {
    const response = await axios.get(`${CUSTOMER_BASE_URL}/get_booking_list/`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

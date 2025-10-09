import api from "./axios"; // pre-configured axios instance

const STATIC_TOKEN = "my_static_token_123";

// Fetch all listings
export const fetchingListingData = async (token = STATIC_TOKEN) => {
  try {
    const response = await api.get("/properties", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching listing data:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch single listing by ID
export const getListingById = async (id, token = STATIC_TOKEN) => {
  try {
    const response = await api.get(`/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching listing:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new listing (with images/videos)
export const createListing = async (formData, token = STATIC_TOKEN) => {
  try {
    const response = await api.post("/properties", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error.response?.data || error.message);
    throw error;
  }
};

// Update listing
export const updateListing = async (id, formData, token = STATIC_TOKEN) => {
  try {
    const response = await api.put(`/properties/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error.response?.data || error.message);
    throw error;
  }
};

// Delete listing
export const deleteListing = async (id, token = STATIC_TOKEN) => {
  try {
    const response = await api.delete(`/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting listing:", error.response?.data || error.message);
    throw error;
  }
};

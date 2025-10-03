import api from "./axios"; // make sure axios.js exists in the same folder

// 1️⃣ Add item to wishlist
export const addToWishlist = async (payload) => {
  try {
    const response = await api.post("/wishlist", payload);
    return response.data;
  } catch (error) {
    console.log("Error adding to wishlist:", error.response?.data || error.message);
    throw new Error("Error adding to wishlist");
  }
};

// 2️⃣ Get wishlist items by userId
export const getWishlist = async (userId) => {
  try {
    const response = await api.get(`/wishlist/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching wishlist:", error.response?.data || error.message);
    throw new Error("Error fetching wishlist");
  }
};

// 3️⃣ Remove wishlist item by wishlist item id
export const removeFromWishlist = async (id) => {
  try {
    const response = await api.delete(`/wishlist/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error removing from wishlist:", error.response?.data || error.message);
    throw new Error("Error removing from wishlist");
  }
};

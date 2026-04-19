import api from "./axiosInstance";

export const getUserBids = async () => {
  try {
    const response = await api.get('/api/auctions/my-bids');
    console.log('getUserBids API response:', response);

    // Extract bids from response structure
    let bids = [];
    if (response?.data?.data?.bids && Array.isArray(response.data.data.bids)) {
      bids = response.data.data.bids;
    } else if (response?.data?.bids && Array.isArray(response.data.bids)) {
      bids = response.data.bids;
    }

    console.log('Extracted user bids:', bids);
    return { data: bids };
  } catch (error) {
    console.error("Failed to fetch user bids:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/users/me/profile');
    return response.data.data || response.data; // Handle both response structures
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const response = await api.get('/api/users/me/stats');
    return response.data.data || response.data; // Handle both response structures
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    throw error;
  }
};

export const getUserAuctions = async () => {
  try {
    const response = await api.get('/api/users/me/auctions');
    console.log('getUserAuctions API response:', response);

    // Extract auctions from response structure
    let auctions = [];
    if (response?.data && Array.isArray(response.data)) {
      auctions = response.data;
    } else if (response?.data?.data && Array.isArray(response.data.data)) {
      auctions = response.data.data;
    }

    console.log('Extracted user auctions:', auctions);
    return auctions;
  } catch (error) {
    console.error("Failed to fetch user auctions:", error);
    throw error;
  }
};

export const deleteAuction = async (auctionId) => {
  try {
    const response = await api.delete(`/api/auctions/${auctionId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete auction:", error);
    throw error;
  }
};

export const getSellerStats = async () => {
  try {
    const response = await api.get('/api/users/me/stats');
    console.log('getSellerStats API response:', response);

    // Extract stats from response structure
    let stats = {
      totalAuctions: 0,
      activeAuctions: 0,
      totalRevenue: 0,
      averageSalePrice: 0,
      successRate: 0
    };

    if (response?.data && typeof response.data === 'object') {
      stats = response.data;
    } else if (response?.data?.data && typeof response.data.data === 'object') {
      stats = response.data.data;
    }

    console.log('Extracted seller stats:', stats);
    return stats;
  } catch (error) {
    console.error("Failed to fetch seller stats:", error);
    throw error;
  }
};

export const updateAuction = async (auctionId, auctionData) => {
  try {
    const response = await api.patch(`/api/auctions/${auctionId}`, auctionData);
    return response.data;
  } catch (error) {
    console.error("Failed to update auction:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/users/me/profile', profileData);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

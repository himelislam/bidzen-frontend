import api from "./axiosInstance";

export const submitFeedback = async (auctionId, feedbackData) => {
  try {
    const response = await api.post(`/api/auctions/${auctionId}/feedback`, feedbackData);
    return response;
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    throw error;
  }
};

export const getFeedback = async (auctionId) => {
  try {
    const response = await api.get(`/api/auctions/${auctionId}/feedback`);
    return response;
  } catch (error) {
    console.error("Failed to get feedback:", error);
    throw error;
  }
};

export const getMyReceivedFeedback = async () => {
  try {
    const response = await api.get('/api/auctions/my/received');
    return response;
  } catch (error) {
    console.error("Failed to get received feedback:", error);
    throw error;
  }
};

export const getMyGivenFeedback = async () => {
  try {
    const response = await api.get('/api/auctions/my/given');
    return response;
  } catch (error) {
    console.error("Failed to get given feedback:", error);
    throw error;
  }
};

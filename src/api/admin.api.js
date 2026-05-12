import api from "./axiosInstance";

// Get all users
export const getAllUsers = async () => {
  const response = await api.get("/api/admin/users");
  return response.data;
};

// Deactivate user
export const deactivateUser = async (userId) => {
  const response = await api.patch(`/api/admin/users/${userId}/deactivate`);
  return response.data;
};

// Activate user
export const activateUser = async (userId) => {
  const response = await api.patch(`/api/admin/users/${userId}/activate`);
  return response.data;
};

// Get flagged auctions
export const getFlaggedAuctions = async (params = {}) => {
  const response = await api.get("/api/admin/auctions/flagged", { params });
  return response.data;
};

// Resolve flagged auction
export const resolveFlaggedAuction = async (auctionId) => {
  const response = await api.put(`/api/admin/auctions/${auctionId}/resolve`);
  return response.data;
};

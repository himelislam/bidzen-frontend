import api from "./axiosInstance";

export const getBids = (auctionId) => api.get(`/api/auctions/${auctionId}/bids`);
export const placeBid = (auctionId, amount) => api.post(`/api/auctions/${auctionId}/bids`, { amount });

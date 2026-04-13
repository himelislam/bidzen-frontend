import api from "./axiosInstance";

export const getBids = (auctionId) => api.get(`/api/auctions/${auctionId}/bids`);

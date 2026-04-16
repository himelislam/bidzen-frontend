import api from "./axiosInstance";

export const getAuctions = () => api.get("/api/auctions");
export const getAuctionById = (id) => api.get(`/api/auctions/${id}`);

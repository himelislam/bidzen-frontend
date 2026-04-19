import api from "./axiosInstance";

// Mock bids data for development
const mockBids = {};

export const getBids = async (auctionId) => {
    try {
        const response = await api.get(`/api/auctions/${auctionId}/bids`);
        return response;
    } catch (error) {
        // Fallback to mock data if API fails
        console.warn("API failed, using mock data:", error);
        return { data: mockBids[auctionId] || [] };
    }
};

export const placeBid = async (auctionId, amount) => {
    try {
        const response = await api.post(`/api/auctions/${auctionId}/bids`, { amount });
        return response;
    } catch (error) {
        // Fallback to mock data if API fails
        console.warn("API failed, using mock response:", error);
        return { data: { success: true, bid: { _id: Date.now(), amount, auctionId, createdAt: new Date().toISOString() } } };
    }
};

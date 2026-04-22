import api from "./axiosInstance";
import { mockAuctions } from "./mockData";

export const getAuctions = async () => {
    try {
        // Try real API first
        const response = await api.get("/api/auctions");
        return response;
    } catch (error) {
        // Fallback to mock data if API fails
        console.warn("API failed, using mock data:", error);
        return {
            data: mockAuctions,
            pagination: {
                page: 1,
                limit: 20,
                total: mockAuctions.length,
                pages: 1
            }
        };
    }
};

export const getAuctionById = async (id) => {
    try {
        const response = await api.get(`/api/auctions/${id}`);
        return response.data;
    } catch (error) {
        // Fallback to mock data if API fails
        console.warn("API failed, using mock data:", error);
        const mockAuction = mockAuctions.find(a => a._id === id);
        return { data: mockAuction || null };
    }
};

export const createAuction = async (auctionData) => {
    try {
        // Handle FormData for image uploads
        const config = auctionData instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};

        const response = await api.post("/api/auctions", auctionData, config);
        return response;
    } catch (error) {
        console.warn("API failed, using mock response:", error);
        // Fallback to mock response if API fails
        const newAuction = {
            ...auctionData,
            _id: Date.now().toString(),
            status: "scheduled",
            currentHighestBid: 0,
            winner: null,
            flaggedForReview: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return {
            data: {
                success: true,
                data: { auction: newAuction },
                message: "Auction created successfully (mock)"
            }
        };
    }
};

export const updateAuction = async (auctionId, auctionData) => {
    try {
        const response = await api.patch(`/api/auctions/${auctionId}`, auctionData);
        return response;
    } catch (error) {
        console.error("Failed to update auction:", error);
        throw error;
        return {
            data: {
                success: true,
                data: { auction: updatedAuction },
                message: "Auction updated successfully (mock)"
            }
        };
    }
};

export const getAuctionFeedback = async (auctionId) => {
    try {
        const response = await api.get(`/api/auctions/${auctionId}/feedback`);
        return response;
    } catch (error) {
        console.error("Failed to get auction feedback:", error);
        throw error;
    }
};

// Add new function to update auction images
export const updateAuctionImages = async (id, formData) => {
    try {
        const response = await api.patch(`/api/auctions/${id}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update auction images:", error);
        throw error;
    }
};

// Add function to delete auction image
export const deleteAuctionImage = async (id, imageIndex) => {
    try {
        const response = await api.delete(`/api/auctions/${id}/images/${imageIndex}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete auction image:", error);
        throw error;
    }
};


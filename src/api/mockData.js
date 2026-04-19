// Mock auction data for development
export const mockAuctions = [
  {
    _id: "1",
    title: "Vintage Camera Collection",
    description: "Professional vintage camera set from the 1970s in excellent condition. Includes camera body, lenses, and original case.",
    category: "Electronics",
    startingPrice: 15000,
    currentHighestBid: 18500,
    status: "active",
    seller: {
      _id: "seller1",
      name: "John Smith",
      email: "john@example.com"
    },
    bidCount: 12,
    endTime: "2024-04-20T18:00:00Z",
    createdAt: "2024-04-10T10:00:00Z",
    flaggedReason: null,
    winner: null
  },
  {
    _id: "2",
    title: "Designer Watch Collection",
    description: "Luxury watch collection featuring multiple timepieces from renowned brands.",
    category: "Fashion & Accessories",
    startingPrice: 25000,
    currentHighestBid: 32000,
    status: "active",
    seller: {
      _id: "seller2",
      name: "Jane Doe",
      email: "jane@example.com"
    },
    bidCount: 8,
    endTime: "2024-04-18T16:00:00Z",
    createdAt: "2024-04-08T14:00:00Z",
    flaggedReason: null,
    winner: null
  },
  {
    _id: "3",
    title: "Antique Furniture Set",
    description: "Beautiful antique dining table set with 6 chairs from Victorian era.",
    category: "Home & Garden",
    startingPrice: 45000,
    currentHighestBid: 45000,
    status: "closed",
    seller: {
      _id: "seller3",
      name: "Bob Wilson",
      email: "bob@example.com"
    },
    bidCount: 15,
    endTime: "2024-04-15T20:00:00Z",
    createdAt: "2024-04-05T09:00:00Z",
    flaggedReason: null,
    winner: {
      _id: "buyer1",
      name: "Alice Johnson",
      email: "alice@example.com"
    }
  },
  {
    _id: "4",
    title: "Gaming Console Bundle",
    description: "Latest gaming console with games and accessories.",
    category: "Electronics",
    startingPrice: 30000,
    currentHighestBid: 28000,
    status: "scheduled",
    seller: {
      _id: "seller4",
      name: "Mike Brown",
      email: "mike@example.com"
    },
    bidCount: 0,
    endTime: "2024-04-25T19:00:00Z",
    createdAt: "2024-04-12T11:00:00Z",
    flaggedReason: null,
    winner: null
  },
  {
    _id: "5",
    title: "Rare Book Collection",
    description: "First edition books from various authors, all in good condition.",
    category: "Books & Media",
    startingPrice: 8000,
    currentHighestBid: 12000,
    status: "flagged",
    seller: {
      _id: "seller5",
      name: "Sarah Davis",
      email: "sarah@example.com"
    },
    bidCount: 6,
    endTime: "2024-04-22T17:00:00Z",
    createdAt: "2024-04-09T16:00:00Z",
    flaggedReason: "Suspicious bidding patterns detected",
    winner: null
  }
];

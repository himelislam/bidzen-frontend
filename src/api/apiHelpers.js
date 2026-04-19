// Helper functions to handle API response data extraction consistently

export const extractAuctionsData = (response) => {
  // Handle API response structure according to documentation
  // Expected structure: { success: true, data: { auctions: [...], pagination: {...} } }

  console.log("=== Extracting Auctions Data ===");
  console.log("Full API Response:", response);
  console.log("Response.data:", response?.data);

  let auctionsData = [];

  if (response?.data?.auctions && Array.isArray(response.data.auctions)) {
    auctionsData = response.data.auctions;
  } else if (response?.data?.data?.auctions && Array.isArray(response.data.data.auctions)) {
    auctionsData = response.data.data.auctions;
  } else if (Array.isArray(response?.data)) {
    auctionsData = response.data;
  } else if (response?.data?.data && Array.isArray(response.data.data)) {
    auctionsData = response.data.data;
  } else {
    console.warn("Could not find auctions array in response, using empty array");
  }

  console.log("Extracted auctions data:", auctionsData);
  console.log("Is array:", Array.isArray(auctionsData));
  console.log("Length:", auctionsData.length);

  return auctionsData;
};

export const extractAuctionData = (response) => {
  // Handle single auction API response structure
  // Expected structure: { success: true, data: { auction: {...} } }

  console.log("=== Extracting Single Auction Data ===");
  console.log("Full API Response:", response);
  console.log("Response.data:", response?.data);

  let auctionData = null;

  if (response?.data?.auction && typeof response.data.auction === 'object') {
    // Auction data is nested under response.data.auction
    auctionData = response.data.auction;
  } else if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    // Check if the auction data is directly in response.data
    if (response.data._id || response.data.title) {
      auctionData = response.data;
    } else if (response.data.data && typeof response.data.data === 'object') {
      auctionData = response.data.data;
    }
  }

  console.log("Extracted auction data:", auctionData);
  console.log("Has _id:", auctionData?._id);
  console.log("Has title:", auctionData?.title);
  console.log("Has startingPrice:", auctionData?.startingPrice);

  return auctionData;
};

export const extractBidsData = (response) => {
  // Handle bids API response structure
  // Expected structure: { success: true, data: { bids: [...], pagination: {...} } }

  console.log("=== Extracting Bids Data ===");
  console.log("Full API Response:", response);
  console.log("Response.data:", response?.data);

  let bidsData = [];

  if (response?.data?.bids && Array.isArray(response.data.bids)) {
    bidsData = response.data.bids;
  } else if (response?.data?.data?.bids && Array.isArray(response.data.data.bids)) {
    bidsData = response.data.data.bids;
  } else if (Array.isArray(response?.data)) {
    bidsData = response.data;
  } else if (response?.data?.data && Array.isArray(response.data.data)) {
    bidsData = response.data.data;
  } else {
    console.warn("Could not find bids array in response, using empty array");
  }

  console.log("Extracted bids data:", bidsData);
  console.log("Is array:", Array.isArray(bidsData));
  console.log("Length:", bidsData.length);

  return bidsData;
};

export const extractFeedbacksData = (response) => {
  // Handle feedback API response structure
  // Expected structure: { success: true, data: { feedbacks: [...], stats: {...}, auction: {...} } }

  console.log("=== Extracting Feedbacks Data ===");
  console.log("Full API Response:", response);
  console.log("Response.data:", response?.data);

  let feedbacksData = [];

  if (response?.data?.feedbacks && Array.isArray(response.data.feedbacks)) {
    feedbacksData = response.data.feedbacks;
  } else if (response?.data?.data?.feedbacks && Array.isArray(response.data.data.feedbacks)) {
    feedbacksData = response.data.data.feedbacks;
  } else if (Array.isArray(response?.data)) {
    feedbacksData = response.data;
  } else if (response?.data?.data && Array.isArray(response.data.data)) {
    feedbacksData = response.data.data;
  } else {
    console.warn("Could not find feedbacks array in response, using empty array");
  }

  console.log("Extracted feedbacks data:", feedbacksData);
  console.log("Is array:", Array.isArray(feedbacksData));
  console.log("Length:", feedbacksData.length);

  return feedbacksData;
};

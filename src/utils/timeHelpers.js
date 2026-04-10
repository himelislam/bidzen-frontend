export const isClosingSoon = (endTime) => {
  const diff = new Date(endTime) - new Date();
  return diff > 0 && diff < 3600000; // Less than 1 hour remaining
};

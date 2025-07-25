export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateHours = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 100) / 100;
};

export const getWorkingStatus = (checkInTime: string) => {
  const checkIn = new Date(checkInTime);
  const standardStart = new Date(checkIn);
  standardStart.setHours(9, 0, 0, 0); // 9:00 AM
  
  if (checkIn > standardStart) {
    return 'late';
  }
  return 'on-time';
};
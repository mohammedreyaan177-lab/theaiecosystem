import { useState, useEffect } from 'react';

/**
 * Returns the dynamic greeting based strictly on Indian Standard Time (IST / Asia/Kolkata).
 * 
 * Rules:
 * 05:00 – 11:59 IST -> Good Morning
 * 12:00 – 16:59 IST -> Good Afternoon
 * 17:00 – 04:59 IST -> Good Evening
 */
export function getISTGreeting(referenceDate: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hour12: false
  });
  
  const hourStr = formatter.format(referenceDate);
  const hour = parseInt(hourStr, 10) % 24;

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

/**
 * React hook that returns the current IST greeting and updates automatically
 * when time boundaries are crossed (checking every 30 seconds).
 */
export function useISTGreeting(): string {
  const [greeting, setGreeting] = useState(() => getISTGreeting());

  useEffect(() => {
    const checkGreeting = () => {
      const current = getISTGreeting();
      setGreeting(prev => prev !== current ? current : prev);
    };

    const intervalId = setInterval(checkGreeting, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  return greeting;
}

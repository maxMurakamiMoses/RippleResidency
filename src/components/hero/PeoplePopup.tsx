// PeoplePopup.tsx

import { useState, useEffect, useRef } from 'react';
import { Roboto_Mono } from 'next/font/google';
import { FaUserCircle } from 'react-icons/fa';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
});

// Define TypeScript interfaces based on API response
interface Politician {
  id: string; // Assuming each politician has a unique ID
  name: string;
  age: number;
  sex: string;
  party: string;
}

interface ElectionData {
  success: boolean;
  data: {
    electionInfo: any; // Replace with actual type if available
    parties: any[]; // Replace with actual type if available
    politicians: Politician[];
    candidates: any[]; // Replace with actual type if available
  };
}

interface Popup extends Politician {
  top: number;
  left: number;
  isFadingOut: boolean;
}

let popupId = 0; // Unique identifier for each popup

export function PeoplePopup() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialPopup = useRef(false);
  const initialPopupTimeout = useRef<number | null>(null);
  const popupInterval = useRef<number | null>(null);
  const currentPopupIndex = useRef(0);

  useEffect(() => {
    async function fetchElectionData() {
      try {
        const response = await fetch('/api/fetchElectionData');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result: ElectionData = await response.json();
        if (result.success) {
          // Extract politicians from the fetched data
          setPoliticians(result.data.politicians);
        } else {
          throw new Error('Failed to fetch election data.');
        }
      } catch (err: any) {
        console.error('Error fetching election data:', err);
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchElectionData();
  }, []);

  useEffect(() => {
    if (loading || error || politicians.length === 0) {
      return;
    }

    const scheduleInitialPopup = () => {
      if (!hasInitialPopup.current) {
        initialPopupTimeout.current = window.setTimeout(() => {
          addPopup();
          hasInitialPopup.current = true;
        }, 500); // 0.5-second delay
      }
    };

    scheduleInitialPopup();

    popupInterval.current = window.setInterval(() => {
      addPopup();
    }, 5000); // Generate a popup every 5 seconds

    return () => {
      if (initialPopupTimeout.current !== null) {
        clearTimeout(initialPopupTimeout.current);
      }
      if (popupInterval.current !== null) {
        clearInterval(popupInterval.current);
      }
    };
  }, [loading, error, politicians]);

  const addPopup = () => {
    if (currentPopupIndex.current >= politicians.length) {
      currentPopupIndex.current = 0; // Reset to start if we've shown all popups
    }

    const politician = politicians[currentPopupIndex.current];
    currentPopupIndex.current++;

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const popupWidth = 250; // Increased width to accommodate text
    const popupHeight = 200; // Adjusted height for the new layout

    const top = Math.random() * (containerRect.height - popupHeight);
    const left = Math.random() * (containerRect.width - popupWidth);

    const newPopup: Popup = {
      ...politician,
      top,
      left,
      isFadingOut: false,
    };

    setPopups((prevPopups) => [...prevPopups, newPopup]);

    setTimeout(() => {
      setPopups((prevPopups) =>
        prevPopups.map((popup) =>
          popup.id === newPopup.id ? { ...popup, isFadingOut: true } : popup
        )
      );

      setTimeout(() => {
        setPopups((prevPopups) =>
          prevPopups.filter((popup) => popup.id !== newPopup.id)
        );
      }, 500); // Duration of fade-out animation (0.5s)
    }, 5000);
  };

  if (loading) {
    return (
      <div className={`${robotoMono.className} relative w-full h-full`}>
        <p className="text-center text-gray-300">Loading popups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${robotoMono.className} relative w-full h-full`}>
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${robotoMono.className} absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none`}
    >
      {popups.map((popup) => (
        <div
          key={popup.id}
          className={`absolute border border-[#2A9D8F] rounded-xl flex flex-col p-4 shadow-lg pointer-events-auto transition-colors duration-300 ${
            popup.isFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'
          } 
          bg-gray-800 dark:bg-opacity-90`}
          style={{
            top: popup.top,
            left: popup.left,
            width: '230px',
            zIndex: 20, 
          }}
        >
          {/* First Row: Optional Generic Icon */}
          <div className="flex flex-row items-center mb-2">
            {/* Uncomment the following block to display the generic user icon */}
            {/*
            <div className="relative w-16 h-16 text-gray-400 mr-4">
              <FaUserCircle size={64} />
            </div>
            */}
            {/* Text Container */}
            <div className="flex flex-col">
              {/* Name */}
              <span className="text-lg font-semibold text-gray-200">
                {popup.name}
              </span>

              {/* Age and Sex */}
              <span className="text-sm font-medium text-gray-400">
                {popup.sex}, {popup.age} yrs
              </span>

              {/* Party */}
              <span className="text-sm font-medium text-gray-400">
                {popup.party}
              </span>
            </div>
          </div>

          {/* Optional: Additional Information or Actions */}
          {/* You can add more rows or details here if needed */}
        </div>
      ))}

      {/* Tailwind CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.8);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

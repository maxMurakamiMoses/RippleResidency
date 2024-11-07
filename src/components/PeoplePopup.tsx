import { useState, useEffect, useRef } from 'react';
import { Roboto_Mono } from 'next/font/google';
import { FaUserCircle } from 'react-icons/fa'; // Importing a generic user icon

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
});

interface PopupData {
  name: string;
  age: number;
  sex: string;
  // Remove profilePic since we're using a generic icon
}

interface Popup extends PopupData {
  id: number;
  top: number;
  left: number;
  isFadingOut: boolean;
}

const popupData: PopupData[] = [
  {
    name: 'Alisa Vitti',
    age: 35,
    sex: 'Female',
  },
  {
    name: 'Bryan Johnson',
    age: 40,
    sex: 'Male',
  },
  {
    name: 'Casey Means',
    age: 28,
    sex: 'Female',
  },
  {
    name: 'David Sinclair',
    age: 45,
    sex: 'Male',
  },
  {
    name: 'Peter Attia',
    age: 50,
    sex: 'Male',
  },
  {
    name: 'Rhonda Patrick',
    age: 38,
    sex: 'Female',
  },
  {
    name: 'Rich Roll',
    age: 43,
    sex: 'Male',
  },
  {
    name: 'Tim Ferriss',
    age: 48,
    sex: 'Male',
  },
  {
    name: 'Wim Hof',
    age: 41,
    sex: 'Male',
  },
  // Add more entries as needed
];

let popupId = 0; // Unique identifier for each popup

export function PeoplePopup() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialPopup = useRef(false);
  const initialPopupTimeout = useRef<number | null>(null);
  const popupInterval = useRef<number | null>(null);
  const currentPopupIndex = useRef(0);

  useEffect(() => {
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
  }, []);

  const addPopup = () => {
    const container = containerRef.current;
    if (!container) return;

    if (currentPopupIndex.current >= popupData.length) {
      currentPopupIndex.current = 0; // Reset to start if we've shown all popups
    }

    const popupInfo = popupData[currentPopupIndex.current];
    currentPopupIndex.current++;

    const containerRect = container.getBoundingClientRect();

    const popupWidth = 250; // Increased width to accommodate text
    const popupHeight = 180; // Adjusted height for the new layout

    const top = Math.random() * (containerRect.height - popupHeight);
    const left = Math.random() * (containerRect.width - popupWidth);

    const newPopup: Popup = {
      id: popupId++,
      top,
      left,
      name: popupInfo.name,
      age: popupInfo.age,
      sex: popupInfo.sex,
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

  return (
    <div
      ref={containerRef}
      className={`${robotoMono.className} absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none`}
    >
      {popups.map((popup) => (
        <div
          key={popup.id}
          className={`absolute bg-white bg-opacity-90 border border-[#2A9D8F] rounded-xl flex flex-col p-4 shadow-lg pointer-events-auto ${
            popup.isFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
          style={{
            top: popup.top,
            left: popup.left,
            width: '230px', // Increased width to accommodate content
            zIndex: 40, // High z-index to ensure visibility
          }}
        >
          {/* First Row: Generic Icon, Age, Sex */}
          <div className="flex flex-row items-center">
            {/* Generic Icon */}
            <div className="relative w-16 h-16 text-gray-400 mr-4">
              <FaUserCircle size={64} />
            </div>

            {/* Text Container */}
            <div className="flex flex-col">
              {/* Name */}
              <span className="text-lg font-semibold text-gray-800">
                {popup.name}
              </span>

              {/* Age and Sex */}
              <span className="text-sm font-medium text-gray-600">
                {popup.sex}, {popup.age} yrs
              </span>
            </div>
          </div>

          {/* Optional: Additional Information or Actions */}
          {/* You can add more rows or details here if needed */}
        </div>
      ))}

      {/* Tailwind CSS Animation */}
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

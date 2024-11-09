// src/components/Podium.tsx

"use client"; // This directive marks the component as a Client Component

import React from 'react';

interface TopCandidate {
  candidateName: string;
  _count: {
    candidateName: number;
  };
}

interface PodiumProps {
  topThree: TopCandidate[];
}

const Podium: React.FC<PodiumProps> = ({ topThree }) => {
  // Define default styling for podium based on rank
  const podiumStyles = {
    1: {
      podiumHeight: 50,
      beamHeight: 120,
      podiumColor: "bg-slate-600",
      beamColorFrom: "from-yellow-500/50",
      beamColorTo: "to-transparent",
      crownColor: "text-yellow-400",
      personColor: "text-yellow-400",
      trapezoidColor: "bg-slate-500",
    },
    2: {
      podiumHeight: 30,
      beamHeight: 120,
      podiumColor: "bg-slate-600",
      beamColorFrom: "from-blue-500/50",
      beamColorTo: "to-transparent",
      crownColor: "text-blue-400",
      personColor: "text-blue-400",
      trapezoidColor: "bg-slate-500",
    },
    3: {
      podiumHeight: 25,
      beamHeight: 120,
      podiumColor: "bg-slate-600",
      beamColorFrom: "from-red-500/50",
      beamColorTo: "to-transparent",
      crownColor: "text-red-400",
      personColor: "text-red-400",
      trapezoidColor: "bg-slate-500",
    },
  };

  // Arrange the podium in [2nd, 1st, 3rd] order
  const arrangedPodium = [
    topThree[1] || null, // 2nd place
    topThree[0] || null, // 1st place
    topThree[2] || null, // 3rd place
  ];

  const podiumWidth = 160;
  const spaceX = 16 * 2;
  const totalWidth = podiumWidth * 3 + spaceX;

  return (
    <div className="flex flex-col items-center p-4">
      {/* Define all animation styles */}
      <style>
        {`
          /* Floating animation for podium characters */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          .float {
            animation: float 3s ease-in-out infinite;
          }

          .podium-item:hover .float {
            animation-play-state: paused;
          }

          /* Reveal and floating animations for top eight */
          @keyframes reveal {
            from {
              clip-path: inset(0 100% 0 0);
              opacity: 0;
            }
            to {
              clip-path: inset(0 0% 0 0);
              opacity: 1;
            }
          }
          @keyframes floating {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
            100% {
              transform: translateY(0);
            }
          }
          /* Initial hidden state for podium-content */
          .podium-content {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          /* Pause the floating animation when the outer div is hovered */
          .podium-row:hover .podium-content {
            animation-play-state: paused;
          }
        `}
      </style>

      <div style={{ width: `${totalWidth}px` }} className="flex flex-col items-center">
        {/* Podium Section */}
        <div className="flex justify-center items-end space-x-4">
          {arrangedPodium.map((candidate, index) => {
            if (!candidate) {
              // Handle cases where there are fewer than 3 candidates
              return (
                <div
                  className="flex flex-col items-center"
                  key={`placeholder-${index}`}
                >
                  <div
                    className={`w-[160px] h-[${podiumStyles[index + 1].podiumHeight}px] ${podiumStyles[index + 1].podiumColor} shadow-md`}
                  ></div>
                </div>
              );
            }

            const rank = index === 1 ? 1 : index === 0 ? 2 : 3; // Adjust rank based on position
            const style = podiumStyles[rank];

            return (
              <div
                className="flex flex-col items-center podium-item group" // Added 'group' class
                key={candidate.candidateName}
              >
                <div
                  className={`relative flex flex-col items-center justify-start bg-gradient-to-t ${style.beamColorFrom} ${style.beamColorTo}`}
                  style={{ height: `${style.beamHeight}px`, width: `${podiumWidth}px` }}
                >
                  {/* Beam Reveal Overlay */}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-full bg-gradient-to-t ${style.beamColorFrom} ${style.beamColorTo} transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-out`}
                  ></div>

                  <div
                    className={`mt-[-30px] mb-2 float relative z-10`} // Ensure content is above the beam overlay
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <span role="img" aria-label="crown" className={`text-3xl ${style.crownColor}`}>
                      👑
                    </span>
                  </div>
                  <div
                    className={`mb-4 float relative z-10`}
                    style={{ animationDelay: `${index * 0.5 + 0.2}s` }}
                  >
                    <span role="img" aria-label="person" className={`text-3xl ${style.personColor}`}>
                      👤
                    </span>
                  </div>
                  <div
                    className={`mb-2 text-gray-100 font-semibold text-center float relative z-10`}
                    style={{ animationDelay: `${index * 0.5 + 0.4}s` }}
                  >
                    {candidate.candidateName}
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 w-full h-[5px] ${style.trapezoidColor}`}
                    style={{
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                    }}
                  ></div>
                </div>
                <div
                  className={`w-[160px] relative ${style.podiumColor} shadow-md`}
                  style={{ height: `${style.podiumHeight}px` }}
                >
                  <div className="flex items-center justify-center h-full relative z-10">
                    <div className="text-white font-bold text-xl">#{rank}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Podium;

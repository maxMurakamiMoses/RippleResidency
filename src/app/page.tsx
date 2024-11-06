"use client";

import { useState } from "react";
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "./actions/verify";

export default function Home() {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  // State to hold the user's name
  const [name, setName] = useState("");

  // State to handle loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle changes in the name input field
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSuccess = (result: ISuccessResult) => {
    // After successful verification, send data to the backend
    handleProof(result);
  };

  const handleProof = async (result: ISuccessResult) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/saveVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateName: name,
          nullifierHash: result.nullifier_hash,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Your vote has been successfully recorded!");
        console.log("Vote saved:", data.vote);
      } else {
        setError(data.detail || "Failed to save your vote.");
        console.error("Error saving vote:", data.detail);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center align-middle h-screen px-4">
        <p className="text-2xl mb-5">World ID Cloud Template</p>
        
        {/* Name Input Field */}
        <div className="mb-4 w-full max-w-sm">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Enter Your Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Name"
          />
        </div>

        {/* IDKit Verification Widget */}
        <IDKitWidget
          action={action}
          app_id={app_id}
          onSuccess={onSuccess}
          verification_level={VerificationLevel.Device} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
        />

        {/* Verification Button */}
        <button
          className="mt-4 border border-black rounded-md px-4 py-2 hover:bg-gray-100"
          onClick={() => setOpen(true)}
          disabled={!name.trim() || loading} // Disable button if name is empty or loading
          title={!name.trim() ? "Please enter your name to verify" : "Verify with World ID"}
        >
          <div className="mx-3 my-1">
            {loading ? "Saving..." : "Verify with World ID"}
          </div>
        </button>

        {/* Success Message */}
        {successMessage && (
          <p className="mt-4 text-green-600">{successMessage}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

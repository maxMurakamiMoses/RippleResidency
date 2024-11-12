// File 2: SubmitButton.tsx

"use client";
import { UserCheck, Loader2 } from "lucide-react";
import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function SubmitButton({ onClick, disabled, loading }: SubmitButtonProps) {
  return (
    <div className="w-full">
      <HoverBorderGradient
        containerClassName="rounded-lg w-full"
        as="button"
        className={`bg-black text-white flex items-center justify-center space-x-2 py-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <UserCheck className="h-5 w-5" />
        )}
        <span>{loading ? "Processing..." : "Verify with World ID"}</span>
      </HoverBorderGradient>
    </div>
  );
}

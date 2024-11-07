"use client";
import { UserCheck, Loader2 } from "lucide-react";
import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function SubmitButton({ onClick, disabled, loading }: any) {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className={`bg-black text-white flex items-center space-x-2 px-[190px] py-2${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
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

"use client";
import { UserCheck } from "lucide-react";
import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function SubmitButton() {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="bg-black text-white flex items-center space-x-2"
      >
        <UserCheck className="h-5 w-5" />
        <span>Verify with World ID</span>
      </HoverBorderGradient>
    </div>
  );
}



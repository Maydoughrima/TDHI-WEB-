import React from "react";
import { LuRefreshCcw } from "react-icons/lu";

export default function GenerateFCTA({onClick}) {
  return (
    <div className="cta-card flex justify-end bg-bg p-2 rounded-md">
      <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-secondary text-bg rounded-lg text-sm shadow-lg">
        <LuRefreshCcw className="text-base" />
        Generate File
      </button>
    </div>
  );
}

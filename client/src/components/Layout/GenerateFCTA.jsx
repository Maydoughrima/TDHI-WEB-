import React from "react";
import { LuRefreshCcw } from "react-icons/lu";
import Button from "../UI/Button";

export default function GenerateFCTA({onClick}) {
  return (
    <div className="cta-card flex justify-end bg-bg p-2 rounded-md">
      <Button 
      onClick={onClick}
      className="bg-secondary">Generate File
      <LuRefreshCcw className="text-base"/>
      </Button>
    </div>
  );
}

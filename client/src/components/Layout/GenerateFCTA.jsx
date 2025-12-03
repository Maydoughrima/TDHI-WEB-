import React from "react";
import { LuRefreshCcw } from "react-icons/lu";
import Button from "../UI/Button";

export default function GenerateFCTA({onClick}) {
  return (
    <div className="cta-card flex justify-end bg-bg p-2 rounded-md">
      <Button onClick={onClick}>
      <LuRefreshCcw className="text-base"/>
      Generate File
      </Button>
    </div>
  );
}

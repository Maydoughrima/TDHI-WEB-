import React from "react";

export default function Button ({children, onClick, type="button", className=""}){
     return(
        <button
        type={type}
        onClick = {onClick}
        className={`flex items-center font-heading gap-2 px-4 py-2 bg-secondary text-bg rounded-lg text-sm shadow-lg ${className}`}
        >
            {children}
        </button>
     );   
}
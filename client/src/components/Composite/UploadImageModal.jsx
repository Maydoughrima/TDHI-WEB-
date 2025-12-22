import React, { useState } from "react";

export default function UploadImageModal({ selectedFile, setSelectedFile }) {
  const [preview, setPreview] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // When user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); // Preview image
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      {/* IMAGE BOX */}
      <div
        className={`w-80 h-80 rounded-md overflow-hidden shadow-md 
          bg-gray-200 flex items-center justify-center relative
          ${isHovering ? "ring-2 ring-primary" : ""}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">No image uploaded</span>
        )}

        {/* UPLOAD BUTTON overlay (visible on hover) */}
        {isHovering && (
          <label
            htmlFor="employee-photo"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 
              bg-secondary text-bg px-3 py-1 rounded text-xs cursor-pointer shadow"
          >
            Upload Image
          </label>
        )}

        {/* HIDDEN FILE INPUT */}
        <input
          id="employee-photo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* FILE NAME */}
      {selectedFile && (
        <p className="text-xs text-gray-600">
          Selected: {selectedFile.name}
        </p>
      )}
    </div>
  );
}

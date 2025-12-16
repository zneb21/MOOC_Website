import React from "react";

interface PresentationOverlayProps {
  open: boolean;
  onClose: () => void;
}

const PresentationOverlay: React.FC<PresentationOverlayProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black font-bold"
        >
          ✕
        </button>
        <h1 className="text-xl font-bold">Presentation Content</h1>
      </div>
    </div>
  );
};

export default PresentationOverlay;

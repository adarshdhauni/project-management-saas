import React from "react";

const GlobalLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />

        <p className="text-xs text-gray-400 tracking-[0.2em] uppercase">
          Loading
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;

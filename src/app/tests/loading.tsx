import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-4 border-t-teal-700 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

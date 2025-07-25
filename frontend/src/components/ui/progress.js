import React from "react";

export const Progress = React.forwardRef(({ value = 0, className = "", ...props }, ref) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`} ref={ref} {...props}>
    <div
      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
));

Progress.displayName = "Progress"; 
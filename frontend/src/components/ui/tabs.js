import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export function Tabs({ defaultValue, className = "", children }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", children }) {
  return <div className={`flex ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, className = "", children }) {
  const { value: activeValue, setValue } = useContext(TabsContext);
  return (
    <button
      className={`px-4 py-2 font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
        activeValue === value
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-600 hover:text-blue-500"
      } ${className}`}
      onClick={() => setValue(value)}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className = "", children }) {
  const { value: activeValue } = useContext(TabsContext);
  if (activeValue !== value) return null;
  return <div className={className}>{children}</div>;
} 
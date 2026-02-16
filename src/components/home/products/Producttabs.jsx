"use client";

import { Apple, Leaf, Nut, Sprout, Carrot } from "lucide-react";

const tabs = [
  { id: "vegetables", label: "Fresh Vegetables", icon: Sprout },
  { id: "fruits", label: "Fruits", icon: Apple },
  { id: "nuts", label: "Nuts", icon: Nut },
  { id: "leafyGreens", label: "Leafy Green", icon: Leaf },
  { id: "roots", label: "Root", icon: Carrot },
];

export default function ProductTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap gap-4 md:gap-8 justify-center mb-12">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all duration-200 ${
              isActive
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-600 hover:text-green-600"
            }`}
          >
            <Icon 
              size={20} 
              className={isActive ? "text-green-700" : "text-gray-600"}
            />
            <span className={`font-semibold text-sm md:text-base ${
              isActive ? "text-green-700" : "text-gray-700"
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
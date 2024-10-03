import React from "react";
import { Button } from "@/components/ui/button";

const tabs = ["All Orders", "Completed", "Pending", "Shipped", "Cancelled"];

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StatusTabs = ({ activeTab, setActiveTab }: StatusTabsProps) => {
  return (
    <div className="flex flex-wrap space-x-2 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "outline"}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default StatusTabs;

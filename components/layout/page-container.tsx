import React from "react";
import { ScrollArea } from "../ui/scroll-area";

interface PageContainerProps {
  scrollable?: boolean; // Change this to boolean to allow true/false
  children: React.ReactNode;
}

const PageContainer = ({
  scrollable = false,
  children,
}: PageContainerProps) => {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="h-full p-4 md:px-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full p-4 md:px-8">{children}</div>
      )}
    </>
  );
};

export default PageContainer;

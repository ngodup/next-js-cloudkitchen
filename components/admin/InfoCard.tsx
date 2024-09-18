import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

interface InfoCardProps {
  title: string;
  content: number | string;
  isCurrency?: boolean;
}
const InfoCard = ({ title, content, isCurrency = false }: InfoCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isCurrency && "€"} {content}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;

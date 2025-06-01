import React from "react";
import { Badge } from "@/components/ui/badge";

interface ReportHeaderProps {
  userId: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ userId }) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
        Safety Report 
      </h1>
      <p className="text-gray-600 text-sm md:text-base mb-4">
        Help make your community safer by reporting location safety
      </p>
      <Badge className="px-4 py-2 text-sm md:text-base">
        <span>
          Reporting as:{" "}
          <span className="font-semibold text-blue-600">{userId}</span>
        </span>
      </Badge>
    </div>
  );
};

export default ReportHeader;

import React from "react";

interface ReportHeaderProps {
  userId?: string; // Optional now
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

      {userId && (
        <span>
          <span className="font-semibold text-blue-600"></span>
        </span>
      )}
    </div>
  );
};

export default ReportHeader;

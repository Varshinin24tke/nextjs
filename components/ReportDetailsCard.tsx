import React from "react";
import {
  Send,
  Loader2,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReportDetailsCardProps {
  description: string;
  rating: number;
  hoverRating: number;
  submitting: boolean;
  submitMessage: string;
  selectedLocation: { lat: number; lng: number } | null;
  onDescriptionChange: (value: string) => void;
  onRatingChange: (rating: number) => void;
  onRatingHover: (rating: number) => void;
  onRatingLeave: () => void;
  onSubmit: () => void;
}

const ReportDetailsCard: React.FC<ReportDetailsCardProps> = ({
  description,
  rating,
  hoverRating,
  submitting,
  submitMessage,
  selectedLocation,
  onDescriptionChange,
  onRatingChange,
  onRatingHover,
  onRatingLeave,
  onSubmit,
}) => {
  const getSafetyInfo = (rating: number) => {
    if (rating <= 3)
      return {
        label: "Unsafe",
        color: "from-red-500 to-red-600",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: AlertTriangle,
        description: "High risk area - exercise extreme caution",
      };
    if (rating <= 6)
      return {
        label: "Neutral",
        color: "from-yellow-500 to-orange-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: Shield,
        description: "Moderate safety - stay alert",
      };
    return {
      label: "Safe",
      color: "from-green-500 to-emerald-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: CheckCircle,
      description: "Generally safe area",
    };
  };

  const getRatingColor = (
    num: number,
    currentRating: number,
    currentHover: number
  ) => {
    const activeRating = currentHover || currentRating;
    const isActive = activeRating >= num;

    if (!isActive) return "bg-gray-200 text-gray-600 hover:bg-gray-300";

    if (activeRating <= 3)
      return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg";
    if (activeRating <= 6)
      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg";
    return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg";
  };

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm">
            <Shield className="h-4 w-4" />
            Report Details
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="animate-fade-in">
          <label className="block text-sm md:text-base font-semibold text-gray-700 mb-3">
            Description
          </label>
          <textarea
            className="w-full h-32 p-4 rounded-xl border-2 border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Describe the issue here..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        {/* Safety Rating */}
        <div className="animate-fade-in">
          <label className="block text-sm md:text-base font-semibold text-gray-700 mb-4">
            Safety Rating
          </label>
          <div className="space-y-4">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onRatingChange(num)}
                  onMouseEnter={() => onRatingHover(num)}
                  onMouseLeave={onRatingLeave}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 ${getRatingColor(
                    num,
                    rating,
                    hoverRating
                  )}`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Unsafe
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Neutral
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Safe
              </span>
            </div>

            {rating > 0 && (
              <div
                className={`p-4 md:p-5 rounded-xl border-2 animate-scale-in ${getSafetyInfo(rating).bgColor} ${getSafetyInfo(rating).borderColor}`}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  {React.createElement(getSafetyInfo(rating).icon, {
                    className: `w-5 h-5 md:w-6 md:h-6 ${getSafetyInfo(rating).textColor}`,
                  })}
                  <span className={`text-sm md:text-base font-bold ${getSafetyInfo(rating).textColor}`}>
                    Rating: {rating}/10 - {getSafetyInfo(rating).label}
                  </span>
                </div>
                <p className={`text-xs md:text-sm text-center ${getSafetyInfo(rating).textColor} opacity-80`}>
                  {getSafetyInfo(rating).description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          disabled={
            submitting || !description || !selectedLocation || rating === 0
          }
          className="w-full h-12 md:h-14 text-sm md:text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:transform-none disabled:opacity-50 rounded-xl"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin mr-2" />
              Submitting Report...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Submit Safety Report
            </>
          )}
        </Button>

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`p-4 rounded-xl border-2 text-center font-medium animate-fade-in ${
              submitMessage.includes("Failed")
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            {submitMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportDetailsCard;

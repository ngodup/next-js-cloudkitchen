import { StarIcon, StarHalf } from "lucide-react";

interface ProductRatingProps {
  rating: number;
}

const generateStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating); // The number of full stars
  const hasHalfStar = rating % 1 >= 0.5; // Whether to include a half star

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon
        size={15}
        key={i}
        className="text-yellow-500 stroke-current fill-current"
      />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <StarHalf
        key={fullStars}
        size={15}
        className="text-yellow-500 stroke-current fill-current"
      />
    );
  }

  // Fill the remaining stars with empty stars (if any)
  for (let i = stars.length; i < 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        size={15}
        className="text-gray-300 stroke-current fill-none"
      />
    );
  }

  return stars;
};

export default function ProductRating({ rating }: ProductRatingProps) {
  return <div className="flex">{generateStars(rating)}</div>;
}

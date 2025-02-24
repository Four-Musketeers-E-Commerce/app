import React from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { averageStarRating } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const StarRating = ({ rating, size = 20, color = "#FFD700" }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((index) => {
        const starFill = Math.min(Math.max(rating - (index - 1), 0), 1);
        
        if (starFill >= 1) {
          return (
            <FontAwesome
              key={index}
              name="star"
              size={size}
              color={color}
              style={{ marginRight: 2 }}
            />
          );
        }
        else if (starFill > 0) {
          return (
            <FontAwesome
              key={index}
              name="star-half-o"
              size={size}
              color={color}
              style={{ marginRight: 2 }}
            />
          );
        }
        return (
          <FontAwesome
            key={index}
            name="star-o"
            size={size}
            color={color}
            style={{ marginRight: 2 }}
          />
        );
      })}
    </View>
  );
};

const AverageRating = ({ weaponId }) => {
  const [rating, setRating] = React.useState(0);
  const { isUpdated } = useGlobalContext();
  
  React.useEffect(() => {
    const fetchRating = async () => {
      if (!weaponId) return;
      
      try {
        const rating = await averageStarRating(weaponId);
        setRating(rating);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };
    fetchRating();
  }, [weaponId, isUpdated]); // Add isUpdated to dependencies
  
  return (
    <View className="flex flex-row items-center px-4">
      <StarRating rating={rating} />
      <Text className="ml-2 text-gray-50">{rating.toFixed(1)}</Text>
    </View>
  );
};

export default AverageRating;
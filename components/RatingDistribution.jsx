import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getRatingDistribution } from '@/lib/appwrite';
import { useGlobalContext } from "@/context/GlobalProvider";

const RatingDistribution = ({ weaponId }) => {
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    totalRatings: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });

  const { isUpdated } = useGlobalContext();

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await getRatingDistribution(weaponId);
        setRatingData({
          averageRating: response.averageRating || 0,
          totalRatings: response.totalRatings || 0,
          distribution: response.distribution || {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          }
        });
      } catch (error) {
        console.error('Error fetching rating data:', error);
      }
    };

    if (weaponId) {
      fetchRatingData();
    }
  }, [weaponId, isUpdated]);

  const getMaxCount = () => Math.max(...Object.values(ratingData.distribution));

  return (
    <View className="p-4 rounded-lg">
      <Text className="text-xl font-bold mb-2">Rating & Reviews</Text>
      
      <View className="flex-row">
        {/* Left side - Average rating */}
        <View className="items-center justify-center mr-6">
          <Text className="text-3xl font-bold text-black">
            {Number(ratingData.averageRating || 0).toFixed(1)}
          </Text>
          <Text className="text-gray-500 text-xs">
            {ratingData.totalRatings} {ratingData.totalRatings === 1 ? 'rating' : 'ratings'}
          </Text>
        </View>

        {/* Right side - Rating bars */}
        <View className="flex-1 justify-center">
          {[5, 4, 3, 2, 1].map(star => (
            <View key={star} className="flex-row items-center mb-1">
              <View className="flex-row items-center mr-2">
                {[...Array(5)].map((_, index) => (
                  <FontAwesome 
                    key={index}
                    name="star"
                    size={10} 
                    color={index < star ? "#FFB800" : "#E0E0E0"} 
                    style={{ marginRight: 1 }}
                  />
                ))}
              </View>
              
              <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: '#4287f5',
                    width: `${(ratingData.distribution[star] / getMaxCount() || 0) * 100}%`
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RatingDistribution;
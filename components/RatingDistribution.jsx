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
    <View className="bg-[#1E1F2E] p-6 rounded-xl border border-gray-800">
      <Text className="text-xl font-semibold mb-6 text-gray-200">Rating Distribution</Text>
      
      <View className="flex-row">
        {/* Left side - Average rating */}
        <View className="items-center mr-8">
          <Text className="text-5xl font-bold text-gray-100">
            {Number(ratingData.averageRating || 0).toFixed(1)}
          </Text>
          <View className="flex-row items-center mt-2">
            <FontAwesome 
              name="star" 
              size={16} 
              color="#FFB800" 
              style={{ marginRight: 4 }}
            />
            <Text className="text-gray-400 text-sm">
              {ratingData.totalRatings} {ratingData.totalRatings === 1 ? 'rating' : 'ratings'}
            </Text>
          </View>
        </View>

        {/* Right side - Rating bars */}
        <View className="flex-1 justify-center">
          {[5, 4, 3, 2, 1].map(star => (
            <View key={star} className="flex-row items-center mb-3">
              <View className="flex-row items-center w-12">
                <Text className="text-sm text-gray-400">{star}</Text>
                <FontAwesome 
                  name="star" 
                  size={12} 
                  color="#FFB800" 
                  style={{ marginLeft: 4 }}
                />
              </View>
              
              <View className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mx-2">
                <View 
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(ratingData.distribution[star] / getMaxCount() || 0) * 100}%`
                  }}
                />
              </View>
              
              <Text className="w-8 text-right text-sm text-gray-400">
                {ratingData.distribution[star]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RatingDistribution;
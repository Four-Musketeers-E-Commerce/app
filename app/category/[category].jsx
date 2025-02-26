// app/category/[category].jsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Alert, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getAllWeapons } from "@/lib/appwrite"; // Giả sử bạn đang sử dụng hàm này để lấy dữ liệu vũ khí
import WeaponCard from "@/components/WeaponCard"; // Giả sử bạn đã có component này để hiển thị vũ khí
import LoadingIndicator from "@/components/LoadingIndicator";
import BackButton from "@/components/BackButton";

const CategoryPage = () => {
  const { category } = useLocalSearchParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const weapons = await getAllWeapons();
        const filteredWeapons = weapons.filter(
          (weapon) =>
            weapon.weapon_type.toLowerCase() === category.toLowerCase()
        );
        setCategoryProducts(filteredWeapons);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load category items");
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchData();
    }
  }, [category]);

  return (
    <View className="bg-primary h-full">
      <LoadingIndicator isLoading={isLoading} />
      <View className="px-4 pt-20">
        <View className="w-full flex-row ">
          <BackButton />
          <Text className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-secondary">
            {category}
          </Text>
        </View>
        <View className="border-b border-gray-300 p-1" />
        <FlatList
          data={categoryProducts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <WeaponCard item={item} />}
          className="pt-4"
        />
      </View>
    </View>
  );
};

export default CategoryPage;

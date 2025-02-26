import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import LoadingIndicator from "@/components/LoadingIndicator";
import { router } from "expo-router";
import { useEffect } from "react";
import { getAllWeapons } from "@/lib/appwrite";
import SearchBar from "@/components/SearchBar";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCategories = async () => {
    try {
      const weapons = await getAllWeapons();
      const grouped = weapons.reduce((acc, weapon) => {
        acc[weapon.weapon_type] = acc[weapon.weapon_type] || [];
        acc[weapon.weapon_type].push(weapon);
        return acc;
      }, {});

      setSelectedCategory(Object.keys(grouped));
      setCategoryProducts(grouped);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load categories!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  });

  const categories = [
    {
      name: "Thrillers & Suspense",
      image: "/Users/macos/Desktop/mobile/assets/images/detective.png",
    },
    {
      name: "Action & Adventure",
      image: "/Users/macos/Desktop/mobile/assets/images/horse.png",
    },
    {
      name: "Family & Lifestyle",
      image: "/Users/macos/Desktop/mobile/assets/images/healthy-lifestyle.png",
    },
    {
      name: "Science Fiction & Fantasy",
      image: "/Users/macos/Desktop/mobile/assets/images/fantasy.png",
    },
    {
      name: "Children's Books",
      image: "/Users/macos/Desktop/mobile/assets/images/book.png",
    },
    {
      name: "Crafts, Hobbies & Home",
      image: "/Users/macos/Desktop/mobile/assets/images/tools.png",
    },
    {
      name: "Business & Economics",
      image: "/Users/macos/Desktop/mobile/assets/images/business.png",
    },
    {
      name: "Literature & Fiction",
      image: "/Users/macos/Desktop/mobile/assets/images/poetry.png",
    },
    {
      name: "Biographies & Memoirs",
      image: "/Users/macos/Desktop/mobile/assets/images/journal.png",
    },
    {
      name: "Cookbooks, Food & Wine",
      image: "/Users/macos/Desktop/mobile/assets/images/book-2.png",
    },
  ];

  return (
    <View className="bg-primary h-full">
      <LoadingIndicator isLoading={isLoading || isSubmitting} />
      <View className="absolute w-full bg-primary">
        <View className="bg-primary w-full gap-4 px-4">
          <View className="flex-row items-center justify-between bg-primary  mt-20 pb-4">
            <View className="absolute left-1/2 -translate-x-1/2">
              <Text className="text-secondary text-2xl font-bold">
                ALL CATEGORIES
              </Text>
            </View>
          </View>
          <SearchBar />
        </View>
      </View>

      <ScrollView>
        <View className="px-4 pt-44 items-center mb-8 mt-4">
          <Text className="text-2xl font-bold text-gray-500 tracking-wide">
            Browse books by category
          </Text>
          <Text className="text-2xl text-gray-500 mt-1 leading-relaxed">
            Explore your favorite one!
          </Text>
        </View>
        <FlatList
          data={categories}
          numColumns={3}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => router.push(`/category/${item.name}`)}
              className="w-1/3 p-2 items-center"
            >
              <View className="w-20 h-20 bg-secondary rounded-full overflow-hidden items-center justify-center">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-gray-500 mt-2 text-center text-sm">
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default Category;

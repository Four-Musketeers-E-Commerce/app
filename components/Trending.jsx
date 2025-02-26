import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1.05 },
};

const zoomOut = {
  0: { scale: 1.05 },
  1: { scale: 0.9 },
};

const TrendingItem = ({ activeItem, item }) => {
  const handleViewAgain = async (weaponId) => {
    try {
      router.push(`item/${weaponId}`);
      await saveViewHistory(weaponId, 1);
    } catch (error) {
      Alert.alert("Error", "There was an error saving your view history");
    }
  };
  return (
    <Animatable.View
      className="w-[150px] h-[250px] rounded-xl items-center  bg-primary-100 pb-12 px-4 gap-4"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <TouchableOpacity
        className="w-[150px] h-[250px] rounded-xl items-center  bg-primary-100 pb-12 px-4 gap-1 "
        activeOpacity={0.7}
        onPress={() => handleViewAgain(item.weapons.$id)}
      >
        <Image
          source={{ uri: item.weapons.photo_url }}
          className=" w-[90%] h-[90%] rounded-xl "
          resizeMode="contain"
        />
        <Text
          className="absolute bottom-0 text-md text-gray-500 font-psemibold pb-8 text-center item-center"
          numberOfLines={2}
        >
          {item.weapons.weapon_name}
        </Text>
        <Text className="absolute bottom-0 text-sm text-gray-700 font-psemibold pb-2">
          A$ {item.weapons.price}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const Trending = ({ items }) => {
  const [activeItem, setActiveItem] = useState(items[0]);
  const viewableItemsChange = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChange}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      horizontal
      ListEmptyComponent={() => <Text>Empty</Text>}
      ListFooterComponent={() => <View className="w-48" />}
    />
  );
};

export default Trending;

import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  getCurrentUser,
  getViewHistory,
  saveViewHistory,
} from "@/lib/appwrite";
import { router } from "expo-router";

const ViewedItems = ({ activeItem, item }) => {
  const handleViewAgain = async (weaponId) => {
    try {
      router.push(`item/${weaponId}`);
      await saveViewHistory(weaponId, 1);
    } catch (error) {
      Alert.alert("Error", "There was an error saving your view history");
    }
  };

  return (
    <Animatable.View className="mr-5" duration={500}>
      <TouchableOpacity
        className="w-[150px] h-[150px] rounded-xl justify-center items-center"
        activeOpacity={0.7}
        onPress={() => handleViewAgain(item.weapons.$id)}
      >
        <Image
          source={{ uri: item.weapons.photo_url }}
          className="w-[90%] h-[90%] rounded-xl"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </Animatable.View>
  );
};

const ViewHistory = () => {
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewHistory = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          const history = await getViewHistory(user.$id);
          setItems(history);
        }
      } catch (error) {
        Alert.alert("Error", "There was an error fetching your view history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewHistory();
  }, []);

  const viewableItemsChange = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <View className="p-4">
      <Text className="w-full text-start text-xl text-gray-300 font-psemibold mb-2 mt-2">
        Recently Viewed
      </Text>

      {isLoading ? (
        <Text className="text-gray-400">Loading...</Text>
      ) : items.length === 0 ? (
        <Text className="text-gray-400">No view history</Text>
      ) : (
        <FlatList
          data={items.slice(1)}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <ViewedItems activeItem={activeItem} item={item} />
          )}
          onViewableItemsChanged={viewableItemsChange}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          horizontal
          ListEmptyComponent={() => (
            <Text className="text-gray-400">No views recorded</Text>
          )}
          ListFooterComponent={() => <View className="w-48" />}
        />
      )}
    </View>
  );
};

export default ViewHistory;

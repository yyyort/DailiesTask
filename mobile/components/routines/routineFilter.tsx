import { RoutineReturnType } from "@/model/routine.model";
import React, { useRef, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/lib/constants/Colors";

export default function RoutineFilter({
  routine,
}: {
  routine: RoutineReturnType[];
}) {
  const flatListRef = useRef<FlatList>(null);
  const [scrolling, setScrolling] = useState<NodeJS.Timeout | null>(null);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const step = 100; // Width of each item

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentOffset(event.nativeEvent.contentOffset.x);
  };

  const startScrolling = (direction: "left" | "right") => {
    setScrolling(
      setInterval(() => {
        if (flatListRef.current) {
          // Use the `scrollToOffset` method to adjust the current offset
          //console.log("scrolling" + direction + "..." + currentOffset);
          if (direction === "left") {
            flatListRef.current.scrollToOffset({
              offset: currentOffset - step,
            });
          } else if (direction === "right") {
            flatListRef.current.scrollToOffset({
              offset: currentOffset + step,
            });
          }
        }
      }, 16) // Approximately 60 FPS
    );
  };

  // Function to stop scrolling
  const stopScrolling = () => {
    if (scrolling) {
      clearInterval(scrolling);
      setScrolling(null);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <TouchableOpacity
        onPressIn={() => {
          startScrolling("left");
        }}
        onPressOut={stopScrolling}
      >
        <Entypo name="chevron-small-left" size={24} color="black" />
      </TouchableOpacity>

      <View
        style={{
          height: 36,
          marginRight: -10,
        }}
      >
        <Filter id={"all"} title={"all"} enabled={true} onPress={() => {}} />
      </View>
      {/* other tasks */}
      <FlatList
        ref={flatListRef}
        horizontal
        style={{
          padding: 5,
        }}
        data={routine}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          return (
            <Filter
              id={item.id}
              title={item.title}
              enabled={false}
              onPress={() => {}}
            />
          );
        }}
      />

      <TouchableOpacity
        onPressIn={() => {
          startScrolling("right");
        }}
        onPressOut={stopScrolling}
      >
        <Entypo name="chevron-small-right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export function Filter({
  id,
  title,
  enabled,
  onPress,
}: {
  id: string;
  title: string;
  enabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
        backgroundColor: enabled ? Colors.slate[300] : "white",
        marginHorizontal: 5,
      }}
    >
      <ThemedText
        style={{
          textAlign: "center",
        }}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

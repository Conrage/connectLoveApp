import { View, Image, Text } from "react-native";

export default function Post({ post }) {
  return (
    <View className="p-4 flex flex-col w-full border gap-2 border-b-0">
      <View className="flex flex-row gap-2 items-center">
        {post.name == "João" ? (
          <Image
            style={{width: 36, height: 36, borderRadius: 36}}
            className="rounded-full h-9 w-9"
            source={require("../assets/asta.png")}
          ></Image>
        ) : (
          <Image
            className="rounded-full h-9 w-9"
            style={{width: 36, height: 36, borderRadius: 36}}
            source={require("../assets/noelle.png")}
          ></Image>
        )}
        <View className="flex flex-col gap-0">
          <Text className="font-bold font-plus text-gray-800">{post.name}</Text>
          <Text className="font-normal text-sm font-plus text-gray-400">
            {post.arroba}
          </Text>
        </View>
        <Text className="ml-auto mb-auto font-normal text-sm font-plus text-gray-400">
          {new Date(post.createdAt).toLocaleString([], {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text className="text-gray-900 font-plus font-regular">
        {post.message}
      </Text>
    </View>
  );
}

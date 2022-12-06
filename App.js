import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { db, app } from "./utils/firebase";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";

const StyledPressable = styled(Pressable);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function subscribeMessages(setMessages, expoPushToken) {
  console.log("Subscribing...");
  const messagesCollection = collection(db, "messages");
  const q = query(messagesCollection);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    console.log("Fetching update...");
    const mensagens = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      mensagens.push({ ...data, id: doc.id });
    });
    mensagens.sort(function (x, y) {
      return y.createdAt - x.createdAt;
    });
    setMessages(mensagens);
    schedulePushNotification();
  });
  return () => {
    console.log("Unsubscring...");
    unsubscribe();
  };
}

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    return subscribeMessages(setMessages, expoPushToken);
  }, []);

  const [loaded] = useFonts({
    PlusJakartaSans: require("./assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  const addMessage = async () => {
    if (!input) return;
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        name: user.name,
        arroba: user.arroba,
        message: input,
        createdAt: Date.now(),
      });
      setInput("");
    } catch (error) {
      console.error(error);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <View>
      <View className="w-full p-4 mt-6 border-b border-gray-200">
        <Text className="text-gray-900 font-semibold font-plus text-lg">
          Connect{" "}
          <Text className="font-regular font-plus text-lg text-red-500">
            Love
          </Text>
        </Text>
      </View>
      {user.name ? (
        <View className="flex justify-center w-full p-4">
          <View className="w-full flex flex-col">
            <TextInput
              multiline
              numberOfLines={4}
              className="text-left w-full font-plus px-4 py-3 border-2 transition rounded-md bg-gray-100 border-gray-100 outline-none focus:border-red-500 focus:bg-white"
              onChangeText={(text) => setInput(text)}
              value={input}
              placeholder="Envie uma mensagem de amor"
            />
            <StyledPressable
              onPress={() => addMessage()}
              className="mt-2 bg-red-500 p-2 px-4 flex items-center rounded-md ml-auto transition active:bg-red-600 active:scale-95"
            >
              <Text className="font-semibold font-plus text-white">Enviar</Text>
            </StyledPressable>
            <Text className="font-semibold text-gray-900 font-plus text-xl">
              Posts
            </Text>
            <ScrollView className="flex flex-col overflow-auto h-2/3 mt-4">
              {messages.map((post) => {
                return (
                  <View
                    key={post.id}
                    className="p-2 pb-5 pt-4 flex flex-col w-full border-b border-gray-200"
                  >
                    <View className="flex flex-row mb-2 w-full items-center">
                      {post.name == "João" ? (
                        <Image
                          className="rounded-full mr-2 h-9 w-9"
                          source={require("./assets/asta.png")}
                        ></Image>
                      ) : (
                        <Image
                          className="rounded-full mr-2 h-9 w-9"
                          source={require("./assets/noelle.png")}
                        ></Image>
                      )}
                      <View className="flex flex-col gap-0">
                        <Text className="font-semibold text-sm font-plus text-gray-800">
                          {post.name}
                        </Text>
                        <Text className="font-normal text-sm font-plus text-gray-400">
                          {post.arroba}
                        </Text>
                      </View>
                      <Text className="ml-auto mb-auto font-normal text-xs font-plus text-gray-400">
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
              })}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View className="flex justify-center w-full p-4">
          <View className="flex flex-col gap-4 w-full">
            <StyledPressable
              onPress={() => setUser({ name: "João", arroba: "@joao_o_sol" })}
              className="border-2 border-gray-300 w-full rounded-md flex flex-row justify-between items-center p-4 transition active:bg-red-50 active:border-red-500"
            >
              <Text className="text-gray-700 font-medium font-plus">João</Text>
              <Text className="font-plus text-sm text-gray-400">
                Continuar
              </Text>
            </StyledPressable>
            <StyledPressable
              onPress={() =>
                setUser({ name: "Nicole", arroba: "@nicole_a_lua" })
              }
              className="border-2 border-gray-300 text-gray-700 w-full font-plus rounded-md font-medium flex flex-row justify-between items-center p-4 transition active:bg-red-50 active:border-red-500"
            >
              <Text className="text-gray-700 font-medium">Nicole</Text>
              <Text className="font-plus text-sm text-gray-400">Continuar</Text>
            </StyledPressable>
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Nova mensagem!",
      body: "Seu amor te enviou uma nova mensagem!",
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

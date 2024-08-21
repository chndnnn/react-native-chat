import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Text,
} from "react-native";
import images from "./assets/images/index";
import styles from "./styles/styles";
import MessageContainer from "./components/MessageContainer";
import { format } from "date-fns";

function Chat({
  messages = [],
  setMessages,
  themeColor,
  themeTextColor,
  showSenderAvatar = true,
  showReceiverAvatar = true,
  placeholder = "Write Your Message...",
  inputBorderColor = "gray",
  placeholderColor = "gray",
  inputColor = "black",
  user = {
    _id: 1,
    name: "CodSod",
  },
  backgroundColor = "white",
  inputBackgroundColor = "white",
  backgroundImage,
  senderContainerColor = "#f0ebfb",
  senderMessageColor = "#000000",
  customFooter,
  style,
  showEmoji = false,
  onPressEmoji,
  showAttachment = false,
  onPressAttachment,
  timeContainerColor,
  timeContainerTextColor,
}) {
  const [text, setText] = useState("");
  const flatListRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");
  const [isDateVisible, setIsDateVisible] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      scrollToEnd
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      scrollToEnd
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const messageRenderItem = ({ item }) => {
    const isSender = item.user._id === user._id;
    return (
      <View style={styles.messageWrapper}>
        <MessageContainer
          message={item.text}
          name={item.user.name}
          time={item.createdAt}
          icon={item.user.avatar}
          backgroundColor={isSender ? themeColor : senderContainerColor}
          textColor={isSender ? themeTextColor : senderMessageColor}
          showAvatar={isSender ? showSenderAvatar : showReceiverAvatar}
          isSender={isSender}
        />
      </View>
    );
  };

  const onSendMessage = () => {
    if (text.trim().length === 0) return;
    if (text.trim()) {
      setMessages(text.trim());
      setText("");
    }
  };

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setIsDateVisible(true);
  };

  const handleScrollEnd = () => {
    scrollTimeoutRef.current = setTimeout(() => {
      setIsDateVisible(false);
    }, 1000); // Hide after 1 second
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // Get the first viewable item and its date
      const firstVisibleItem = viewableItems[0].item;
      const formattedDate = format(
        new Date(firstVisibleItem.createdAt),
        "MMM d, yyyy"
      ); // e.g., "Jun 20, 2024"
      setCurrentDate(formattedDate);
    }
  }).current;

  const BackgroundView = backgroundImage ? ImageBackground : View;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <BackgroundView
        style={[styles.container, style, { backgroundColor }]}
        source={
          typeof backgroundImage === "string"
            ? { uri: backgroundImage }
            : backgroundImage
        }
        resizeMode="cover"
      >
        {isDateVisible && currentDate && (
          <View style={styles.currentDateAbsoluteContainer}>
            <View
              style={[
                styles.currentDateContainer,
                {
                  backgroundColor: timeContainerColor
                    ? timeContainerColor
                    : themeColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.currentDateText,
                  {
                    color: timeContainerTextColor
                      ? timeContainerTextColor
                      : themeTextColor,
                  },
                ]}
              >
                {currentDate}
              </Text>
            </View>
          </View>
        )}
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={messageRenderItem}
          contentContainerStyle={styles.contentContainerStyle}
          onContentSizeChange={scrollToEnd}
          keyExtractor={(_, index) => index?.toString()}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd} // This ensures the scroll end is detected even with momentum scrolling.
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50, // Trigger when 50% of the item is visible
          }}
        />
        {customFooter ? (
          customFooter
        ) : (
          <View style={styles.footer}>
            <View
              style={[
                styles.footerContainer,
                {
                  borderColor: inputBorderColor,
                  backgroundColor: inputBackgroundColor,
                },
              ]}
            >
              {showEmoji && (
                <TouchableOpacity
                  style={[styles.imageContainer]}
                  onPress={onPressEmoji}
                  activeOpacity={0.8}
                >
                  <Image
                    source={images.emoji}
                    style={[styles.sendImage, { tintColor: themeColor }]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              <TextInput
                placeholder={placeholder}
                value={text}
                onChangeText={setText}
                style={[styles.inputStyle, { color: inputColor }]}
                blurOnSubmit={false}
                placeholderTextColor={placeholderColor}
                multiline
              />
              {showAttachment && (
                <TouchableOpacity
                  style={[styles.imageContainer]}
                  onPress={onPressAttachment}
                  activeOpacity={0.8}
                >
                  <Image
                    source={images.attach}
                    style={[styles.sendImage, { tintColor: themeColor }]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.sendContainer, { backgroundColor: themeColor }]}
              onPress={onSendMessage}
              activeOpacity={0.9}
            >
              <Image
                source={images.send}
                style={[styles.sendImage, { tintColor: themeTextColor }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </BackgroundView>
    </KeyboardAvoidingView>
  );
}

export default Chat;

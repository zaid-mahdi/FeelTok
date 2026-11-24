// The app's bottom tab bar, from the For You feed mockup: Home, Friend List,
// Create (a pink + button), Mood and Profile.
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// The icons of each tab: the purple one is shown when the tab is open.
const TAB_ICONS = {
  index: {
    normal: require("../../assets/images/tab-home.svg"),
    active: require("../../assets/images/tab-home-active.svg"),
  },
  friends: {
    normal: require("../../assets/images/tab-friends.svg"),
    active: require("../../assets/images/tab-friends-active.svg"),
  },
  mood: {
    normal: require("../../assets/images/tab-mood.svg"),
    active: require("../../assets/images/tab-mood-active.svg"),
  },
  profile: {
    normal: require("../../assets/images/tab-profile.svg"),
    active: require("../../assets/images/tab-profile-active.svg"),
  },
};

// Shows one tab's icon: the pink + for Create, or the tab's icon, inside a
// light purple pill when the tab is open.
function TabIcon({ routeName, isFocused }) {
  if (routeName === "create") {
    return (
      <View style={styles.createButton}>
        <Image
          source={require("../../assets/images/icon-plus-white.svg")}
          style={styles.createIcon}
        />
      </View>
    );
  }
  const icons = TAB_ICONS[routeName];
  return (
    <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
      <Image
        source={isFocused ? icons.active : icons.normal}
        style={styles.icon}
      />
    </View>
  );
}

// Takes the props the tab navigator gives a custom tab bar (state,
// descriptors, emitter, navigateToTab) and shows a button for each tab. A tab's
// tabPress listener can stop the switch (used for Create and for logged-out
// users).
export default function AppTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const title = descriptors[route.key].options.title ?? route.name;

        // Tells the tab's listeners about the press, then opens the tab
        // unless a listener stopped it.
        function handlePress() {
          const event = emitter.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        }

        return (
          <Pressable
            key={route.key}
            onPress={handlePress}
            role="tab"
            aria-selected={isFocused}
            accessibilityLabel={title}
            style={styles.tab}
          >
            <TabIcon routeName={route.name} isFocused={isFocused} />
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    paddingTop: 9,
    paddingHorizontal: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.white,
    boxShadow: "0 -4px 16px rgba(20, 18, 42, 0.06)",
  },
  tab: { flex: 1, alignItems: "center" },
  iconPill: {
    width: 48,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: { backgroundColor: COLORS.lightPurple },
  icon: { width: 21, height: 21 },
  createButton: {
    width: 48,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.pink,
    boxShadow: "0 4px 10px rgba(255, 45, 120, 0.35)",
  },
  createIcon: { width: 18, height: 18 },
  label: {
    marginTop: 4,
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    lineHeight: 14,
    color: COLORS.grey,
  },
  labelActive: { color: COLORS.purple },
});

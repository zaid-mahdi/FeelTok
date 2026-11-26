// The frame of every admin page, from the admin mockups (web, laptop
// screen): the dark sidebar with the logo, Dashboard / Users and the signed-in
// admin with Log out, and the page header with a caption, title and today's
// date.
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { useAuth } from "../auth/AuthContext";
import { logOut } from "../auth/authService";
import { getInitials } from "../profile/Avatar";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: require("../../../assets/images/icon-admin-dashboard.svg"),
    activeIcon: require("../../../assets/images/icon-admin-dashboard-active.svg"),
  },
  {
    key: "users",
    label: "Users",
    href: "/admin/users",
    icon: require("../../../assets/images/icon-admin-users.svg"),
    activeIcon: require("../../../assets/images/icon-admin-users-active.svg"),
  },
];

// Returns today's date like "Sunday, 22 November 2026".
function formatToday() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Takes the active menu item ("dashboard" or "users"), the small caption
// and the title above the page, and the page content as children.
export default function AdminShell({ activeItem, caption, title, children }) {
  const { user, profile } = useAuth();
  const adminName = profile?.displayName ?? "Admin";

  return (
    <View style={styles.page}>
      <View style={styles.sidebar}>
        <View style={styles.brand}>
          <Image
            source={require("../../../assets/images/feeltok-logo-reversed.svg")}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.badge}>ADMIN</Text>
        </View>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeItem;
          return (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.href)}
              accessibilityRole="link"
              accessibilityLabel={item.label}
              style={({ hovered }) => [
                styles.navItem,
                isActive && styles.navItemActive,
                hovered && !isActive && styles.navItemHovered,
              ]}
            >
              <Image source={isActive ? item.activeIcon : item.icon} style={styles.navIcon} />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}

        <View style={styles.footer}>
          <View style={styles.adminRow}>
            <View style={styles.adminAvatar}>
              <Text style={styles.adminInitials}>{getInitials(adminName)}</Text>
            </View>
            <View style={styles.adminText}>
              <Text style={styles.adminName} numberOfLines={1}>{adminName}</Text>
              <Text style={styles.adminEmail} numberOfLines={1}>{user?.email}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => logOut()}
            accessibilityRole="button"
            accessibilityLabel="Log out"
            style={styles.logOut}
          >
            <Image
              source={require("../../../assets/images/icon-logout-pink.svg")}
              style={styles.navIcon}
            />
            <Text style={styles.logOutText}>Log out</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.caption}>{caption}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.date}>{formatToday()}</Text>
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, flexDirection: "row", backgroundColor: COLORS.adminBackground },
  sidebar: { width: 220, padding: 16, paddingTop: 24, backgroundColor: COLORS.ink },
  brand: { flexDirection: "row", alignItems: "center", marginBottom: 28, paddingHorizontal: 6 },
  logo: { width: 108, height: 30 },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    lineHeight: 14,
    color: COLORS.adminBadgeText,
    backgroundColor: COLORS.adminBadge,
  },
  navItem: {
    height: 40,
    marginBottom: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  navItemActive: { backgroundColor: COLORS.purple },
  navItemHovered: { backgroundColor: COLORS.adminBadge },
  navIcon: { width: 18, height: 18, marginRight: 10 },
  navText: { fontFamily: FONTS.semiBold, fontSize: 14, lineHeight: 20, color: COLORS.panelText },
  navTextActive: { color: COLORS.white },
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.panelBorder,
  },
  adminRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6 },
  adminAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },
  adminInitials: { fontFamily: FONTS.headingBold, fontSize: 12, color: COLORS.white },
  adminText: { flex: 1, marginLeft: 10 },
  adminName: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.white },
  adminEmail: { fontFamily: FONTS.regular, fontSize: 11, lineHeight: 16, color: COLORS.panelText },
  logOut: { flexDirection: "row", alignItems: "center", marginTop: 16, paddingHorizontal: 6 },
  logOutText: { fontFamily: FONTS.semiBold, fontSize: 14, lineHeight: 20, color: COLORS.moodLoveRing },
  main: { flex: 1 },
  mainContent: { padding: 28, paddingTop: 28, width: "100%" },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  caption: { fontFamily: FONTS.medium, fontSize: 13, lineHeight: 18, color: COLORS.grey },
  title: {
    marginTop: 2,
    fontFamily: FONTS.headingExtraBold,
    fontSize: 28,
    lineHeight: 36,
    color: COLORS.ink,
  },
  date: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: "hidden",
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
    backgroundColor: COLORS.white,
  },
});

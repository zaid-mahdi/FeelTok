// Admin Users page (/admin/users, Task 17), from its mockup: all users in a
// table, with a search box that filters the loaded list by name or username.
import { useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import AdminOnly from "../../src/features/admin/AdminOnly";
import AdminShell from "../../src/features/admin/AdminShell";
import UserTable from "../../src/features/admin/UserTable";
import { fetchAllUsers } from "../../src/features/admin/adminService";
import useAdminData from "../../src/features/admin/useAdminData";
import { COLORS } from "../../src/theme/colors";
import { FONTS } from "../../src/theme/fonts";

// Takes the users and the search text and returns those whose name or
// username contains it.
function filterUsers(users, searchText) {
  const search = searchText.trim().toLowerCase();
  if (!search) return users;
  return users.filter(
    (user) =>
      user.username.includes(search) || user.displayName.toLowerCase().includes(search),
  );
}

// Shows the users table to admins.
function UsersPage() {
  const users = useAdminData(fetchAllUsers);
  const [searchText, setSearchText] = useState("");

  return (
    <AdminShell activeItem="users" caption="FeelTok admin" title="Users">
      <View style={styles.card}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by name or username"
          placeholderTextColor={COLORS.placeholder}
          accessibilityLabel="Search users"
          style={styles.search}
        />
        <ErrorText message={users.errorMessage} />
        {users.isLoading && <LoadingSpinner />}
        {users.data && (
          <UserTable
            users={filterUsers(users.data, searchText)}
            emptyMessage={searchText ? `No users match "${searchText.trim()}".` : "No users yet."}
          />
        )}
      </View>
    </AdminShell>
  );
}

// The page, for admins only.
export default function AdminUsersScreen() {
  return (
    <AdminOnly>
      <UsersPage />
    </AdminOnly>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 20, backgroundColor: COLORS.white },
  search: {
    width: 340,
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.adminBackground,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.ink,
    ...Platform.select({ web: { outlineStyle: "none" } }),
  },
});

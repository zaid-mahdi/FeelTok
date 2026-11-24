// The top of the New post page: the author's avatar and name, the post's mood
// ("feeling happy") and "Change mood", which opens the list of moods.
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { findMood, USER_MOODS } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import Avatar from "../profile/Avatar";

// Shows one mood choice in the list (or "No mood" when mood is null), with a
// border when it is the chosen one.
function MoodOption({ mood, isSelected, onPress }) {
  const label = mood ? `${mood.emoji} ${mood.key}` : "No mood";
  return (
    <Pressable
      onPress={onPress}
      role="radio"
      aria-checked={isSelected}
      accessibilityLabel={mood ? mood.key : "No mood"}
      style={[
        styles.option,
        { backgroundColor: mood ? mood.tintColor : COLORS.white },
        isSelected && {
          borderColor: mood ? mood.ringColor : COLORS.grey,
        },
      ]}
    >
      <Text style={styles.optionText}>{label}</Text>
    </Pressable>
  );
}

// Takes the author's name, their avatar mood (their current mood), the post's
// mood key (or null) and a function called with the new mood key (or null).
// Changing the mood here only changes this post, not the profile.
export default function PostAuthorMood({
  name,
  profileMoodKey,
  moodKey,
  onMoodChange,
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const mood = findMood(moodKey);

  // Opens or closes the list of moods.
  function handleChangeMoodPress() {
    setIsPickerOpen((isOpen) => !isOpen);
  }

  // Saves the picked mood for this post and closes the list.
  function handleMoodPress(newMoodKey) {
    onMoodChange(newMoodKey);
    setIsPickerOpen(false);
  }

  return (
    <View>
      <View style={styles.row}>
        <Avatar name={name} moodKey={profileMoodKey} size={48} />
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.moodRow}>
            <View
              style={[
                styles.moodTag,
                {
                  backgroundColor: mood
                    ? mood.tintColor
                    : COLORS.white,
                },
              ]}
            >
              <Text style={styles.moodTagText}>
                {mood ? `${mood.emoji} feeling ${mood.key}` : "No mood"}
              </Text>
            </View>
            <Text
              style={styles.changeMood}
              onPress={handleChangeMoodPress}
              accessibilityRole="button"
            >
              {mood ? "Change mood" : "Add mood"}
            </Text>
          </View>
        </View>
      </View>

      {isPickerOpen && (
        <View style={styles.options} role="radiogroup" aria-label="Mood">
          {USER_MOODS.map((option) => (
            <MoodOption
              key={option.key}
              mood={option}
              isSelected={option.key === moodKey}
              onPress={() => handleMoodPress(option.key)}
            />
          ))}
          <MoodOption
            mood={null}
            isSelected={moodKey === null}
            onPress={() => handleMoodPress(null)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  details: { flex: 1, marginLeft: 12 },
  name: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.ink,
  },
  moodRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  moodTag: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    justifyContent: "center",
  },
  moodTagText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.ink,
  },
  changeMood: {
    marginLeft: 12,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.purple,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  option: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    justifyContent: "center",
  },
  optionText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.ink,
  },
});

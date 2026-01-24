import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Coffee Street, New York, NY 10001",
    image: null as string | null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, image: result.assets[0].uri });
    }
  };

  const handleSave = () => {

    // sucess message update
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your personal information</Text>
        </View>

        {/* Profile Picture */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={isEditing ? pickImage : undefined}>
            <View style={styles.profileImageWrapper}>
              {profile.image ? (
                <Image source={{ uri: profile.image }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={60} color="#C67C4E" />
                </View>
              )}
              {isEditing && (
                <View style={styles.editImageButton}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons name={isEditing ? "close" : "create"} size={20} color="#C67C4E" />
          <Text style={styles.editButtonText}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="person" size={20} color="#8D8D8D" />
              <Text style={styles.detailLabel}>Full Name</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
              />
            ) : (
              <Text style={styles.detailValue}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="mail" size={20} color="#8D8D8D" />
              <Text style={styles.detailLabel}>Email Address</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.detailValue}>{profile.email}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="call" size={20} color="#8D8D8D" />
              <Text style={styles.detailLabel}>Phone Number</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.phone}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.detailValue}>{profile.phone}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="location" size={20} color="#8D8D8D" />
              <Text style={styles.detailLabel}>Delivery Address</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={profile.address}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.detailValue}>{profile.address}</Text>
            )}
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Other Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="card" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.optionText}>Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8D8D8D" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="gift" size={22} color="#FF9800" />
              </View>
              <Text style={styles.optionText}>Promo Codes</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8D8D8D" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="settings" size={22} color="#9C27B0" />
              </View>
              <Text style={styles.optionText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8D8D8D" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="help-circle" size={22} color="#F44336" />
              </View>
              <Text style={styles.optionText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8D8D8D" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2F2D2C",
  },
  subtitle: {
    fontSize: 14,
    color: "#8D8D8D",
    marginTop: 4,
  },
  profileImageContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#F5F5F5",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#F5F5F5",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#C67C4E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F2D2C",
    marginTop: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: "#8D8D8D",
    marginTop: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#C67C4E",
    marginBottom: 24,
  },
  editButtonText: {
    fontSize: 16,
    color: "#C67C4E",
    fontWeight: "600",
    marginLeft: 8,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  detailItem: {
    marginBottom: 20,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#8D8D8D",
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    color: "#2F2D2C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
  },
  input: {
    fontSize: 16,
    color: "#2F2D2C",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#C67C4E",
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 32,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  optionsContainer: {
    paddingHorizontal: 24,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#2F2D2C",
    fontWeight: "500",
  },
});
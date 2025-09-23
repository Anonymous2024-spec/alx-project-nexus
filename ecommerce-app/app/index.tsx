import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 E-Commerce App</Text>
      <Text style={styles.subtitle}>Foundation Setup Complete!</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ready to Build! 🚀</Text>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>✅ Expo Router Working</Text>
        <Text style={styles.statusText}>✅ TypeScript Working</Text>
        <Text style={styles.statusText}>✅ Navigation Working</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#6C757D",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#28A745",
    marginBottom: 5,
  },
});

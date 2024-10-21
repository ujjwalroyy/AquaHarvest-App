import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import axios from "axios";
import Layout from "./Layout.js";

const themeColors = { bg: "#B6E6FC" };

const ProductDetails = ({ route }) => {
  const { params } = route;
  const [pDetails, setPDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log(`Fetching product details for ID: ${params._id}`);
        const response = await axios.get(
          `http://192.168.43.60:5050/api/v1/product/${params._id}`
        );
        console.log("API response:", response.data);
        setPDetails(response.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [params._id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleContactUs = () => {
    const phoneNumber = pDetails.phone;
    Linking.openURL(`tel:${phoneNumber}`).catch(() =>
      alert("Error: Unable to open phone app.")
    );
  };
  const handleBuy = () => {
    alert("Coming Soon", "This feature is under development.");
  };

  return (
    <Layout style={{ backgroundColor: themeColors.bg, flex: 1 }}>
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={{ uri: pDetails?.images[0]?.url }}
          style={styles.image}
        />
        <View style={styles.container}>
          <Text style={styles.title}>{pDetails?.name}</Text>
          <Text style={styles.desc}>Description: {pDetails?.description}</Text>
          <Text style={styles.price}>Price: ₹{pDetails?.price}/kg</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[
                styles.btnCart,
                pDetails?.quantity <= 0 && styles.btnDisabled,
              ]}
              onPress={handleContactUs}
              disabled={pDetails?.quantity <= 0}
            >
              <Text style={styles.btnCartText}>Contact Seller</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[
                styles.btnCart,
                pDetails?.quantity <= 0 && styles.btnDisabled,
              ]}
              onPress={handleBuy}
              disabled={pDetails?.quantity <= 0}
            >
              <Text style={styles.btnCartText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 350,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#B6E6FC",
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    color: "#333",
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "justify",
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ff5a5f",
    marginBottom: 20,
  },
  btnContainer: {
    marginVertical: 10,
  },
  btnCart: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 5,
    height: 45,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, 
  },
  btnCartText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  btnDisabled: {
    backgroundColor: "#d3d3d3",
  },
});

export default ProductDetails;

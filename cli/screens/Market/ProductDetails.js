import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import axios from 'axios';
import Layout from "./Layout.js";

const themeColors = { bg: '#B6E6FC' };

const ProductDetails = ({ route }) => {
  const { params } = route; 
  const [pDetails, setPDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log(`Fetching product details for ID: ${params._id}`);
        const response = await axios.get(`http://192.168.43.60:5050/api/v1/product/${params._id}`);
        console.log('API response:', response.data);
        setPDetails(response.data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
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
    Linking.openURL(`tel:${phoneNumber}`)
      .catch(() => alert('Error: Unable to open phone app.'));
  };

  return (
    <Layout style={{ backgroundColor: themeColors.bg}}>
      <Image source={{ uri: pDetails?.images[0]?.url }} style={styles.image} />
      <View style={styles.container}>
        <Text style={styles.title}>{pDetails?.name}</Text>
        <Text style={styles.desc}>Description: {pDetails?.description}</Text>
        <Text style={styles.title}>Price: ₹{pDetails?.price} </Text>
        
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnCart}
            onPress={handleContactUs}
            disabled={pDetails?.quantity <= 0}
          >
            <Text style={styles.btnCartText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%",
  },
  container: {
    marginVertical: 15,
    marginHorizontal: 10,
    backgroundColor: themeColors.bg,
    borderColor: "#A9A9A9", // Changed to light black (dark gray)
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: 18,
    textAlign: "left",
  },
  desc: {
    fontSize: 12,
    textTransform: "capitalize",
    textAlign: "justify",
    marginVertical: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  btnCart: {
    width: 180,
    backgroundColor: "#000000",
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
  },
  btnCartText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ProductDetails;

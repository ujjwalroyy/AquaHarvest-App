import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const themeColors = { bg: '#B6E6FC' };

const ProductsCard = ({ p }) => {
  const navigation = useNavigation();

  const handleMoreButton = () => {
    if (p?._id) {
      navigation.navigate("ProductDetails", { _id: p._id });
      console.log("Navigating to Product Details with ID:", p._id);
    }
  };

  const handleBuy = () => {
    alert("Coming soon...");
  };

  return (
    <View style={styles.card}>
      <Image style={styles.cardImage} source={{ uri: p?.images[0]?.url }} />
      <Text style={styles.cardTitle}>{p?.name}</Text>
      <Text style={styles.cardDesc}>
        {p?.description.substring(0, 30)}... more
      </Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleMoreButton}
        >
          <Text style={styles.btnText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnCart}
          onPress={handleBuy}
        >
          <Text style={styles.btnText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    marginVertical: 8,
    marginHorizontal: 4,
    width: "48%",
    padding: 5,
    backgroundColor: themeColors.bg,
    justifyContent: "center",
  },
  cardImage: {
    height: 120,
    width: "100%",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 12,
    textAlign: "left",
  },
  btnContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#000000",
    height: 30,
    width: "48%",
    borderRadius: 5,
    justifyContent: "center",
  },
  btnCart: {
    backgroundColor: "orange",
    height: 30,
    width: "48%",
    borderRadius: 5,
    justifyContent: "center",
  },
  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductsCard;

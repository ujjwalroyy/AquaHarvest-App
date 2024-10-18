import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import ProductsCard from "./ProductCard.js";

const themeColors = { bg: '#B6E6FC' };

const Products = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <View style={styles.noProductsContainer}>
        <Text style={styles.noProductsText}>No Products Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductsCard p={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 240,
    backgroundColor: themeColors.bg, 
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeColors.bg,
    height: '100%', 
  },
  noProductsText: {
    fontSize: 18,
    color: "#000", 
  },
});

export default Products;

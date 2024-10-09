import { View, FlatList, StyleSheet, Text } from "react-native";
import React from "react";
import ProductsCard from "./ProductCard.js";

const Products = ({ products }) => {
  if (!products.length) {
    return <View><Text>No Products Found</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductsCard p={item} />}
        numColumns={2}
      />
    </View>
  );
};


export default Products;

const styles = StyleSheet.create({
    container: {
      marginBottom: 240
    },
});


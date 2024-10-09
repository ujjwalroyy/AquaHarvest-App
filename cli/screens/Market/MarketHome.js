import {  Alert, ScrollView, StyleSheet, ActivityIndicator, BackHandler } from "react-native";
import React, {  useEffect, useState } from "react";
import Layout from "../Market/Layout.js";
import Categories from "../Market/Category.js";
import Banner from "../Market/Banner.js";
import Products from "../Market/Product.js";
import Header from "../Market/Header.js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }

      const response = await axios.get(
        "http://192.168.43.60:5050/api/v1/product/get-all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProductsData(response.data.products);
      setFilteredProducts(response.data.products); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      const filtered = productsData.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(productsData); 
    }
  };

  const handleCategorySelect = (category) => {
    console.log('Category selected:', category); 
    if (category) {
      const filtered = productsData.filter(product => 
        product.category === category 
      );
      console.log('Filtered products:', filtered);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(productsData); 
    }
  };

  const handleBackPress = () => {
  
    if (filteredProducts.length < productsData.length) {
      setFilteredProducts(productsData);
      return true; 
    }
    return false; 
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [filteredProducts, productsData]);
  return (
    <Layout>
      <Header onSearch={handleSearch} />
      <Categories onSelectCategory={handleCategorySelect} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Banner />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Products products={filteredProducts} /> 
        )}
      </ScrollView>
    </Layout>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
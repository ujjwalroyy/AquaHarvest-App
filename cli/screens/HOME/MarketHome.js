import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MarketHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cards, setCards] = useState([]);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');

  const handleBecomeSeller = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSeller(true);
    }, 4000);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateCard = () => {
    if (image && name && type && price) {
      const newCard = { image, name, type, price, category: selectedCategory };
      setCards([...cards, newCard]);
      resetForm();
    }
  };

  const resetForm = () => {
    setImage(null);
    setName('');
    setType('');
    setPrice('');
    setSelectedCategory(null);
    setIsSeller(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MARKET PLACE</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isSeller ? (
        selectedCategory ? (
          <View style={styles.cardCreator}>
            <Button title="Pick an image" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder={`${selectedCategory} Type`}
              value={type}
              onChangeText={setType}
              style={styles.input}
            />
            <TextInput
              placeholder={`Price in ${selectedCategory === 'Fish' ? 'per kg' : 'per packet'}`}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button title="Create Card" onPress={handleCreateCard} />
            <Button title="Cancel" onPress={resetForm} color="red" />
          </View>
        ) : (
          <View style={styles.categorySelector}>
            <TouchableOpacity
              style={[styles.categoryButton, styles.fishButton]}
              onPress={() => setSelectedCategory('Fish')}
            >
              <Text style={styles.buttonText}>Fish</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, styles.seedButton]}
              onPress={() => setSelectedCategory('Seed')}
            >
              <Text style={styles.buttonText}>Seed</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <Button title="Become Seller" onPress={handleBecomeSeller} />
      )}
      <ScrollView horizontal={true} style={styles.scrollContainer}>
        {cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardCategory}>{card.category}</Text>
            <Image source={{ uri: card.image }} style={styles.cardImage} />
            <Text style={styles.cardTextBold}>Name: <Text style={styles.cardText}>{card.name}</Text></Text>
            <Text style={styles.cardTextBold}>Type: <Text style={styles.cardText}>{card.type}</Text></Text>
            <Text style={styles.cardTextBold}>Price: <Text style={styles.cardText}>₹ {card.price} {card.category === 'Fish' ? 'per kg' : 'per packet'}</Text></Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  cardCreator: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100%',
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  scrollContainer: {
    marginTop: 20,
  },
  card: {
    width: 250,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  cardTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 2,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  categoryButton: {
    padding: 15,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fishButton: {
    backgroundColor: '#3b5998',
  },
  seedButton: {
    backgroundColor: '#8b9dc3',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MarketHome;
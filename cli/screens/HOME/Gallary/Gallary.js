import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const imageSize = width - 40;

const Bubble = ({ style }) => <Animated.View style={[styles.bubble, style]} />;

const GalleryItem = ({ image, onPress }) => {
  const imageUrl = image.images?.[0]?.url || '';
  const imageName = image.name || '';
  const shortDescription = image.description?.split(" ").slice(0, 15).join(" ") + "...";

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={onPress}>
        <Image
          style={styles.image}
          source={{ uri: imageUrl }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Text style={styles.imageName}>{imageName}</Text>
      <Text style={styles.imageDescription}>
        {shortDescription}{" "}
        <Text style={styles.seeMoreText} onPress={onPress}>See more</Text>
      </Text>
    </View>
  );
};

const GalleryPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }

      const response = await axios.get(
        "http://192.168.43.60:5050/api/v1/gallary/get-all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('API Response:', response.data);

      const images = Array.isArray(response.data.galleryItems) ? response.data.galleryItems : []; 
      setImageData(images);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      Alert.alert('Error', 'Failed to fetch gallery items data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const bubbleCount = 5;
  const bubbles = useRef([]);

  useEffect(() => {
    for (let i = 0; i < bubbleCount; i++) {
      createBubble(i);
    }
  }, []);

  const createBubble = (index) => {
    const position = new Animated.Value(Dimensions.get('window').height + 50);
    bubbles.current[index] = position;

    const animateBubble = () => {
      position.setValue(Dimensions.get('window').height + 50);
      Animated.timing(position, {
        toValue: -50,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => {
        animateBubble();
      });
    };

    animateBubble();
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        {bubbles.current.map((bubble, index) => (
          <Bubble
            key={index}
            style={{
              position: 'absolute',
              left: Math.random() * (width - 30),
              bottom: 0,
              opacity: 0.6,
              width: 30 + Math.random() * 20,
              height: 30 + Math.random() * 20,
              borderRadius: 50,
              backgroundColor: 'rgba(0, 150, 255, 0.3)',
              transform: [{ translateY: bubble }],
            }}
          />
        ))}
      </View>

      <Text style={styles.header}>Gallery</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : imageData.length === 0 ? (
        <Text style={styles.noDataText}>No data available.</Text>
      ) : (
        <FlatList
          data={imageData}
          renderItem={({ item }) => (
            <GalleryItem image={item} onPress={() => openModal(item)} />
          )}
          keyExtractor={(item) => item.images?.[0]?.public_id || item._id} 
          numColumns={1}
          contentContainerStyle={styles.gallery}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedImage && (
            <>
              <Image
                style={styles.modalImage}
                source={{ uri: selectedImage.images?.[0]?.url }}
                resizeMode="contain"
              />
              <Text style={styles.modalImageName}>{selectedImage.name}</Text>
              <Text style={styles.modalImageDescription}>
                {selectedImage.description}
              </Text>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B6E6FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 10,
  },
  imageName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  seeMoreText: {
    color: '#1E90FF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    marginTop: 20,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#B6E6FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  modalImageName: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalImageDescription: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default GalleryPage;

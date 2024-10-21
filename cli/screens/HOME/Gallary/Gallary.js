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
} from 'react-native';

const { width } = Dimensions.get('window');
const imageSize = width - 40; 

const images = [
  {
    id: '1',
    uri: 'https://via.placeholder.com/300x300.png',
    name: 'Image 1',
    description: 'This is a long description for Image 1. It contains a lot of details that might not fit in the usual view.',
  },
  {
    id: '2',
    uri: 'https://via.placeholder.com/300x300.png',
    name: 'Image 2',
    description: 'This is the description for Image 2.',
  },
  {
    id: '3',
    uri: 'https://via.placeholder.com/300x300.png',
    name: 'Image 3',
    description: 'This is the description for Image 3.',
  },
];

const Bubble = ({ style }) => <Animated.View style={[styles.bubble, style]} />;

const GalleryItem = ({ image, onPress }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={onPress}>
        <Image
          style={styles.image}
          source={{ uri: image.uri }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Text style={styles.imageName}>{image.name}</Text>
    </View>
  );
};

const GalleryPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 

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

      <FlatList
        data={images}
        renderItem={({ item }) => (
          <GalleryItem image={item} onPress={() => openModal(item)} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={1} 
        contentContainerStyle={styles.gallery}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedImage && (
            <>
              <Image
                style={styles.modalImage}
                source={{ uri: selectedImage.uri }}
                resizeMode="cover"
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
  },
  bubbleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  bubble: {
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#005f99', 
  },
  gallery: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  itemContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 10,
  },
  imageName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#B6E6FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  modalImageName: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#005f99', 
  },
  modalImageDescription: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#005f99', 
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white', 
    fontWeight: 'bold',
  },
});

export default GalleryPage;
  
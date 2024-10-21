import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import Carousel, { PaginationLight } from "react-native-x-carousel";
import image1 from '../../assets/poster/poster1.jpeg';
import image2 from '../../assets/poster/poster3.jpeg';
import image3 from '../../assets/poster/poster4.jpeg';
import image4 from '../../assets/poster/poster5.jpeg';

const { width } = Dimensions.get("window");

export const BannerData = [
  {
    _id: 1,
    coverImageUri: image1,
    cornerLabelColor: "#FFD300",
    cornerLabelText: "GOTY",
  },
  {
    _id: 2,
    coverImageUri: image2,
    cornerLabelColor: "#0080ff",
    cornerLabelText: "NEW",
  },
  {
    _id: 3,
    coverImageUri: image3,
    cornerLabelColor: "#2ECC40",
    cornerLabelText: "-75%",
  },
  {
    _id: 4,
    coverImageUri: image4,
    cornerLabelColor: "#2ECC40",
    cornerLabelText: "-20%",
  },
];

const Banner = () => {
  const renderItem = (data) => (
    <View key={data._id} style={styles.cardContainer}>
      <Pressable onPress={() => alert(data._id)}>
        <View style={styles.cardWrapper}>
          <Image style={styles.card} source={data.coverImageUri} />
          <View
            style={[
              styles.cornerLabel,
              { backgroundColor: data.cornerLabelColor },
            ]}
          >
            <Text style={styles.cornerLabelText}>{data.cornerLabelText}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        pagination={PaginationLight}
        renderItem={renderItem}
        data={BannerData}
        loop
        autoplay
        paginationProps={{
          dotsLength: BannerData.length,
          activeDotIndex: 0, 
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: 200, 
    overflow: "hidden",
  },
  cardContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    position: "relative",
  },
  card: {
    width,
    height: 200,
    resizeMode: "cover",
  },
  cornerLabel: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 5,
    borderRadius: 5,
  },
  cornerLabelText: {
    color: "#fff",
  },
});

export default Banner;

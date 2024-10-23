import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const About = () => {
  const [order, setOrder] = useState([0, 1, 2, 3]);

  const swapProfiles = () => {
    setOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      const firstElement = newOrder.shift();
      newOrder.push(firstElement);
      return newOrder;
    });
  };

  const saveOrder = async (newOrder) => {
    try {
      await AsyncStorage.setItem('profileOrder', JSON.stringify(newOrder));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const loadOrder = async () => {
    try {
      const savedOrder = await AsyncStorage.getItem('profileOrder');
      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  useEffect(() => {
    loadOrder();
    const intervalId = setInterval(() => {
      swapProfiles();
      saveOrder(order); 
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/about/logo.png")}
          style={styles.logo}
        />
        <View style={styles.titleContainer}>
          <Text style={[styles.appName, { fontStyle: "italic" }]}>
            Matsya Jeevan
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.productSection}>
          <View style={styles.content}>
            <Text style={styles.heading}>A product by</Text>
            <Text style={styles.mainText}>SCHOOL OF FISHERIES CUTM</Text>

            <View style={styles.divider}></View>

            <Text style={styles.subheading}>in collaboration with</Text>
            <Text style={styles.mainText}>
              SCHOOL OF ENGINEERING AND TECHNOLOGY CUTM
            </Text>

            <View style={styles.divider}></View>

            <Text style={styles.subheading}>under</Text>
            <Text style={[styles.mainText, { fontStyle: "italic" }]}>
              Centurion University Of Technology And Management
              ,Paralakhemundi,Odisha
            </Text>
          </View>
        </View>

        <View style={styles.missionSection}>
          <Text style={styles.missionTitles}>Our Mission</Text>
          <View style={styles.missionContent}>
            <Text style={styles.missionText}>
              We aim to revolutionize fish farming by providing farmers with
              essential tools for efficient management and direct connections to
              sellers. Our goal is to promote sustainable practices and enhance
              the livelihoods of fish farmers.{" "}
            </Text>
            <Image
              source={require("../assets/about/mission.jpeg")}
              style={styles.missionImage}
            />
          </View>
        </View>

        <View style={styles.missionSection}>
          <Text style={styles.missionTitles}>Our Story</Text>
          <View style={styles.missionContent}>
            <Text style={styles.missionText}>
              At Matsya Jeevan, we empower fish farmers with a mobile app that
              simplifies pond management, tracks finances, and connects them
              directly with buyers, promoting sustainability and profitability.
            </Text>
            <Image
              source={require("../assets/about/story.jpeg")}
              style={styles.missionImage}
            />
          </View>
        </View>

        <Text style={styles.missionTitle}>Development mentor</Text>
        <View style={[styles.profileCard, { alignSelf: "flex-start" }]}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Mr. Jagannath Padhy</Text>
            <Text style={styles.profilePosition}>Assistant Professor</Text>
            <Text style={styles.profileMessage}>
              Department of Computer Science, Centurion University of Technology
              and Management, Odisha
            </Text>
          </View>
          <Image
            source={require("../assets/about/jagannath.jpeg")}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.missionTitle}>Collaborators</Text>

        <View style={[styles.profileCard, { alignSelf: "flex-end" }]}>
          <Image
            source={require("../assets/about/dean.jpg")}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Dr. Prafulla Kumar Panda</Text>
            <Text style={styles.profilePosition}>Dean, School of Engineering and Technology</Text>
            <Text style={styles.profileMessage}>
              Centurion University of
              Technology and Management, Odisha
            </Text>
          </View>
        </View>

        <View style={[styles.profileCard, { alignSelf: "flex-start" }]}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Dr. Sambid Swain</Text>
            <Text style={styles.profilePosition}>
              Associate Dean                        School of fisheries {" "}
            </Text>
            <Text style={styles.profileMessage}>
              Centurion University of Technology and
              Management, Odisha
            </Text>
          </View>
          <Image
            source={require("../assets/about/sambid.jpeg")}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.missionTitle}>Developer Team</Text>

        <View style={styles.profileSection}>
        {order.map((index) => {
        switch (index) {
          case 0:
            return (
              <View key={index} style={[styles.profileCard, { alignSelf: "flex-start" }]}>
                <Image source={require("../assets/about/akarshan.jpeg")} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Akarshan Kumar</Text>
                  <Text style={styles.profilePosition}>UI/UX designer</Text>
                  <Text style={styles.profileMessage}>
                    I am a passionate UI/UX designer specializing in user-centered design. My goal is to create simple, engaging, and seamless interfaces that deliver an exceptional user experience.
                  </Text>
                  <View style={styles.socialMediaContainer}>
                    <Icon name="facebook" size={30} color="#3b5998" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.facebook.com/akarshan.kumar.9465")} />
                    <Icon name="instagram" size={30} color="#C13584" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.instagram.com/e_r_t_d_a/")} />
                    <Icon name="linkedin" size={30} color="#0e76a8" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.linkedin.com/in/akarshan-kumar/")} />
                    <Icon name="whatsapp" size={30} color="#25D366" style={styles.socialIcon} onPress={() => Linking.openURL("https://wa.me/+919065506639")} />
                  </View>
                </View>
              </View>
            );
          case 1:
            return (
              <View key={index} style={[styles.profileCard, { alignSelf: "flex-start" }]}>
                <Image source={require("../assets/about/vasu.jpeg")} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Vasudev Jha</Text>
                  <Text style={styles.profilePosition}>DevOps Engineer</Text>
                  <Text style={styles.profileMessage}>
                    Exploring the deep sea of cutting-edge technology, I am passionate about cybersecurity and networking. I am a silver medalist in the Cybersecurity Skill Trade at India Skills 2024.
                  </Text>
                  <View style={styles.socialMediaContainer}>
                    <Icon name="facebook" size={30} color="#3b5998" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.facebook.com/basudev.jha.7")} />
                    <Icon name="instagram" size={30} color="#C13584" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.instagram.com/basudev.jha/")} />
                    <Icon name="linkedin" size={30} color="#0e76a8" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.linkedin.com/in/vasudev-jha-953a52289/")} />
                    <Icon name="whatsapp" size={30} color="#25D366" style={styles.socialIcon} onPress={() => Linking.openURL("https://wa.me/+919334718486")} />
                  </View>
                </View>
              </View>
            );
          case 2:
            return (
              <View key={index} style={[styles.profileCard, { alignSelf: "flex-end" }]}>
                <Image source={require("../assets/about/vansh.jpeg")} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Vansh Kushwaha</Text>
                  <Text style={styles.profilePosition}>Frontend Developer</Text>
                  <Text style={styles.profileMessage}>
                  I specialize in crafting awesome
 user interfaces using React-JS,React-Native(App Development), JavaScript,
 HTML, and CSS.I also have experience JAVA, which
 enhances my ability to create dynamic web applications.
                  </Text>
                  <View style={styles.socialMediaContainer}>
                    <Icon name="facebook" size={30} color="#3b5998" style={styles.socialIcon} onPress={() => Linking.openURL("https://facebook.com")} />
                    <Icon name="instagram" size={30} color="#C13584" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.instagram.com/vansh_kushwaha__/")} />
                    <Icon name="linkedin" size={30} color="#0e76a8" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.linkedin.com/in/vansh-kushwaha-71640a25b/")} />
                    <Icon name="whatsapp" size={30} color="#25D366" style={styles.socialIcon} onPress={() => Linking.openURL("https://wa.me/+919576231588")} />
                  </View>
                </View>
              </View>
            );
          case 3:
            return (
              <View key={index} style={[styles.profileCard, { alignSelf: "flex-end" }]}>
                <Image source={require("../assets/about/ujjwal.png")} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Ujjwal Kumar Roy</Text>
                  <Text style={styles.profilePosition}>Software Developer</Text>
                  <Text style={styles.profileMessage}>
                    Enthusiastic software developer skilled in creating user-friendly applications and solving problems. I thrive in teams and am always eager to learn and grow in the tech field.
                  </Text>
                  <View style={styles.socialMediaContainer}>
                    <Icon name="facebook" size={30} color="#3b5998" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.facebook.com/profile.php?id=100021706052639")} />
                    <Icon name="instagram" size={30} color="#C13584" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.instagram.com/ujjwalroy68/")} />
                    <Icon name="linkedin" size={30} color="#0e76a8" style={styles.socialIcon} onPress={() => Linking.openURL("https://www.linkedin.com/in/ujjwal-kumar-roy-84931b27b/")} />
                    <Icon name="whatsapp" size={30} color="#25D366" style={styles.socialIcon} onPress={() => Linking.openURL("https://wa.me/+916206496829")} />
                  </View>
                </View>
              </View>
            );
          default:
            return null;
        }
      })}

          <Text style={styles.missionTitle}>A message by </Text>

          <View style={[styles.profileCard, { alignSelf: "flex-end" }]}>
            <Image
              source={require("../assets/about/rao-sir.jpg")}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>D N Rao</Text>
              <Text style={styles.profilePosition}>
                Co-Founder and Vice President at CUTM
              </Text>
              <Text style={styles.profileMessage}>
                Researching the impact of climate change on marine ecosystems.
              </Text>
            </View>
          </View>

          <View style={[styles.profileCard, { alignSelf: "flex-start" }]}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Anita Patra</Text>
              <Text style={styles.profilePosition}>Registrar at CUTM</Text>
              <Text style={styles.profileMessage}>
                Focused on marine life conservation and sustainable fishing
                techniques.
              </Text>
            </View>
            <Image
              source={require("../assets/about/registrar.jpg")}
              style={styles.profileImage}
            />
          </View>

          <Text style={styles.copyright}>
            © {new Date().getFullYear()} School of Fisheries, CUTM. All Rights
            Reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#37AFE1",
  },
  socialIcon: {
    marginRight: 15,
  },
  logo: {
    width: 50,
    height: 50,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#4CC9FE",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    zIndex: 1000,
  },
  socialMediaContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    alignItems: "flex-start",
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 16,
    color: "#d0e1f9",
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 50,
  },
  productSection: {
    marginTop: 100,
    padding: 20,
    backgroundColor: "#f0f0f0", 
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
  },
  banner: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  mainText: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#0066cc",
    marginVertical: 5,
    textAlign: "center",
  },
  subheading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  projectText: {
    fontSize: 16,
    color: "#cc6600",
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  divider: {
    width: "60%",
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
    width: "90%", 
    alignSelf: "center", 
  },
  logo: {
    width: 50, 
    height: 50, 
    marginRight: 15, 
  },
  universityName: {
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333", 
  },
  missionSection: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
    alignItems: "flex-start",
  },
  missionTitles: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Helvetica",
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Helvetica",
  },
  missionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  missionText: {
    flex: 1,
    fontSize: 16,
    color: "#4a4a4a",
    marginRight: 15,
    fontFamily: "Arial",
  },
  missionImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileSection: {
    padding: 20,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profilePosition: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  profileMessage: {
    fontSize: 14,
    color: "#4a4a4a",
    marginBottom: 10,
    fontFamily: "Arial",
  },
  footer: {
    backgroundColor: "#4a90e2", 
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1, 
    borderTopColor: "#ffffff", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
    elevation: 3, 
  },
  copyright: {
    fontSize: 14,
    color: "#000",
    textAlign: "center", 
    fontFamily: "Arial", 
    lineHeight: 18, 
  },
});

export default About;

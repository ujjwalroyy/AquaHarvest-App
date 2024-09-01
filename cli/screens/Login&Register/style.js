import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 260,
    width: 260,
    marginTop: 30,
  },
  verifyButton: {
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  text_footer: {
    color: "205375a#",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#420475",
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    color: "305375a#",
  },
  loginContainer: {
  
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  form: {
    flex: 1,
    justifyContent: 'center', // Center the form
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 16,
    padding: 8,
    marginBottom: 8, // Reduced margin to fit all inputs on the screen
  },
  icon: {
    marginLeft: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: 'gray',
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  forgotPasswordButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: 'blue',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  googleImage: {
    width: 24,
    height: 24,
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    // width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'red',
    fontSize: 16,
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
  },
  header: {
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  text_header: {
    color: "#3420475",
    fontWeight: "bold",
    fontSize: 30,
  },
  button: {
    alignItems: "center",
    marginTop: -20,
    alignItems: "center",
    textAlign: "center",
    margin: 20,
  },
  inBut: {
    width: "70%",
    backgroundColor: "#420475",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  inBut2: {
    backgroundColor: "#420475",
    height: 65,
    width: 65,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallIcon2: {
    fontSize: 40,
    // marginRight: 10,
  },
  bottomText: {
    color: "black",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },


  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  otpInput: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },

});

export default styles
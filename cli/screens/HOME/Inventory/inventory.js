import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios'
import {Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inventory = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [pondsExpanses, setPondExpanses] = useState('');
  const [income, setIncome] = useState([]);
  const [pondsIncome, setPondIncome] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [transactionType, setTransactionType] = useState('Expense');
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false); 

  const fetchRecords = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.error("No token found. Please log in again.");
            return;
        }

        const inventoryResponse = await axios.get('http://192.168.43.60:5050/api/v1/inventory/get-all', {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Fetched inventory records ------------------------>:', inventoryResponse.data);
        const inventoryData = Array.isArray(inventoryResponse.data) ? inventoryResponse.data : [];

        console.log('Inventory Data --------------------->:', inventoryData);
        
        setExpenses(inventoryData.filter(item => item.type === 'Expense'));
        setIncome(inventoryData.filter(item => item.type === 'Income'));

        const incomeResponse = await axios.get('http://192.168.43.60:5050/api/v1/expense-income/income/total', {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Income Response ------------------>:', incomeResponse.data);
        const totalIncome = incomeResponse.data.totalIncome || 0; // Default to 0 if not available
        setPondIncome(totalIncome);
        const expenseResponse = await axios.get('http://192.168.43.60:5050/api/v1/expense-income/expenses/total', {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Expense Response -------------------->:', expenseResponse.data);
        const totalExpenses = expenseResponse.data.totalExpenses || 0; // Default to 0 if not available
        setPondExpanses(totalExpenses)
    } catch (error) {
        console.error('Error fetching records ----------------->:', error);
        Alert.alert('Error', error.response ? error.response.data.message : 'No Data Found...');
    }
};


  const addTransaction = async () => {
    const record = {
      productName,
      quantity,
      cost,
      type: transactionType,
    };
  
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in again.");
        return;
      }
  
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      if (selectedRecord) {
        await axios.put(
          `http://192.168.43.60:5050/api/v1/inventory/update/${selectedRecord._id}`,
          record,
          config
        );
      } else {
        await axios.post(
          'http://192.168.43.60:5050/api/v1/inventory/create',
          record,
          config
        );
      }
  
      await fetchRecords(); 
  
      console.log('Records fetched after transaction:', expenses, income);
    } catch (error) {
      console.error('Error adding/updating transaction:', error);
    }
  
    resetInputs();
    setIsModalVisible(false);
  };
  
  useEffect(() => {
    fetchRecords();
  }, []);



  const resetInputs = () => {
    setProductName('');
    setQuantity('');
    setCost('');
  };

  const calculateTotalExpense = () => {
    return expenses.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  };

  const calculateTotalIncome = () => {
    return income.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  };
  const calculateTotalPondCalc = () => {
    return pondsIncome - pondsExpanses;
  }

  const calculateProfitOrLoss = () => {
    return calculateTotalIncome() - calculateTotalExpense() + calculateTotalPondCalc();
  };

  const profitOrLoss = calculateProfitOrLoss();
  const profitOrLossStyle = profitOrLoss >= 0 ? styles.profitText : styles.lossText;
  const profitOrLossText = profitOrLoss >= 0 ? 'Profit' : 'Loss';


  const renderRecord = ({ item, index }) => (
    <View style={styles.tableRow}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tableRowContent}>
      {/* Each item/column will have fixed width */}
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>{item.productName}</Text>
      <Text style={styles.tableCell}>{item.quantity}</Text>
      <Text style={[styles.tableCell, { color: item.type === 'Income' ? 'green' : 'red' }]}>{item.cost}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedRecord(item);
          setProductName(item.productName);
          setQuantity(item.quantity);
          setCost(item.cost);
          setTransactionType(item.type);
          setIsModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const visibleRecords = showAllDetails ? [...expenses, ...income] : [...expenses, ...income].slice(0, 5);

  return (
    <ScrollView style={styles.container}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
      <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Farm Inventory</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Farm is in</Text>
        <Text style={profitOrLossStyle}>
          {profitOrLossText}: {profitOrLoss.toFixed(2)} INR
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Dashboard', { 
            profitOrLoss, 
            income: calculateTotalIncome(), 
            expenses: calculateTotalExpense() 
          })}>
          <Text style={styles.dashboardLink}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Income Details</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>S.No</Text>
          <Text style={styles.tableHeaderCell}>Product Name</Text>
          <Text style={styles.tableHeaderCell}>Quantity</Text>
          <Text style={styles.tableHeaderCell}>Cost</Text>
          <Text style={styles.tableHeaderCell}>Action</Text>
        </View>

        <FlatList
          data={income}
          renderItem={renderRecord}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.recordsContainer}
        />
      </View>
      </ScrollView>
       </View>


<View>
<ScrollView horizontal showsHorizontalScrollIndicator={false}>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Expense Details</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>S.No</Text>
          <Text style={styles.tableHeaderCell}>Product Name</Text>
          <Text style={styles.tableHeaderCell}>Quantity</Text>
          <Text style={styles.tableHeaderCell}>Cost</Text>
          <Text style={styles.tableHeaderCell}>Action</Text>
        </View>

        <FlatList
          data={expenses}
          renderItem={renderRecord}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.recordsContainer}
        />
      </View>
</ScrollView>
  </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add {transactionType}</Text>
            <TextInput
              placeholder="Product Name"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
            />
            <TextInput
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Cost (Rupees)"
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={addTransaction}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.addButton, styles.expenseButton]}
          onPress={() => {
            setTransactionType('Expense');
            setSelectedRecord(null);
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, styles.incomeButton]}
          onPress={() => {
            setTransactionType('Income');
            setSelectedRecord(null);
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Add Income</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={() => setShowAllDetails(!showAllDetails)} 
        style={styles.showMoreButton}
      >
        <Text style={styles.showMoreText}>{showAllDetails ? 'Show Less' : 'Show More'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  backArrow:{
    height:32,
    width:48,
    backgroundColor: '#FFFECB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginTop: 14,
    paddingBottom: 1,
    paddingHorizontal: 2,
    borderRadius: 3,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#37AFE1',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
    paddingVertical: 12,
    color: '#fff',
  },
  sectionContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1, 
    borderColor: '#ddd', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginleft: 20,
  },

  dashboardLink: {
    fontSize: 16,
    color: '#37AFE1',
    marginTop: 10,
  },
  profitText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lossText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
  },
  profit: {
    color: 'green',
  },
  loss: {
    color: 'red',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderBottomColor: '#ddd',
  },
  tableHeaderCell: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 120,  
    paddingHorizontal: 5,
    paddingVertical:10,
  },
  tableRowContent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordsContainer:{
    paddingVertical: 10,
  },
  tableRow: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  tableCell: {
    fontSize: 16,
    textAlign: 'center',
    width: 120, 
    paddingHorizontal:5,
    marginHorizontal:0,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginLeft:40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#37AFE1',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  transactionDetails: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1, 
    borderColor: '#ddd', 
  },
  showMoreButton: {
    paddingVertical: 40,
    alignItems: 'center',
   
  },
  showMoreText: {
    color: '#37AFE1',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:30,
  },
  addButton: {
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  expenseButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 4,
  },
  incomeButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 12,
    margin: 4,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize:14,
    fontWeight: 'bold',
    
  },
});

export default Inventory;
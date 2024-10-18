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
} from 'react-native';
import axios from 'axios'

const Inventory = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [transactionType, setTransactionType] = useState('Expense');
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false); 


  const addTransaction = async () => {
    const record = {
      productName,
      quantity,
      cost,
      type: transactionType,
    };
  
    try {
      if (selectedRecord) {
        const response = await axios.put(`http://192.168.43.60:5050/api/v1/inventory/update/${selectedRecord._id}`, record); 
        if (transactionType === 'Expense') {
          setExpenses(expenses.map((item) => (item._id === selectedRecord._id ? response.data : item)));
        } else {
          setIncome(income.map((item) => (item._id === selectedRecord._id ? response.data : item)));
        }
      } else {
        const response = await axios.post('http://192.168.43.60:5050/api/v1/inventory/create', record); 
        if (transactionType === 'Expense') {
          setExpenses([...expenses, response.data]);
        } else {
          setIncome([...income, response.data]);
        }
      }
    } catch (error) {
      console.error('Error adding/updating transaction:', error);
    }
  
    resetInputs();
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://192.168.43.60:5050/api/v1/inventory/get-all');
        console.log('Fetched records:', response.data); 
        setExpenses(response.data.filter(item => item.type === 'Expense'));
        setIncome(response.data.filter(item => item.type === 'Income'));
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
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

  const calculateProfitOrLoss = () => {
    return calculateTotalIncome() - calculateTotalExpense();
  };

  const profitOrLoss = calculateProfitOrLoss();
  const profitOrLossStyle = profitOrLoss >= 0 ? styles.profitText : styles.lossText;
  const profitOrLossText = profitOrLoss >= 0 ? 'Profit' : 'Loss';


  const renderRecord = ({ item, index }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>{item.productName}</Text>
      <Text style={styles.tableCell}>{item.quantity}</Text>
      <Text style={[styles.tableCell, { color: item.type === 'Income' ? 'green' : 'red' }]}>{item.cost}</Text>
      <Text style={[styles.tableCell, { color: item.type === 'Income' ? 'green' : 'red' }]}>{item.type}</Text>
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
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const visibleRecords = showAllDetails ? [...expenses, ...income] : [...expenses, ...income].slice(0, 5);

  return (
    <ScrollView style={styles.container}>
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
        />
      </View>

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
        />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#57c7c8',
    marginBottom: 16,
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
  },

  dashboardLink: {
    fontSize: 16,
    color: '#007bff',
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
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderCell: {
    flex: 1,
    paddingLeft: 15,
    paddingTop:8,
    fontSize:8.5,
    fontWeight:'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingTop: 1,
    paddingBottom: 1,
    paddingHorizontal: 10,
    borderRadius: 3,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 3,
  },
  editButtonText: {
    color: '#fff',
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
    backgroundColor: 'blue',
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
    borderWidth: 1, // Add border width
    borderColor: '#ddd', // Border color
  },
  showMoreButton: {
    paddingVertical: 40,
    alignItems: 'center',
   
  },
  showMoreText: {
    color: '#007bff',
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
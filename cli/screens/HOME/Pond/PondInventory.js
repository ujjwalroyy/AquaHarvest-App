import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PondInventory = ({navigation, route}) => {
  const { pondId, pondName } = route.params;  
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('kg');
  const [cost, setCost] = useState('');
  const [remark, setRemark] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isExpense, setIsExpense] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState('');

  const apiUrl = "http://192.168.43.60:5050/api/v1/expense-income";

  // Fetch token and records on load
  useEffect(() => {
    const getTokenAndFetchRecords = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          fetchRecords(storedToken);  
        }
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };
    getTokenAndFetchRecords();
  }, [isExpense, cost]);

  const fetchRecords = async (authToken) => {
    try {
      const endpoint = isExpense ? `/expense/pond/${pondId}` : `/income/pond/${pondId}`;
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const { data } = response;
      console.log('Fetched Data ----------------------------> ', data); 

      if (isExpense) {
        setExpenses(data);
      } else {
        setIncome(data);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  const addOrUpdateRecord = async () => {
    const record = { pondId, productName, quantity: `${quantity} ${quantityUnit}`, cost, remark, date: date.toDateString() };

    try {
      if (editingId !== null) {
        const endpoint = isExpense ? `/expense/${editingId}` : `/income/${editingId}`;
        const updatedRecord = await axios.put(`${apiUrl}${endpoint}`, record, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (isExpense) {
          setExpenses(expenses.map(item => item._id === editingId ? updatedRecord.data : item)); 
        } else {
          setIncome(income.map(item => item._id === editingId ? updatedRecord.data : item)); 
        }
        setEditingId(null);
      } else {
        const endpoint = isExpense ? '/expense' : '/income';
        await axios.post(`${apiUrl}${endpoint}`, record, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchRecords(token);
      }
      clearForm();
    } catch (error) {
      console.error('Failed to add or update record:', error);
    }
  };

  const clearForm = () => {
    setProductName('');
    setQuantity('');
    setQuantityUnit('kg');
    setCost('');
    setRemark('');
    setDate(new Date());
    setEditingId(null);
  };

  const handleEditRecord = (id) => {
    const record = isExpense ? expenses.find(item => item._id === id) : income.find(item => item._id === id);
    if (record) {
      const [qty, unit] = record.quantity.split(' ');
      setProductName(record.productName);
      setQuantity(qty);
      setQuantityUnit(unit);
      setCost(record.cost);
      setRemark(record.remark);
      setDate(new Date(record.date));
      setEditingId(record._id); 
    }
  };

  const calculateTotalExpense = () => expenses.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  const calculateTotalIncome = () => income.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  const calculateProfitOrLoss = () => calculateTotalIncome() - calculateTotalExpense();

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const renderRecord = ({ item, index }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>{item.productName}</Text>
      <Text style={styles.tableCell}>{item.quantity}</Text>
      <Text style={styles.tableCell}>{item.cost}</Text>
      <Text style={styles.tableCell}>{item.remark}</Text>
      <Text style={styles.tableCell}>{item.date}</Text>
      <TouchableOpacity onPress={() => handleEditRecord(item._id)} style={styles.editButton}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const profitOrLoss = calculateProfitOrLoss();
  const profitOrLossStyle = profitOrLoss >= 0 ? styles.profit : styles.loss;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Text>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Pond Inventory</Text>
      
      <Text style={styles.sectionTitle}>{isExpense ? "Add Expense" : "Add Income"}</Text>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
        />
        <View style={styles.quantityContainer}>
          <TextInput
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.quantityInput}
          />
          <Picker
            selectedValue={quantityUnit}
            onValueChange={(itemValue) => setQuantityUnit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="Ton" value="ton" />
          </Picker>
        </View>
        <TextInput
          placeholder="Cost (Rupees)"
          value={cost}
          onChangeText={(text) => {
            console.log('Updated Cost:', text); 
            setCost(text);
          }}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Remark"
          value={remark}
          onChangeText={setRemark}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>Date: {date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Button title={editingId !== null ? "Update" : "Submit"} onPress={addOrUpdateRecord} />
      </View>

      <View style={styles.verticalDivider}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>#</Text>
          <Text style={styles.tableHeaderCell}>Product Name</Text>
          <Text style={styles.tableHeaderCell}>Quantity</Text>
          <Text style={styles.tableHeaderCell}>Cost</Text>
          <Text style={styles.tableHeaderCell}>Remark</Text>
          <Text style={styles.tableHeaderCell}>Date</Text>
          <Text style={styles.tableHeaderCell}>Actions</Text>
        </View>
        <FlatList
          data={isExpense ? expenses : income}
          renderItem={renderRecord}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Expense: ₹{calculateTotalExpense().toFixed(2)}</Text>
        <Text style={styles.totalText}>Total Income: ₹{calculateTotalIncome().toFixed(2)}</Text>
      </View>

      <View style={profitOrLossStyle}>
        <Text style={styles.profitOrLossText}>Profit/Loss: ₹{profitOrLoss.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.expenseButton} onPress={() => setIsExpense(true)}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.passbookButton} onPress={() => navigation.navigate('PassbookInventory', { expenses, income })}>
          <Text style={styles.buttonText}>Passbook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.incomeButton} onPress={() => setIsExpense(false)}>
          <Text style={styles.buttonText}>Add Income</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  backArrow: {
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 4,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 4,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  picker: {
    width: 100,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dcdcdc',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom:30,
  },
  expenseButton: {
    backgroundColor: '#f28f8f',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  passbookButton: {
    backgroundColor: '#57c7c8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  incomeButton: {
    backgroundColor: '#8bf2a8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalContainer: {
    marginVertical: 11,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profit: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 4,
    marginVertical: 16,
  },
  loss: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 4,
    marginVertical: 16,
  },
  profitOrLossText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default PondInventory;
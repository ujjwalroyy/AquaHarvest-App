import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PondInventory = ({ navigation, route }) => {
  const { pondId, pondName } = route.params;
  const [records, setRecords] = useState({ expenses: [], income: [] });
  const [formState, setFormState] = useState({
    productName: '',
    quantity: '',
    quantityUnit: 'kg',
    cost: '',
    remark: '',
    date: new Date(),
    editingId: null,
  });
  const [isExpense, setIsExpense] = useState(true);
  const [token, setToken] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, []);

  const fetchRecords = async (authToken) => {
    setLoading(true);
    try {
      const endpoint = isExpense ? `/expense/pond/${pondId}` : `/income/pond/${pondId}`;
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setRecords((prev) => ({ ...prev, [isExpense ? 'expenses' : 'income']: response.data }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to fetch records');
      console.error('Failed to fetch records:', error);
    }
  };

  const addOrUpdateRecord = async () => {
    const record = { pondId, ...formState, date: formState.date.toDateString() };

    try {
      setLoading(true);
      const endpoint = formState.editingId ? 
        (isExpense ? `/expense/${formState.editingId}` : `/income/${formState.editingId}`) :
        (isExpense ? '/expense' : '/income');

      const method = formState.editingId ? axios.put : axios.post;
      await method(`${apiUrl}${endpoint}`, record, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchRecords(token);
      clearForm();
    } catch (error) {
      setLoading(false);
      setError('Failed to add or update record');
      console.error('Failed to add or update record:', error);
    }
  };

  const clearForm = () => {
    setFormState({
      productName: '',
      quantity: '',
      quantityUnit: 'kg',
      cost: '',
      remark: '',
      date: new Date(),
      editingId: null,
    });
  };

  const handleEditRecord = (id) => {
    const record = isExpense ? records.expenses.find(item => item._id === id) : records.income.find(item => item._id === id);
    if (record) {
      const [qty, unit] = record.quantity.split(' ');
      setFormState({
        productName: record.productName,
        quantity: qty,
        quantityUnit: unit,
        cost: record.cost,
        remark: record.remark,
        date: new Date(record.date),
        editingId: record._id,
      });
    }
  };

  const calculateTotal = (type) => {
    return records[type].reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  };

  const profitOrLoss = useMemo(() => {
    return calculateTotal('income') - calculateTotal('expenses');
  }, [records]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormState((prev) => ({ ...prev, date: selectedDate }));
    }
  };

  const renderRecord = useCallback(({ item, index }) => (
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
  ), [records]);

  const profitOrLossStyle = profitOrLoss >= 0 ? styles.profit : styles.loss;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Text>← Back</Text>
      </TouchableOpacity>
  
      {/* Fixed Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pond Inventory</Text>
      </View>
  
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>{isExpense ? "Add Expense" : "Add Income"}</Text>
  
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Product Name"
            value={formState.productName}
            onChangeText={(text) => setFormState((prev) => ({ ...prev, productName: text }))}
            style={styles.input}
          />
          <View style={styles.quantityContainer}>
            <TextInput
              placeholder="Quantity"
              value={formState.quantity}
              onChangeText={(text) => setFormState((prev) => ({ ...prev, quantity: text }))}
              keyboardType="numeric"
              style={styles.quantityInput}
            />
            <Picker
              selectedValue={formState.quantityUnit}
              onValueChange={(itemValue) => setFormState((prev) => ({ ...prev, quantityUnit: itemValue }))}
              style={styles.picker}
            >
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="Ton" value="ton" />
            </Picker>
          </View>
          <TextInput
            placeholder="Cost (Rupees)"
            value={formState.cost}
            onChangeText={(text) => setFormState((prev) => ({ ...prev, cost: text }))}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Remark"
            value={formState.remark}
            onChangeText={(text) => setFormState((prev) => ({ ...prev, remark: text }))}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>Date: {formState.date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formState.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Button title={formState.editingId ? "Update" : "Submit"} onPress={addOrUpdateRecord} />
        </View>
  
        {loading && <Text>Loading...</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
  
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
            data={isExpense ? records.expenses : records.income}
            renderItem={renderRecord}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
  
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Expense: ₹{calculateTotal('expenses').toFixed(2)}</Text>
          <Text style={styles.totalText}>Total Income: ₹{calculateTotal('income').toFixed(2)}</Text>
        </View>
  
        <View style={profitOrLossStyle}>
          <Text style={styles.profitOrLossText}>Profit/Loss: ₹{profitOrLoss.toFixed(2)}</Text>
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.expenseButton} onPress={() => setIsExpense(true)}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.passbookButton} onPress={() => navigation.navigate('PassbookInventory', { expenses: records.expenses, income: records.income })}>
            <Text style={styles.buttonText}>Passbook</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.incomeButton} onPress={() => setIsExpense(false)}>
            <Text style={styles.buttonText}>Add Income</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#f8f8f8', // Adjust as needed
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Adjust as needed
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
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
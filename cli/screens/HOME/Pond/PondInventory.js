import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const PondInventory = ({ navigation, route }) => {
  const { pondId, pondName } = route.params;
  const [records, setRecords] = useState({ expenses: [], income: [] });
  const [formState, setFormState] = useState({
    productName: "",
    quantity: "",
    quantityUnit: "kg",
    cost: "",
    remark: "",
    date: new Date(),
    editingId: null,
  });
  const [isExpense, setIsExpense] = useState(true);
  const [token, setToken] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = "http://192.168.43.60:5050/api/v1/expense-income";

  useEffect(() => {
    const getTokenAndFetchRecords = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          fetchRecords(storedToken);
        }
      } catch (error) {
        console.error("Failed to retrieve token:", error);
      }
    };
    getTokenAndFetchRecords();
  }, [isExpense]);

  const fetchRecords = async (authToken) => {
    setLoading(true);
    try {
      const endpoint = isExpense
        ? `/expense/pond/${pondId}`
        : `/income/pond/${pondId}`;
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setRecords((prev) => ({
        ...prev,
        [isExpense ? "expenses" : "income"]: response.data,
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch records");
      console.error("Failed to fetch records:", error);
    }
  };

  const addOrUpdateRecord = async () => {
    const record = {
      pondId,
      ...formState,
      date: formState.date.toDateString(),
    };

    try {
      setLoading(true);
      const endpoint = formState.editingId
        ? isExpense
          ? `/${formState.editingId}`
          : `/${formState.editingId}`
        : isExpense
          ? "/expense"
          : "/income";

      const method = formState.editingId ? axios.put : axios.post;
      await method(`${apiUrl}${endpoint}`, record, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchRecords(token);
      clearForm();
    } catch (error) {
      setLoading(false);
      setError("Failed to add or update record");
      console.error("Failed to add or update record:", error);
    }
  };

  const clearForm = () => {
    setFormState({
      productName: "",
      quantity: "",
      quantityUnit: "kg",
      cost: "",
      remark: "",
      date: new Date(),
      editingId: null,
    });
  };

  const handleEditRecord = (id) => {
    const record = isExpense
      ? records.expenses.find((item) => item._id === id)
      : records.income.find((item) => item._id === id);
    if (record) {
      const [qty, unit] = record.quantity.split(" ");
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
    return records[type].reduce(
      (sum, item) => sum + parseFloat(item.cost || 0),
      0
    );
  };

  const profitOrLoss = useMemo(() => {
    return calculateTotal("income") - calculateTotal("expenses");
  }, [records]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormState((prev) => ({ ...prev, date: selectedDate }));
    }
  };

  const renderRecord = useCallback(({ item, index }) => (
    <View style={styles.tableRow}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableRowContent}>
          <Text style={styles.tableCell}>{index + 1}</Text>
          <Text style={styles.tableCell}>{item.productName}</Text>
          <Text style={styles.tableCell}>{item.quantity}</Text>
          <Text style={styles.tableCell}>{item.cost}</Text>
          <Text style={styles.tableCell}>{item.remark}</Text>
          <Text style={styles.tableCell}>{new Date(item.date).toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => handleEditRecord(item._id)} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  ), [records]);

  const profitOrLossStyle = profitOrLoss >= 0 ? styles.profit : styles.loss;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
      <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pond Inventory - {pondName}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, isExpense ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setIsExpense(true)}
        >
          <Text style={styles.tabText}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !isExpense ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setIsExpense(false)}
        >
          <Text style={styles.tabText}>Income</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>{isExpense ? "Add Expense" : "Add Income"}</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder={isExpense ? "Expense Product Name" : "Income Product Name"}
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

  

<View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <View style={styles.tableRowContent}>
          <Text style={styles.tableHeaderText}>S.no</Text>
          <Text style={styles.tableHeaderText}>Product</Text>
          <Text style={styles.tableHeaderText}>Quantity</Text>
          <Text style={styles.tableHeaderText}>Cost</Text>
          <Text style={styles.tableHeaderText}>Remark</Text>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Actions</Text>
        </View>

        <FlatList
          data={isExpense ? records.expenses : records.income}
          renderItem={renderRecord}  
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.recordsContainer}
        />
      </View>
    </ScrollView>
  </View>

  <Text style={[styles.profitLossText, profitOrLossStyle]}>
    {isExpense ? 
        `Total Expenses: ₹${calculateTotal('expenses')}` : 
        `Total Income: ₹${calculateTotal('income')}`
    }
</Text>
<Text style={profitOrLossStyle}>
    {profitOrLoss >= 0 ? 
        `Profit: ₹${profitOrLoss}` : 
        `Loss: ₹${Math.abs(profitOrLoss)}`
    }
</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backArrow: {
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
 
  titleContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#37AFE1',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
    paddingVertical: 12,
    paddingLeft:84,
    paddingRight:84,
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    backgroundColor: '#4CC9FE',
  },
  inactiveTab: {
    backgroundColor: '#d0d0d0',
  },
  tabText: {
    fontSize: 18,
    color: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
   fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    paddingHorizontal: 5, 
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 120,  
    paddingHorizontal: 5,
  },
  recordsContainer: {
    paddingVertical: 10,
  },
 
  tableRow: {
   backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  tableRowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 16,
    textAlign: 'center',
    width: 120,  
    paddingHorizontal: 5,
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
  profitLossText: {
    fontSize: 18,
    marginVertical: 10,
  },
  profit: {
    color: 'green',
  },
  loss: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default PondInventory
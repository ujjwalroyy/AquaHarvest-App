// PondsDetail.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPondDetails = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      const response = await axios.get(
        "https://fram-khatak.onrender.com/api/v1/expense-income/calculate",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
  } catch (error) {
    console.error('Error fetching pond details:', error);
    throw new Error('Failed to fetch pond details');
  }
};

const fetchPonds = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert('Error', 'No token found. Please log in again.');
      return;
    }
    const response = await axios.get(
      "https://fram-khatak.onrender.com/api/v1/pond/getPonds",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPonds(response.data);
  } catch (error) {
    console.error('Error fetching ponds:', error);
    Alert.alert('Error', 'Failed to fetch pond data.');
  }
};

const PondsDetail = () => {
  const [pondDetails, setPondDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);

  useEffect(() => {
    const fetchPondDetails = async () => {
      try {
        const response = await getPondDetails();
        setPondDetails(response.ponds);
        setTotalIncome(response.totalIncome);
        setTotalExpenses(response.totalExpenses);
        setProfitOrLoss(response.profitOrLoss);

        console.log('Fetched Pond Details:', response);
        console.log('Total Income:', response.totalIncome);
        console.log('Total Expenses:', response.totalExpenses);
        console.log('Profit or Loss:', response.profitOrLoss);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch pond details:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchPondDetails();
  }, []);

  const renderPondDetail = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.pondName}</Text>
      <Text style={styles.cell}>{item.expense.toFixed(2)}</Text>
      <Text style={styles.cell}>{item.income.toFixed(2)}</Text>
      <Text style={[styles.cell, item.profitOrLoss >= 0 ? styles.profit : styles.loss]}>
        {item.profitOrLoss.toFixed(2)}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pond Details</Text>
      <Text>Total Income: {totalIncome.toFixed(2)}</Text>
      <Text>Total Expenses: {totalExpenses.toFixed(2)}</Text>
      <Text>Profit/Loss: {profitOrLoss.toFixed(2)}</Text>

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Pond</Text>
        <Text style={styles.headerCell}>Expense</Text>
        <Text style={styles.headerCell}>Income</Text>
        <Text style={styles.headerCell}>Profit/Loss</Text>
      </View>
      <FlatList
        data={pondDetails}
        renderItem={renderPondDetail}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
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
    marginBottom: 16,
    textAlign: 'center',
    color: '#ff5722',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#dcdcdc',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  profit: {
    color: '#388e3c',
  },
  loss: {
    color: '#d32f2f',
  },
});

export default PondsDetail;
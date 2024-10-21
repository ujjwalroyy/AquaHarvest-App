import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const PassbookInventory = ({ route, navigation }) => {
  const { expenses, income } = route.params;
  const [filteredData, setFilteredData] = useState([...expenses, ...income]);
  const [filterType, setFilterType] = useState('date');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate, isStartDate) => {
    if (isStartDate) {
      setStartDate(selectedDate || startDate);
      setShowStartDatePicker(false);
    } else {
      setEndDate(selectedDate || endDate);
      setShowEndDatePicker(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...expenses, ...income];
    const now = new Date();

    switch (filterType) {
      case 'pastDays':
        const pastDaysDate = new Date();
        pastDaysDate.setDate(now.getDate() - 30); 
        filtered = filtered.filter(item => new Date(item.date) >= pastDaysDate);
        break;
      case 'last3Months':
        const last3MonthsDate = new Date();
        last3MonthsDate.setMonth(now.getMonth() - 3); 
        filtered = filtered.filter(item => new Date(item.date) >= last3MonthsDate);
        break;
      case 'last6Months':
        const last6MonthsDate = new Date();
        last6MonthsDate.setMonth(now.getMonth() - 6); 
        filtered = filtered.filter(item => new Date(item.date) >= last6MonthsDate);
        break;
      case 'custom':
        filtered = filtered.filter(item => new Date(item.date) >= startDate && new Date(item.date) <= endDate);
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  };

  const calculateFilteredProfitOrLoss = () => {
    const totalExpense = filteredData.filter(item => item.type === 'expense')
                                     .reduce((sum, item) => sum - parseFloat(item.cost || 0), 0); // Expenses are negative
    const totalIncome = filteredData.filter(item => item.type === 'income')
                                    .reduce((sum, item) => sum + parseFloat(item.cost || 0), 0); // Incomes are positive
    return totalIncome + totalExpense; 
  };

  const renderRecord = ({ item, index }) => {
    const sign = item.type === 'expense' ? '-' : '+';
    return (
      <View style={[styles.tableRow, item.type === 'expense' ? styles.expenseRow : styles.incomeRow]}>
        <Text style={styles.tableCell}>{index + 1}</Text>
        <Text style={styles.tableCell}>{item.productName}</Text>
        <Text style={styles.tableCell}>{item.quantity}</Text>
        <Text style={styles.tableCell}>{sign}₹{item.cost}</Text>
        <Text style={styles.tableCell}>{item.remark}</Text>
        <Text style={styles.tableCell}>{item.date}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Text>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Passbook Inventory</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilterType('pastDays')} style={styles.filterOption}>
          <Text>Past 30 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterType('last3Months')} style={styles.filterOption}>
          <Text>Last 3 Months</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterType('last6Months')} style={styles.filterOption}>
          <Text>Last 6 Months</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterType('custom')} style={styles.filterOption}>
          <Text>Custom Range</Text>
        </TouchableOpacity>
        {filterType === 'custom' && (
          <>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
              <Text>Start Date: ${startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, true)}
              />
            )}

            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
              <Text>End Date: ${endDate.toDateString()}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, false)}
              />
            )}
          </>
        )}
        <TouchableOpacity onPress={applyFilter} style={styles.applyFilterButton}>
          <Text>Apply Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, styles.headerExpense]}>#</Text>
        <Text style={[styles.tableHeaderCell, styles.headerProductName]}>Product Name</Text>
        <Text style={[styles.tableHeaderCell, styles.headerQuantity]}>Quantity</Text>
        <Text style={[styles.tableHeaderCell, styles.headerCost]}>Cost</Text>
        <Text style={[styles.tableHeaderCell, styles.headerRemark]}>Remark</Text>
        <Text style={[styles.tableHeaderCell, styles.headerDate]}>Date</Text>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderRecord}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text
        style={[
          styles.totalText,
          calculateFilteredProfitOrLoss() >= 0
            ? styles.profit
            : styles.loss
        ]}
      >
        Profit/Loss: ₹${calculateFilteredProfitOrLoss().toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backArrow: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterOption: {
    padding: 10,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#ddd',
    marginVertical: 10,
    borderRadius: 5,
  },
  applyFilterButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    paddingVertical: 8,
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerExpense: {
    backgroundColor: '#E0F7FA', 
  },
  headerProductName: {
    backgroundColor: '#FCE4EC', 
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  expenseRow: {
    backgroundColor: '#E0F7FA', 
  },
  incomeRow: {
    backgroundColor: '#FCE4EC', 
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  profit: {
    color: 'green',
  },
  loss: {
    color: 'red',
  },
});


export default PassbookInventory;
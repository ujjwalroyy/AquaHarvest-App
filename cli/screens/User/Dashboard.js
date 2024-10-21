import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import {Ionicons } from '@expo/vector-icons';


const Dashboard = ({ route, navigation }) => {
  const { profitOrLoss: initialProfitOrLoss, income: initialIncome, expenses: initialExpenses } = route.params;

  // Ensure numbers are properly set
  const totalIncome = initialIncome || 0;
  const totalExpenses = initialExpenses || 0;
  const profitOrLoss = initialProfitOrLoss || 0;

  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to showing all bars

  const getChartData = () => {
    switch (selectedCategory) {
      case 'Income':
        return [totalIncome]; // Single value for income
      case 'Expenses':
        return [totalExpenses]; // Single value for expenses
      case 'ProfitLoss':
        return [profitOrLoss]; // Single value for profit/loss
      default:
        return [totalIncome, totalExpenses, profitOrLoss]; // Show all by default
    }
  };

  const getChartLabels = () => {
    switch (selectedCategory) {
      case 'Income':
        return ['Income']; // Label for income
      case 'Expenses':
        return ['Expenses']; // Label for expenses
      case 'ProfitLoss':
        return ['Profit/Loss']; // Label for profit/loss
      default:
        return ['Income', 'Expenses', 'Profit/Loss']; // Labels for all
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity> */}

<View style={styles.titleContainer}>
<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
      <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
        <Text style={styles.title}> Farm Dashboard</Text>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Income: ₹{totalIncome}</Text>
        <Text style={styles.summaryText}>Total Expenses: ₹{totalExpenses}</Text>
        <Text
          style={[
            styles.summaryText,
            profitOrLoss >= 0 ? styles.profitText : styles.lossText,
          ]}
        >
          {profitOrLoss >= 0 ? `Profit: ₹${profitOrLoss}` : `Loss: ₹${Math.abs(profitOrLoss)}`}
        </Text>
      </View>

      {/* Buttons for selecting categories */}
      <View style={styles.buttonContainer}>
        {['Income', 'Expenses', 'ProfitLoss', 'All'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedButton]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.buttonText}>{`View ${category}`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bar Chart displaying Income, Expenses, and Profit/Loss */}
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: getChartLabels(), // Updated labels based on selected category
            datasets: [
              {
                data: getChartData(), // Updated data based on selected category
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // Responsive width
          height={220} // Adjust the height if necessary
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: '#f4f4f4',
            backgroundGradientFrom: '#f4f4f4',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#57c7c8',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
   fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#37AFE1',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
    paddingVertical:12,
    paddingLeft:80,
    paddingRight:80,
    color: '#fff',
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
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 10,
  },
  profitText: {
    color: 'green',
    fontWeight: 'bold',
  },
  lossText: {
    color: 'red',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#9e9e9e',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  selectedButton: {
    backgroundColor: '#4caf50', // Highlight selected button
  },
});

export default Dashboard;

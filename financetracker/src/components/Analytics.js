import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = ({ transactions }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  // Get all available years from transactions
  const years = [...new Set(transactions.map(t => t.date.getFullYear()))].sort((a, b) => b - a);
  
  // Get month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter transactions based on selected time range
  const filterTransactionsByTimeRange = () => {
    const currentDate = new Date();
    let startDate, endDate;

    if (timeRange === 'week') {
      // Get the Monday of current week
      const firstDay = new Date(currentDate);
      const day = firstDay.getDay() || 7;
      if (day !== 1) {
        firstDay.setHours(-24 * (day - 1));
      }
      firstDay.setHours(0, 0, 0, 0);
      
      startDate = firstDay;
      endDate = new Date(firstDay);
      endDate.setDate(firstDay.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (timeRange === 'month') {
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    } else if (timeRange === 'year') {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  };

  const filteredTransactions = filterTransactionsByTimeRange();

  // Calculate total income and expenses
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Prepare data for charts
  const prepareLineChartData = () => {
    if (timeRange === 'week') {
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const currentDate = new Date();
      const firstDay = new Date(currentDate);
      const day = firstDay.getDay() || 7;
      if (day !== 1) {
        firstDay.setHours(-24 * (day - 1));
      }
      firstDay.setHours(0, 0, 0, 0);
      
      return dayNames.map((dayName, index) => {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + index);
        
        const dayIncome = filteredTransactions
          .filter(t => t.type === 'income' && t.date.getDate() === date.getDate() && 
                  t.date.getMonth() === date.getMonth() && t.date.getFullYear() === date.getFullYear())
          .reduce((sum, t) => sum + t.amount, 0);
        
        const dayExpense = filteredTransactions
          .filter(t => t.type === 'expense' && t.date.getDate() === date.getDate() && 
                  t.date.getMonth() === date.getMonth() && t.date.getFullYear() === date.getFullYear())
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: dayName,
          income: dayIncome,
          expense: dayExpense,
          balance: dayIncome - dayExpense
        };
      });
    } else if (timeRange === 'month') {
      // Get number of days in the month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month, day);
        
        const dayIncome = filteredTransactions
          .filter(t => t.type === 'income' && t.date.getDate() === day)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const dayExpense = filteredTransactions
          .filter(t => t.type === 'expense' && t.date.getDate() === day)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: day.toString(),
          income: dayIncome,
          expense: dayExpense,
          balance: dayIncome - dayExpense
        };
      });
    } else if (timeRange === 'year') {
      return monthNames.map((name, index) => {
        const monthIncome = filteredTransactions
          .filter(t => t.type === 'income' && t.date.getMonth() === index)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const monthExpense = filteredTransactions
          .filter(t => t.type === 'expense' && t.date.getMonth() === index)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: name.substring(0, 3),
          income: monthIncome,
          expense: monthExpense,
          balance: monthIncome - monthExpense
        };
      });
    }
    
    return [];
  };

  const lineChartData = prepareLineChartData();

  // Prepare category data for pie chart
  const preparePieChartData = () => {
    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    return Object.keys(expensesByCategory).map(category => ({
      name: category,
      value: expensesByCategory[category]
    }));
  };

  const pieChartData = preparePieChartData();
  const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#F97316', '#06B6D4', '#A3E635', '#6366F1'];

  // Prepare income vs expense data for bar chart
  const prepareBarChartData = () => {
    if (timeRange === 'week') {
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const currentDate = new Date();
      const firstDay = new Date(currentDate);
      const day = firstDay.getDay() || 7;
      if (day !== 1) {
        firstDay.setHours(-24 * (day - 1));
      }
      firstDay.setHours(0, 0, 0, 0);
      
      return dayNames.map((dayName, index) => {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + index);
        
        const dayIncome = filteredTransactions
          .filter(t => t.type === 'income' && t.date.getDate() === date.getDate() && 
                  t.date.getMonth() === date.getMonth() && t.date.getFullYear() === date.getFullYear())
          .reduce((sum, t) => sum + t.amount, 0);
        
        const dayExpense = filteredTransactions
          .filter(t => t.type === 'expense' && t.date.getDate() === date.getDate() && 
                  t.date.getMonth() === date.getMonth() && t.date.getFullYear() === date.getFullYear())
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: dayName.substring(0, 3),
          income: dayIncome,
          expense: dayExpense
        };
      });
    } else if (timeRange === 'month') {
      // Group by week for monthly view
      return [1, 2, 3, 4, 5].map(weekNum => {
        const weekStart = (weekNum - 1) * 7 + 1;
        const weekEnd = Math.min(weekNum * 7, new Date(year, month + 1, 0).getDate());
        
        const weekIncome = filteredTransactions
          .filter(t => t.type === 'income' && t.date.getDate() >= weekStart && t.date.getDate() <= weekEnd)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const weekExpense = filteredTransactions
          .filter(t => t.type === 'expense' && t.date.getDate() >= weekStart && t.date.getDate() <= weekEnd)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: `Week ${weekNum}`,
          income: weekIncome,
          expense: weekExpense
        };
      });
    } else if (timeRange === 'year') {
      return monthNames.map((name, index) => {
        const monthIncome = filteredTransactions
          .filter(t => t.type === 'income' && t.date.getMonth() === index)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const monthExpense = filteredTransactions
          .filter(t => t.type === 'expense' && t.date.getMonth() === index)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: name.substring(0, 3),
          income: monthIncome,
          expense: monthExpense
        };
      });
    }
    
    return [];
  };

  const barChartData = prepareBarChartData();

  // Calculate top spending categories
  const getTopSpendingCategories = () => {
    const categories = {};
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const topCategories = getTopSpendingCategories();

  // Calculate spending trends
  const calculateSpendingTrends = () => {
    if (timeRange === 'month' || timeRange === 'week') {
      return null; // Not enough data for trends
    }
    
    const monthlyExpenses = monthNames.map((_, index) => {
      return filteredTransactions
        .filter(t => t.type === 'expense' && t.date.getMonth() === index)
        .reduce((sum, t) => sum + t.amount, 0);
    });
    
    // Calculate 3-month moving average
    const movingAverages = [];
    for (let i = 2; i < monthlyExpenses.length; i++) {
      const avg = (monthlyExpenses[i] + monthlyExpenses[i-1] + monthlyExpenses[i-2]) / 3;
      movingAverages.push({
        month: monthNames[i].substring(0, 3),
        average: avg.toFixed(2)
      });
    }
    
    return movingAverages;
  };

  const spendingTrends = calculateSpendingTrends();

  return (
    <div className="analytics-container" style={{
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      color: "#1E293B",
      backgroundColor: "#F8FAFC",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    }}>
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          .analytics-header {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 16px;
          }
          
          .analytics-header h2 {
            font-size: 28px;
            font-weight: 700;
            color: #1E293B;
            margin: 0;
            background: linear-gradient(90deg, #6366F1, #3B82F6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
          }
          
          .time-range-selector {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;
          }
          
          .selector-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .selector-group label {
            font-size: 14px;
            font-weight: 600;
            color: #64748B;
          }
          
          select {
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #CBD5E1;
            background-color: #FFFFFF;
            font-size: 14px;
            font-weight: 500;
            color: #334155;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }
          
          select:hover, select:focus {
            border-color: #6366F1;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
          }
          
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .card {
            background-color: #FFFFFF;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 8px;
            border: 1px solid #E2E8F0;
          }
          
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
          }
          
          .card h3 {
            font-size: 16px;
            font-weight: 600;
            color: #64748B;
            margin: 0;
          }
          
          .card p {
            font-size: 26px;
            font-weight: 700;
            margin: 0;
          }
          
          .positive {
            color: #16A34A;
          }
          
          .negative {
            color: #EF4444;
          }
          
          .charts-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .chart-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 24px;
          }
          
          .chart-card {
            background-color: #FFFFFF;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid #E2E8F0;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .full-width {
            grid-column: 1 / -1;
          }
          
          .chart-card h3 {
            font-size: 18px;
            font-weight: 600;
            color: #334155;
            margin: 0;
          }
          
          .chart-container {
            width: 100%;
            flex-grow: 1;
          }
          
          .no-data {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94A3B8;
            font-size: 16px;
            font-weight: 500;
          }
          
          .top-categories {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .category-item {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .category-rank {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #F1F5F9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            color: #334155;
          }
          
          .category-details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          
          .category-details h4 {
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            margin: 0;
          }
          
          .progress-container {
            height: 8px;
            background-color: #F1F5F9;
            border-radius: 4px;
            overflow: hidden;
          }
          
          .progress-bar {
            height: 100%;
            border-radius: 4px;
          }
          
          .category-amount {
            font-size: 16px;
            font-weight: 700;
            color: #334155;
            white-space: nowrap;
          }
          
          .recharts-default-tooltip {
            background-color: #FFFFFF !important;
            border: 1px solid #E2E8F0 !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
            padding: 12px !important;
          }
          
          .recharts-tooltip-label {
            font-weight: 600 !important;
            color: #334155 !important;
          }
          
          @media (max-width: 768px) {
            .summary-cards {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .chart-row {
              grid-template-columns: 1fr;
            }
            
            .analytics-header {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .time-range-selector {
              flex-wrap: wrap;
              justify-content: flex-start;
            }
          }
          
          @media (max-width: 480px) {
            .summary-cards {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="analytics-header">
        <h2>Financial Analytics</h2>
        <div className="time-range-selector">
          <div className="selector-group">
            <label>Time Range:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          {timeRange === 'month' && (
            <>
              <div className="selector-group">
                <label>Month:</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="month-select"
                >
                  {monthNames.map((name, index) => (
                    <option key={name} value={index}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="selector-group">
                <label>Year:</label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="year-select"
                >
                  {years.length > 0 ? (
                    years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))
                  ) : (
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  )}
                </select>
              </div>
            </>
          )}

          {timeRange === 'year' && (
            <div className="selector-group">
              <label>Year:</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="year-select"
              >
                {years.length > 0 ? (
                  years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                )}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h3>Income</h3>
          <p className="positive">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Expenses</h3>
          <p className="negative">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Balance</h3>
          <p className={balance >= 0 ? 'positive' : 'negative'}>
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3>Transactions</h3>
          <p>{filteredTransactions.length}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-row">
          <div className="chart-card">
            <h3>Income vs Expenses</h3>
            <div className="chart-container" style={{ height: '300px' }}>
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B' }} />
                    <YAxis tick={{ fill: '#64748B' }} />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No data available for the selected time range</div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <h3>Balance Trend</h3>
            <div className="chart-container" style={{ height: '300px' }}>
              {lineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B' }} />
                    <YAxis tick={{ fill: '#64748B' }} />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      name="Balance"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: '#6366F1', strokeWidth: 0, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No data available for the selected time range</div>
              )}
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-card">
            <h3>Expense Breakdown</h3>
            <div className="chart-container" style={{ height: '300px' }}>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No expense data available for the selected time range</div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <h3>Top Spending Categories</h3>
            {topCategories.length > 0 ? (
              <div className="top-categories">
                {topCategories.map((category, index) => (
                  <div key={category.category} className="category-item">
                    <div className="category-rank">{index + 1}</div>
                    <div className="category-details">
                      <h4>{category.category}</h4>
                      <div className="progress-container">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${(category.amount / topCategories[0].amount) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="category-amount">${category.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No expense data available for the selected time range</div>
            )}
          </div>
        </div>

        {timeRange === 'year' && spendingTrends && (
          <div className="chart-row">
            <div className="chart-card full-width">
              <h3>Spending Trends (3-Month Moving Average)</h3>
              <div className="chart-container" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={spendingTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fill: '#64748B' }} />
                    <YAxis tick={{ fill: '#64748B' }} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line
                      type="monotone"
                      dataKey="average"
                      name="3-Month Avg"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: '#F59E0B', strokeWidth: 0, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
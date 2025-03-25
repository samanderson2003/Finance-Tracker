import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaArrowUp, FaArrowDown, FaCalendarAlt, FaWallet, FaChartPie, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const Dashboard = ({ transactions, goals, reminders }) => {
  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Get upcoming reminders
  const today = new Date();
  const upcomingReminders = reminders
    .filter(r => r.dueDate > today)
    .sort((a, b) => a.dueDate - b.dueDate)
    .slice(0, 3);

  // Expense categories data for pie chart
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Monthly data for bar chart
  const currentYear = today.getFullYear();
  const monthlyData = Array(12).fill().map((_, i) => {
    const month = i;
    const monthIncome = transactions
      .filter(t => t.type === 'income' && t.date.getMonth() === month && t.date.getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthExpense = transactions
      .filter(t => t.type === 'expense' && t.date.getMonth() === month && t.date.getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: new Date(currentYear, month).toLocaleString('default', { month: 'short' }),
      income: monthIncome,
      expense: monthExpense
    };
  });

  // CSS Styles
  const styles = {
    dashboard: {
      padding: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    summaryCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      padding: '1.25rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
      overflow: 'hidden',
    },
    cardHover: {
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      }
    },
    balanceCard: {
      borderLeft: '4px solid #3b82f6',
    },
    incomeCard: {
      borderLeft: '4px solid #10b981',
    },
    expenseCard: {
      borderLeft: '4px solid #ef4444',
    },
    savingsCard: {
      borderLeft: '4px solid #f59e0b',
    },
    cardTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    cardValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '0.25rem',
    },
    cardTrend: {
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    positive: {
      color: '#10b981',
    },
    negative: {
      color: '#ef4444',
    },
    neutral: {
      color: '#6b7280',
    },
    dashboardRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    dashboardCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      padding: '1.25rem',
      height: '100%',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #f3f4f6',
    },
    cardHeaderTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    viewAll: {
      fontSize: '0.75rem',
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500',
    },
    transactionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    transactionItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#f9fafb',
      },
    },
    transactionIcon: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '0.5rem',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
    },
    incomeIcon: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
    },
    expenseIcon: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
    },
    transactionDetails: {
      flex: '1',
    },
    transactionTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.25rem',
    },
    transactionMeta: {
      fontSize: '0.75rem',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    transactionCategory: {
      padding: '0.125rem 0.5rem',
      borderRadius: '1rem',
      backgroundColor: '#f3f4f6',
      fontSize: '0.75rem',
    },
    transactionAmount: {
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    reminderList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    reminderItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s',
      border: '1px solid #f3f4f6',
      ':hover': {
        backgroundColor: '#f9fafb',
      },
    },
    reminderIcon: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
    },
    reminderDetails: {
      flex: '1',
    },
    reminderTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.25rem',
    },
    reminderMeta: {
      fontSize: '0.75rem',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    daysLeft: {
      padding: '0.125rem 0.5rem',
      borderRadius: '1rem',
      backgroundColor: '#f3f4f6',
      fontSize: '0.75rem',
      fontWeight: '500',
    },
    daysUrgent: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
    },
    daysWarning: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b',
    },
    daysNormal: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
    },
    chartContainer: {
      height: '300px',
      marginTop: '1rem',
    },
    noData: {
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '0.875rem',
      fontStyle: 'italic',
    },
  };

  // Helper function to get days left styling
  const getDaysLeftStyle = (daysLeft) => {
    if (daysLeft <= 3) {
      return { ...styles.daysLeft, ...styles.daysUrgent };
    } else if (daysLeft <= 7) {
      return { ...styles.daysLeft, ...styles.daysWarning };
    }
    return { ...styles.daysLeft, ...styles.daysNormal };
  };

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.title}>
        <FaChartLine /> Financial Dashboard
      </h2>
      
      <div style={styles.summaryCards}>
        <div style={{...styles.card, ...styles.balanceCard}}>
          <h3 style={styles.cardTitle}>
            <FaWallet /> Current Balance
          </h3>
          <p style={{
            ...styles.cardValue,
            color: balance >= 0 ? '#10b981' : '#ef4444'
          }}>
            ${balance.toFixed(2)}
          </p>
          <p style={styles.cardTrend}>
            <span style={balance >= 0 ? styles.positive : styles.negative}>
              {balance >= 0 ? 'Positive' : 'Negative'} balance
            </span>
          </p>
        </div>
        
        <div style={{...styles.card, ...styles.incomeCard}}>
          <h3 style={styles.cardTitle}>
            <FaArrowDown /> Total Income
          </h3>
          <p style={{...styles.cardValue, ...styles.positive}}>
            ${totalIncome.toFixed(2)}
          </p>
          <p style={styles.cardTrend}>
            <span>This period</span>
          </p>
        </div>
        
        <div style={{...styles.card, ...styles.expenseCard}}>
          <h3 style={styles.cardTitle}>
            <FaArrowUp /> Total Expenses
          </h3>
          <p style={{...styles.cardValue, ...styles.negative}}>
            ${totalExpenses.toFixed(2)}
          </p>
          <p style={styles.cardTrend}>
            <span>This period</span>
          </p>
        </div>
        
        <div style={{...styles.card, ...styles.savingsCard}}>
          <h3 style={styles.cardTitle}>
            <FaChartPie /> Savings Rate
          </h3>
          <p style={{...styles.cardValue, ...styles.neutral}}>
            {totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%
          </p>
          <p style={styles.cardTrend}>
            <span>Of total income</span>
          </p>
        </div>
      </div>

      <div style={styles.dashboardRow}>
        <div style={styles.dashboardCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardHeaderTitle}>
              <FaMoneyBillWave /> Recent Transactions
            </h3>
            <a href="#/transactions" style={styles.viewAll}>View All</a>
          </div>
          
          <div style={styles.transactionList}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map(t => (
                <div key={t.id} style={styles.transactionItem}>
                  <div style={{
                    ...styles.transactionIcon,
                    ...(t.type === 'income' ? styles.incomeIcon : styles.expenseIcon)
                  }}>
                    {t.type === 'income' ? <FaArrowDown /> : <FaArrowUp />}
                  </div>
                  <div style={styles.transactionDetails}>
                    <h4 style={styles.transactionTitle}>{t.description}</h4>
                    <div style={styles.transactionMeta}>
                      <span style={styles.transactionCategory}>{t.category}</span>
                      <span>{t.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{
                    ...styles.transactionAmount,
                    ...(t.type === 'income' ? styles.positive : styles.negative)
                  }}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noData}>No recent transactions</div>
            )}
          </div>
        </div>
        
        <div style={styles.dashboardCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardHeaderTitle}>
              <FaCalendarAlt /> Upcoming Payments
            </h3>
            <a href="#/reminders" style={styles.viewAll}>View All</a>
          </div>
          
          <div style={styles.reminderList}>
            {upcomingReminders.length > 0 ? (
              upcomingReminders.map(r => {
                const daysLeft = Math.ceil((r.dueDate - today) / (1000 * 60 * 60 * 24));
                return (
                  <div key={r.id} style={styles.reminderItem}>
                    <div style={styles.reminderIcon}>
                      <FaCalendarAlt />
                    </div>
                    <div style={styles.reminderDetails}>
                      <h4 style={styles.reminderTitle}>{r.title}</h4>
                      <div style={styles.reminderMeta}>
                        <span>${r.amount.toFixed(2)}</span>
                        <span>Due: {r.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={getDaysLeftStyle(daysLeft)}>
                      {daysLeft} days
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.noData}>No upcoming payments</div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.dashboardRow}>
        <div style={styles.dashboardCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardHeaderTitle}>
              <FaChartPie /> Expense Breakdown
            </h3>
          </div>
          
          <div style={styles.chartContainer}>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40} // Added innerRadius to create a donut chart
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false} // Removes the line connecting the label to the pie
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.noData}>No expense data to display</div>
            )}
          </div>
        </div>
        
        <div style={styles.dashboardCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardHeaderTitle}>
              <FaChartLine /> Monthly Overview - {currentYear}
            </h3>
          </div>
          
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{ 
                    borderRadius: '0.5rem',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import Dashboard from '../src/components/Dashboard';
import TransactionForm from '../src/components/TransactionForm';
import TransactionHistory from '../src/components/TransactionHistory';
import Analytics from '../src/components/Analytics';
import Goals from '../src/components/Goals';
import Reminders from '../src/components/Reminders';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch transactions
        const transactionQuery = query(
          collection(db, "transactions"),
          orderBy("date", "desc")
        );
        const transactionSnapshot = await getDocs(transactionQuery);
        const transactionList = transactionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));
        setTransactions(transactionList);

        // Fetch goals
        const goalSnapshot = await getDocs(collection(db, "goals"));
        const goalList = goalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          targetDate: doc.data().targetDate.toDate()
        }));
        setGoals(goalList);

        // Fetch reminders
        const reminderSnapshot = await getDocs(collection(db, "reminders"));
        const reminderList = reminderSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate.toDate()
        }));
        setReminders(reminderList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const docRef = await addDoc(collection(db, "transactions"), transaction);
      setTransactions([{ id: docRef.id, ...transaction }, ...transactions]);
      return true;
    } catch (error) {
      console.error("Error adding transaction: ", error);
      return false;
    }
  };

  const addGoal = async (goal) => {
    try {
      const docRef = await addDoc(collection(db, "goals"), goal);
      setGoals([{ id: docRef.id, ...goal }, ...goals]);
      return true;
    } catch (error) {
      console.error("Error adding goal: ", error);
      return false;
    }
  };

  const addReminder = async (reminder) => {
    try {
      const docRef = await addDoc(collection(db, "reminders"), reminder);
      setReminders([{ id: docRef.id, ...reminder }, ...reminders]);
      return true;
    } catch (error) {
      console.error("Error adding reminder: ", error);
      return false;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} goals={goals} reminders={reminders} />;
      case 'add-transaction':
        return <TransactionForm addTransaction={addTransaction} />;
      case 'transactions':
        return <TransactionHistory transactions={transactions} />;
      case 'analytics':
        return <Analytics transactions={transactions} />;
      case 'goals':
        return <Goals goals={goals} addGoal={addGoal} />;
      case 'reminders':
        return <Reminders reminders={reminders} addReminder={addReminder} />;
      default:
        return <Dashboard transactions={transactions} goals={goals} reminders={reminders} />;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <style>
        {`
          /* Global Styles & Variables */
          :root {
            --primary-color: #3a7bd5;
            --primary-light: #6facea;
            --primary-dark: #2c5e9e;
            --secondary-color: #00d09c;
            --secondary-light: #5ae9c5;
            --secondary-dark: #00a377;
            --bg-color: #f5f7fa;
            --sidebar-bg: #ffffff;
            --card-bg: #ffffff;
            --text-primary: #2d3748;
            --text-secondary: #718096;
            --border-color: #e2e8f0;
            --success-color: #48bb78;
            --warning-color: #f6ad55;
            --danger-color: #f56565;
            --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.6;
          }

          /* App Container */
          .app {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            padding: 16px 24px;
            box-shadow: var(--box-shadow);
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          .header h1 {
            font-size: 1.5rem;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          /* Main Content Area */
          .content {
            display: flex;
            flex: 1;
            height: calc(100vh - 60px);
          }

          /* Main Content */
          .main-content {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
            background-color: var(--bg-color);
          }

          /* Navigation Sidebar Styles */
          .sidebar {
            width: 280px;
            background: linear-gradient(to bottom, #ffffff, #f8f9fa);
            border-right: 1px solid rgba(0, 0, 0, 0.05);
            padding: 0;
            height: 100%;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
            overflow-y: auto;
            position: relative;
            z-index: 10;
          }

          /* User Info Section */
          .user-info {
            padding: 24px 20px;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #3a7bd5, #00d2ff);
            color: white;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
          }

          .user-info::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            z-index: 1;
          }

          .avatar {
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 15px;
            font-size: 18px;
            position: relative;
            z-index: 2;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }

          .user-info h3 {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            position: relative;
            z-index: 2;
            letter-spacing: 0.5px;
          }

          /* Navigation Links */
          .nav-links {
            list-style: none;
            padding: 0 15px;
            margin: 0;
          }

          .nav-links li {
            margin-bottom: 8px;
            border-radius: 10px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .nav-links li::before {
            content: '';
            position: absolute;
            left: -100%;
            top: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, rgba(58, 123, 213, 0.1), transparent);
            transition: all 0.4s ease;
            z-index: 1;
          }

          .nav-links li:hover::before {
            left: 0;
          }

          .nav-links li:hover {
            background-color: rgba(58, 123, 213, 0.05);
            transform: translateX(5px);
          }

          .nav-links li a,
          .nav-links li div,
          .nav-links li {
            padding: 14px 18px;
            display: flex;
            align-items: center;
            color: #4a5568;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            position: relative;
            z-index: 2;
            transition: all 0.3s ease;
          }

          .nav-links li.active {
            background: linear-gradient(90deg, #3a7bd5, #6fa1e0);
            color: white;
            box-shadow: 0 4px 10px rgba(58, 123, 213, 0.3);
          }

          .nav-links li.active::before {
            display: none;
          }

          .nav-links li.active i,
          .nav-links li.active {
            color: white;
          }

          .nav-links li i {
            margin-right: 15px;
            font-size: 18px;
            width: 20px;
            text-align: center;
            color: #718096;
            transition: all 0.3s ease;
          }

          .nav-links li:hover i {
            color: #3a7bd5;
          }

          /* Active Item Indicator */
          .nav-links li.active::after {
            content: '';
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.8);
          }

          /* Hover Effects for Icons */
          .nav-links li:hover:not(.active) i.fas.fa-home {
            color: #4299e1;
          }

          .nav-links li:hover:not(.active) i.fas.fa-plus-circle {
            color: #48bb78;
          }

          .nav-links li:hover:not(.active) i.fas.fa-list {
            color: #ed8936;
          }

          .nav-links li:hover:not(.active) i.fas.fa-chart-bar {
            color: #9f7aea;
          }

          .nav-links li:hover:not(.active) i.fas.fa-bullseye {
            color: #f56565;
          }

          .nav-links li:hover:not(.active) i.fas.fa-bell {
            color: #ecc94b;
          }

          /* Animation for Active Tab */
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(58, 123, 213, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(58, 123, 213, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(58, 123, 213, 0);
            }
          }

          .nav-links li.active {
            animation: pulse 2s infinite;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .sidebar {
              width: 240px;
            }
            
            .nav-links li a,
            .nav-links li div,
            .nav-links li {
              padding: 12px 16px;
              font-size: 13px;
            }
            
            .nav-links li i {
              font-size: 16px;
            }
          }

          /* Loading Animation */
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 18px;
            color: #3a7bd5;
            font-weight: 500;
            background-color: #f8f9fa;
          }

          .loading:after {
            content: "...";
            animation: dots 1.5s steps(5, end) infinite;
          }

          @keyframes dots {
            0%, 20% {
              content: ".";
            }
            40% {
              content: "..";
            }
            60%, 100% {
              content: "...";
            }
          }

          /* Card Components */
          .card {
            background-color: var(--card-bg);
            border-radius: 12px;
            box-shadow: var(--box-shadow);
            margin-bottom: 24px;
            overflow: hidden;
            transition: var(--transition);
          }

          .card:hover {
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }

          .card-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
          }

          .card-body {
            padding: 20px;
          }

          /* Dashboard Grid */
          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 24px;
          }

          /* Forms */
          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-primary);
          }

          .form-control {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            transition: var(--transition);
            background-color: white;
            color: var(--text-primary);
          }

          .form-control:focus {
            outline: none;
            border-color: var(--primary-light);
            box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: var(--transition);
            font-size: 0.95rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn i {
            margin-right: 8px;
          }

          .btn-primary {
            background-color: var(--primary-color);
            color: white;
          }

          .btn-primary:hover {
            background-color: var(--primary-dark);
            box-shadow: 0 4px 8px rgba(58, 123, 213, 0.3);
          }
        `}
      </style>
      <div className="app">
        <header className="header">
          <h1>Personal Finance Tracker</h1>
        </header>
        <div className="content">
          <nav className="sidebar">
            <div className="user-info">
              <div className="avatar">JD</div>
              <h3>John Doe</h3>
            </div>
            <ul className="nav-links">
              <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                <i className="fas fa-home"></i> Dashboard
              </li>
              <li className={activeTab === 'add-transaction' ? 'active' : ''} onClick={() => setActiveTab('add-transaction')}>
                <i className="fas fa-plus-circle"></i> Add Transaction
              </li>
              <li className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>
                <i className="fas fa-list"></i> Transaction History
              </li>
              <li className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
                <i className="fas fa-chart-bar"></i> Analytics
              </li>
              <li className={activeTab === 'goals' ? 'active' : ''} onClick={() => setActiveTab('goals')}>
                <i className="fas fa-bullseye"></i> Financial Goals
              </li>
              <li className={activeTab === 'reminders' ? 'active' : ''} onClick={() => setActiveTab('reminders')}>
                <i className="fas fa-bell"></i> Payment Reminders
              </li>
            </ul>
          </nav>
          <main className="main-content">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
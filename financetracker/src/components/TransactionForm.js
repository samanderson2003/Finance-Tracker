import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaCalendarAlt, FaClipboardList, FaMoneyBillWave, FaTags, FaFileAlt } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';

const TransactionForm = ({ addTransaction }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Refund', 'Other'];
  const expenseCategories = ['Food', 'Housing', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Personal Care', 'Travel', 'Gifts', 'Other'];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      setLoading(false);
      return;
    }

    const transaction = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: Timestamp.fromDate(new Date(formData.date)),
      notes: formData.notes,
      createdAt: Timestamp.now()
    };

    const success = await addTransaction(transaction);
    if (success) {
      setMessage({ text: 'Transaction added successfully!', type: 'success' });
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } else {
      setMessage({ text: 'Failed to add transaction. Please try again.', type: 'error' });
    }
    
    setLoading(false);
  };

  // CSS Styles
  const styles = {
    container: {
      padding: '1.5rem',
      maxWidth: '800px',
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
    formCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      padding: '1.5rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    formGroup: {
      marginBottom: '1.25rem',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '0.875rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    inputFocus: {
      ':focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
      }
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '0.875rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      backgroundColor: 'white',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 0.5rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.5em 1.5em',
      paddingRight: '2.5rem',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '0.875rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      resize: 'vertical',
    },
    message: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      marginBottom: '1.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    successMessage: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    errorMessage: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    toggleContainer: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    toggleButton: {
      flex: '1',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    },
    toggleActive: {
      borderColor: 'transparent',
      color: 'white',
    },
    toggleExpense: {
      backgroundColor: '#ef4444',
    },
    toggleIncome: {
      backgroundColor: '#10b981',
    },
    formActions: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    submitButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '500',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    submitHover: {
      ':hover': {
        backgroundColor: '#2563eb',
      }
    },
    submitDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <FaMoneyBillWave /> Add New Transaction
      </h2>
      
      <div style={styles.formCard}>
        {message.text && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.successMessage : styles.errorMessage)
          }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Transaction Type</label>
            <div style={styles.toggleContainer}>
              <button
                type="button"
                style={{
                  ...styles.toggleButton,
                  ...(formData.type === 'expense' ? { ...styles.toggleActive, ...styles.toggleExpense } : {})
                }}
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
              >
                <FaArrowUp style={styles.icon} /> Expense
              </button>
              <button
                type="button"
                style={{
                  ...styles.toggleButton,
                  ...(formData.type === 'income' ? { ...styles.toggleActive, ...styles.toggleIncome } : {})
                }}
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
              >
                <FaArrowDown style={styles.icon} /> Income
              </button>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaClipboardList style={styles.icon} /> Description *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What was this transaction for?"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaMoneyBillWave style={styles.icon} /> Amount ($) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaTags style={styles.icon} /> Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaCalendarAlt style={styles.icon} /> Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaFileAlt style={styles.icon} /> Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional details..."
              rows="3"
              style={styles.textarea}
            ></textarea>
          </div>

          <div style={styles.formActions}>
            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitDisabled : {})
              }} 
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
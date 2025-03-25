import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

const Reminder = ({ uid }) => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentReminderId, setCurrentReminderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch reminders from Firestore
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const remindersQuery = query(
          collection(db, 'reminders'),
          where('userId', '==', uid)
        );
        const querySnapshot = await getDocs(remindersQuery);
        
        const remindersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate.toDate()
        }));
        
        // Sort reminders by due date (closest first)
        remindersList.sort((a, b) => a.dueDate - b.dueDate);
        setReminders(remindersList);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setMessage({ text: 'Failed to load reminders', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchReminders();
    }
  }, [uid]);

  // Check for due reminders and show notifications
  useEffect(() => {
    const checkDueReminders = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dueReminders = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.dueDate);
        reminderDate.setHours(0, 0, 0, 0);
        
        return reminderDate >= today && reminderDate < tomorrow;
      });
      
      if (dueReminders.length > 0) {
        dueReminders.forEach(reminder => {
          setMessage({ text: `Payment due today: ${reminder.title} - $${reminder.amount}`, type: 'info' });
        });
      }
    };
    
    checkDueReminders();
    
    // Check reminders daily
    const interval = setInterval(checkDueReminders, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, [reminders]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!title || !amount || !dueDate) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      if (editMode) {
        // Update existing reminder
        await updateDoc(doc(db, 'reminders', currentReminderId), {
          title,
          amount: parseFloat(amount),
          dueDate: Timestamp.fromDate(new Date(dueDate)),
          notes,
          updatedAt: Timestamp.now()
        });
        
        setMessage({ text: 'Reminder updated successfully', type: 'success' });
        setEditMode(false);
        setCurrentReminderId(null);
      } else {
        // Add new reminder
        await addDoc(collection(db, 'reminders'), {
          title,
          amount: parseFloat(amount),
          dueDate: Timestamp.fromDate(new Date(dueDate)),
          notes,
          userId: uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        setMessage({ text: 'Reminder added successfully', type: 'success' });
      }
      
      // Reset form
      setTitle('');
      setAmount('');
      setDueDate(new Date());
      setNotes('');
      
      // Refresh reminders
      const remindersQuery = query(
        collection(db, 'reminders'),
        where('userId', '==', uid)
      );
      const querySnapshot = await getDocs(remindersQuery);
      
      const remindersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate()
      }));
      
      remindersList.sort((a, b) => a.dueDate - b.dueDate);
      setReminders(remindersList);
    } catch (error) {
      console.error('Error managing reminder:', error);
      setMessage({ text: 'Failed to save reminder', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Edit reminder
  const handleEdit = (reminder) => {
    setTitle(reminder.title);
    setAmount(reminder.amount.toString());
    setDueDate(new Date(reminder.dueDate));
    setNotes(reminder.notes || '');
    setEditMode(true);
    setCurrentReminderId(reminder.id);
  };

  // Delete reminder
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, 'reminders', id));
        
        // Update state
        setReminders(reminders.filter(reminder => reminder.id !== id));
        setMessage({ text: 'Reminder deleted successfully', type: 'success' });
      } catch (error) {
        console.error('Error deleting reminder:', error);
        setMessage({ text: 'Failed to delete reminder', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const reminderDate = new Date(dueDate);
    reminderDate.setHours(0, 0, 0, 0);
    
    const diffTime = reminderDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="reminders">
      <style>
        {`
          .reminders {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafc;
            border-radius: 12px;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
          }

          .reminders-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eaedf3;
          }

          .reminders-header h2 {
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
            display: flex;
            align-items: center;
          }

          .reminders-header h2 i {
            margin-right: 10px;
            color: #4f46e5;
          }

          .add-button {
            padding: 10px 16px;
            background-color: #4f46e5;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .add-button:hover {
            background-color: #4338ca;
          }

          .message {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
          }

          .message.error {
            background-color: #fee2e2;
            color: #b91c1c;
            border-left: 4px solid #ef4444;
          }

          .message.success {
            background-color: #dcfce7;
            color: #166534;
            border-left: 4px solid #10b981;
          }

          .message.info {
            background-color: #e0f2fe;
            color: #0369a1;
            border-left: 4px solid #0ea5e9;
          }

          .form-card {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .form-card h3 {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin: 0 0 20px 0;
          }

          .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 16px;
          }

          .form-group {
            flex: 1;
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 6px;
          }

          .form-group input, 
          .form-group select, 
          .form-group textarea {
            width: 100%;
            padding: 10px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            color: #4a5568;
            background-color: #ffffff;
            outline: none;
            transition: all 0.2s ease;
          }

          .form-group input:focus, 
          .form-group select:focus, 
          .form-group textarea:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
          }

          .date-input-container {
            position: relative;
          }

          .date-input-container i {
            position: absolute;
            right: 14px;
            top: 12px;
            color: #a0aec0;
          }

          .form-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .submit-button {
            padding: 10px 20px;
            background-color: #4f46e5;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .submit-button:hover {
            background-color: #4338ca;
          }

          .submit-button:disabled {
            background-color: #a5b4fc;
            cursor: not-allowed;
          }

          .cancel-button {
            padding: 10px 20px;
            background-color: #6b7280;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            margin-left: 10px;
            transition: all 0.2s ease;
          }

          .cancel-button:hover {
            background-color: #4b5563;
          }

          .reminder-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .reminder-table th {
            text-align: left;
            padding: 14px 20px;
            background-color: #f8fafc;
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e2e8f0;
          }

          .reminder-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
            color: #4b5563;
          }

          .reminder-table tr:last-child td {
            border-bottom: none;
          }

          .reminder-table tr:hover {
            background-color: #f9fafb;
          }

          .reminder-title {
            font-weight: 500;
            color: #2d3748;
          }

          .reminder-notes {
            font-size: 13px;
            color: #718096;
            margin-top: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .reminder-amount {
            font-weight: 600;
            color: #2d3748;
          }

          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 500;
            color: white;
          }

          .badge-red {
            background-color: #ef4444;
          }

          .badge-orange {
            background-color: #f97316;
          }

          .badge-yellow {
            background-color: #eab308;
          }

          .badge-green {
            background-color: #10b981;
          }

          .button-group {
            display: flex;
            gap: 10px;
          }

          .edit-button, .delete-button {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .edit-button {
            color: #4f46e5;
            background-color: rgba(79, 70, 229, 0.1);
          }

          .edit-button:hover {
            background-color: rgba(79, 70, 229, 0.2);
          }

          .delete-button {
            color: #ef4444;
            background-color: rgba(239, 68, 68, 0.1);
          }

          .delete-button:hover {
            background-color: rgba(239, 68, 68, 0.2);
          }

          .button-icon {
            margin-right: 6px;
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            background-color: #ffffff;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .empty-state i {
            font-size: 48px;
            color: #cbd5e1;
            margin-bottom: 16px;
          }

          .empty-state h3 {
            font-size: 18px;
            font-weight: 500;
            color: #4b5563;
            margin: 0 0 8px 0;
          }

          .empty-state p {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }

          .table-container {
            overflow-x: auto;
          }

          @media (max-width: 768px) {
            .form-row {
              flex-direction: column;
              gap: 0;
            }
            
            .reminder-table th:nth-child(4), 
            .reminder-table td:nth-child(4) {
              display: none;
            }
            
            .button-group {
              flex-direction: column;
              gap: 8px;
            }
            
            .edit-button, .delete-button {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>

      <div className="reminders-header">
        <h2><i className="fas fa-bell"></i> Payment Reminders</h2>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-card">
        <h3>{editMode ? 'Edit Reminder' : 'Create New Reminder'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Rent Payment"
                required
              />
            </div>

            <div className="form-group">
              <label>Amount ($) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <div className="date-input-container">
                <input
                  type="date"
                  value={dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDueDate(new Date(e.target.value))}
                  required
                />
                <i className="fas fa-calendar-alt"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details here..."
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Processing...' : editMode ? 'Update Reminder' : 'Add Reminder'}
            </button>
            
            {editMode && (
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setEditMode(false);
                  setCurrentReminderId(null);
                  setTitle('');
                  setAmount('');
                  setDueDate(new Date());
                  setNotes('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="section-title">Upcoming Payments</h3>
      
      <div className="table-container">
        {loading && reminders.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-spinner fa-spin"></i>
            <h3>Loading reminders...</h3>
          </div>
        ) : reminders.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-bell"></i>
            <h3>No payment reminders yet</h3>
            <p>Add your first payment reminder using the form above</p>
          </div>
        ) : (
          <table className="reminder-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => {
                const daysRemaining = getDaysRemaining(reminder.dueDate);
                let badgeClass = 'badge-green';
                let statusText = `${daysRemaining} days left`;
                
                if (daysRemaining < 0) {
                  badgeClass = 'badge-red';
                  statusText = `Overdue by ${Math.abs(daysRemaining)} days`;
                } else if (daysRemaining === 0) {
                  badgeClass = 'badge-orange';
                  statusText = 'Due Today';
                } else if (daysRemaining <= 3) {
                  badgeClass = 'badge-yellow';
                  statusText = `${daysRemaining} days left`;
                }
                
                return (
                  <tr key={reminder.id}>
                    <td>
                      <div className="reminder-title">{reminder.title}</div>
                      {reminder.notes && (
                        <div className="reminder-notes">{reminder.notes}</div>
                      )}
                    </td>
                    <td>
                      <div className="reminder-amount">${reminder.amount.toFixed(2)}</div>
                    </td>
                    <td>{formatDate(reminder.dueDate)}</td>
                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {statusText}
                      </span>
                    </td>
                    <td>
                      <div className="button-group">
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="edit-button"
                        >
                          <i className="fas fa-edit button-icon"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(reminder.id)}
                          className="delete-button"
                        >
                          <i className="fas fa-trash button-icon"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reminder;
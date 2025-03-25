import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';

const Goals = ({ goals, addGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    savedAmount: '',
    targetDate: '',
    category: '',
    notes: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const goalCategories = [
    'Emergency Fund', 'Retirement', 'Vacation', 'House', 'Car', 'Education',
    'Wedding', 'Debt Payoff', 'Other'
  ];

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
    
    if (!formData.title || !formData.amount || !formData.targetDate) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      setLoading(false);
      return;
    }

    const savedAmount = formData.savedAmount ? parseFloat(formData.savedAmount) : 0;
    const totalAmount = parseFloat(formData.amount);

    if (savedAmount > totalAmount) {
      setMessage({ text: 'Saved amount cannot exceed target amount', type: 'error' });
      setLoading(false);
      return;
    }

    const goal = {
      title: formData.title,
      amount: totalAmount,
      savedAmount: savedAmount,
      targetDate: Timestamp.fromDate(new Date(formData.targetDate)),
      category: formData.category,
      notes: formData.notes,
      createdAt: Timestamp.now()
    };

    const success = await addGoal(goal);
    if (success) {
      setMessage({ text: 'Goal added successfully!', type: 'success' });
      setFormData({
        title: '',
        amount: '',
        savedAmount: '',
        targetDate: '',
        category: '',
        notes: ''
      });
      setShowForm(false);
    } else {
      setMessage({ text: 'Failed to add goal. Please try again.', type: 'error' });
    }
    
    setLoading(false);
  };

  // Calculate days remaining for a goal
  const calculateDaysRemaining = (targetDate) => {
    const today = new Date();
    const timeDiff = targetDate - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Sort goals by progress (ascending) and then by date (ascending)
  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = (a.savedAmount / a.amount) * 100;
    const progressB = (b.savedAmount / b.amount) * 100;
    
    if (progressA !== progressB) {
      return progressA - progressB;
    }
    
    return a.targetDate - b.targetDate;
  });

  return (
    <div className="goals">
      <style>
        {`
          .goals {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafc;
            border-radius: 12px;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
          }

          .goals-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eaedf3;
          }

          .goals-header h2 {
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
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

          .goals-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }

          .goal-card {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .goal-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
          }

          .goal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .goal-header h3 {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
            flex: 1;
          }

          .goal-category {
            font-size: 12px;
            color: #6b7280;
            background-color: #f3f4f6;
            padding: 4px 8px;
            border-radius: 4px;
            white-space: nowrap;
            margin-left: 8px;
          }

          .goal-category.has-category {
            color: #5b21b6;
            background-color: #ede9fe;
          }

          .goal-progress {
            margin-bottom: 16px;
          }

          .progress-bar {
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 8px;
          }

          .progress-fill {
            height: 100%;
            background-color: #4f46e5;
            border-radius: 4px;
            transition: width 0.3s ease;
          }

          .progress-stats {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #6b7280;
          }

          .goal-details {
            margin-bottom: 16px;
          }

          .goal-detail {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #4b5563;
          }

          .goal-detail i {
            margin-right: 10px;
            color: #6b7280;
            width: 16px;
            text-align: center;
          }

          .goal-detail .overdue {
            color: #ef4444;
          }

          .goal-notes {
            padding-top: 12px;
            border-top: 1px solid #eaedf3;
          }

          .goal-notes p {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
            line-height: 1.5;
          }

          .no-goals {
            grid-column: 1 / -1;
            padding: 48px 20px;
            text-align: center;
            color: #6b7280;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .no-goals i {
            font-size: 48px;
            margin-bottom: 16px;
            color: #cbd5e1;
          }

          .no-goals h3 {
            font-size: 18px;
            font-weight: 500;
            margin: 0 0 8px 0;
            color: #4b5563;
          }

          .no-goals p {
            font-size: 14px;
            margin: 0;
          }

          @media (max-width: 768px) {
            .form-row {
              flex-direction: column;
              gap: 0;
            }
            
            .goals-container {
              grid-template-columns: 1fr;
            }
            
            .goal-header {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .goal-category {
              margin-left: 0;
              margin-top: 8px;
            }
          }
        `}
      </style>

      <div className="goals-header">
        <h2>Financial Goals</h2>
        <button className="add-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Goal'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h3>Create New Goal</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Goal Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What are you saving for?"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {goalCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Amount ($) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Savings ($)</label>
                <input
                  type="number"
                  name="savedAmount"
                  value={formData.savedAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Date *</label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional details..."
                rows="3"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="goals-container">
        {sortedGoals.length > 0 ? (
          sortedGoals.map((goal) => {
            const progress = (goal.savedAmount / goal.amount) * 100;
            const daysRemaining = calculateDaysRemaining(goal.targetDate);
            const isOverdue = daysRemaining < 0;
            
            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  <span className={`goal-category ${goal.category ? 'has-category' : ''}`}>
                    {goal.category || 'No Category'}
                  </span>
                </div>
                
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span>${goal.savedAmount.toFixed(2)} of ${goal.amount.toFixed(2)}</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="goal-details">
                  <div className="goal-detail">
                    <i className="fas fa-calendar"></i>
                    <span>Target Date: {goal.targetDate.toLocaleDateString()}</span>
                  </div>
                  <div className="goal-detail">
                    <i className="fas fa-clock"></i>
                    <span className={isOverdue ? 'overdue' : ''}>
                      {isOverdue 
                        ? `Overdue by ${Math.abs(daysRemaining)} days` 
                        : `${daysRemaining} days remaining`}
                    </span>
                  </div>
                  <div className="goal-detail">
                    <i className="fas fa-dollar-sign"></i>
                    <span>
                      Need ${(goal.amount - goal.savedAmount).toFixed(2)} more
                      {daysRemaining > 0 && (
                        <span> (${((goal.amount - goal.savedAmount) / daysRemaining).toFixed(2)}/day)</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {goal.notes && (
                  <div className="goal-notes">
                    <p>{goal.notes}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-goals">
            <i className="fas fa-bullseye"></i>
            <h3>No financial goals yet</h3>
            <p>Click the "Add New Goal" button to start planning your financial future</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
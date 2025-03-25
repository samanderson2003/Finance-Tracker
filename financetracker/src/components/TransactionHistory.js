import React, { useState, useEffect } from 'react';

const TransactionHistory = ({ transactions }) => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
    search: '',
  });

  // Get unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))];

  useEffect(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(t => t.date >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => t.date <= endDate);
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm) || 
        t.notes?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
      search: '',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <div className="transaction-history">
      <style>
        {`
          .transaction-history {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafc;
            border-radius: 12px;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
          }

          .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eaedf3;
          }

          .history-header h2 {
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }

          .history-header p {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
          }

          .filters-container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .filters {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
          }

          .filter-group {
            flex: 1;
            min-width: 150px;
          }

          .search-input, select, input[type="date"] {
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

          .search-input:focus, select:focus, input[type="date"]:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
          }

          .search-input {
            padding-left: 40px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>');
            background-repeat: no-repeat;
            background-position: 16px center;
          }

          .reset-filters {
            padding: 10px 16px;
            background-color: #ffffff;
            color: #4f46e5;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .reset-filters:hover {
            background-color: #f9fafb;
            border-color: #4f46e5;
          }

          .transactions-container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }

          .date-group {
            border-bottom: 1px solid #eaedf3;
          }

          .date-group:last-child {
            border-bottom: none;
          }

          .date-header {
            display: flex;
            justify-content: space-between;
            padding: 14px 20px;
            background-color: #f8fafc;
            border-bottom: 1px solid #eaedf3;
          }

          .date-header h3 {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }

          .date-header p {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }

          .transaction-list {
            padding: 8px 0;
          }

          .transaction-item {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            transition: background-color 0.2s ease;
            cursor: pointer;
          }

          .transaction-item:hover {
            background-color: #f8fafc;
          }

          .transaction-icon {
            margin-right: 16px;
          }

          .icon-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .icon-circle.income {
            background-color: #10b981;
          }

          .icon-circle.expense {
            background-color: #ef4444;
          }

          .icon-circle i {
            font-size: 14px;
          }

          .transaction-info {
            flex: 1;
          }

          .transaction-info h4 {
            font-size: 16px;
            font-weight: 500;
            color: #2d3748;
            margin: 0 0 4px 0;
          }

          .transaction-info .category {
            font-size: 14px;
            color: #6b7280;
            margin: 0 0 4px 0;
            display: inline-block;
            background-color: #f3f4f6;
            padding: 2px 8px;
            border-radius: 4px;
          }

          .transaction-info .notes {
            font-size: 13px;
            color: #6b7280;
            margin: 4px 0 0 0;
            line-height: 1.5;
          }

          .transaction-amount {
            text-align: right;
            min-width: 120px;
          }

          .transaction-amount p {
            font-weight: 600;
            font-size: 16px;
            margin: 0 0 4px 0;
          }

          .transaction-amount p.income {
            color: #10b981;
          }

          .transaction-amount p.expense {
            color: #ef4444;
          }

          .transaction-time {
            font-size: 13px;
            color: #9ca3af;
          }

          .no-transactions {
            padding: 48px 20px;
            text-align: center;
            color: #6b7280;
          }

          .no-transactions i {
            font-size: 48px;
            margin-bottom: 16px;
            color: #cbd5e1;
          }

          .no-transactions h3 {
            font-size: 18px;
            font-weight: 500;
            margin: 0 0 8px 0;
            color: #4b5563;
          }

          .no-transactions p {
            font-size: 14px;
            margin: 0;
          }

          @media (max-width: 768px) {
            .filters {
              flex-direction: column;
              align-items: stretch;
            }
            
            .filter-group {
              width: 100%;
            }
            
            .transaction-item {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .transaction-icon {
              margin-bottom: 12px;
            }
            
            .transaction-amount {
              align-self: flex-start;
              margin-top: 12px;
              text-align: left;
            }
          }
        `}
      </style>

      <div className="history-header">
        <h2>Transaction History</h2>
        <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
      </div>

      <div className="filters-container">
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search transactions..."
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              placeholder="Start Date"
            />
          </div>

          <div className="filter-group">
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              placeholder="End Date"
            />
          </div>

          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="transactions-container">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, dayTransactions]) => (
              <div key={date} className="date-group">
                <div className="date-header">
                  <h3>{date}</h3>
                  <p>{dayTransactions.length} transactions</p>
                </div>
                <div className="transaction-list">
                  {dayTransactions.map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-icon">
                        <div className={`icon-circle ${transaction.type}`}>
                          <i className={transaction.type === 'income' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}></i>
                        </div>
                      </div>
                      <div className="transaction-info">
                        <h4>{transaction.description}</h4>
                        <p className="category">{transaction.category}</p>
                        {transaction.notes && <p className="notes">{transaction.notes}</p>}
                      </div>
                      <div className="transaction-amount">
                        <p className={transaction.type}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        <span className="transaction-time">
                          {transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="no-transactions">
            <i className="fas fa-search"></i>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new transaction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
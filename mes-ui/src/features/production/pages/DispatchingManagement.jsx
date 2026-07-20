import React, { useState } from 'react';
import { FiSend, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './DispatchingManagement.css';

const DispatchingManagement = () => {
  const [orders, setOrders] = useState([
    { id: 'WO-2024-001', product: 'Smart Washer X1', qty: 100, priority: 'High', status: 'Planned' },
    { id: 'WO-2024-002', product: 'Digital Oven v2', qty: 50, priority: 'Medium', status: 'Planned' },
  ]);

  const handleDispatch = (id) => {
    console.log(`Dispatching Order ${id} to Production Line 01`);
  };

  return (
    <div className="dispatch-container">
      <header className="dispatch-header">
        <h2>Production Dispatching Center</h2>
        <span className="api-status">● Connected to ERP Simulation</span>
      </header>

      <div className="order-grid">
        {orders.map(order => (
          <div key={order.id} className={`order-card ${order.priority.toLowerCase()}`}>
            <div className="card-side-status"></div>
            <div className="card-content">
              <div className="card-main-info">
                <span className="order-id">{order.id}</span>
                <h3>{order.product}</h3>
                <div className="order-meta">
                  <span><FiClock /> Qty: {order.qty} units</span>
                  <span className={`priority-tag ${order.priority.toLowerCase()}`}>
                    {order.priority} Priority
                  </span>
                </div>
              </div>
              
              <div className="dispatch-actions">
                <select className="line-select">
                  <option>Select Target Line...</option>
                  <option>Assembly Line 01</option>
                  <option>Testing Station 02</option>
                </select>
                <button className="dispatch-btn" onClick={() => handleDispatch(order.id)}>
                  <FiSend /> Release to Floor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DispatchingManagement;
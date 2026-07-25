import React, { useState } from 'react';
import { 
  FiPlay, 
  FiPauseCircle, 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiClock, 
  FiLayers,
  FiZap,
  FiActivity
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import './DispatchingManagement.css';

const DispatchingManagement = () => {
  const [orders, setOrders] = useState([
    { 
      id: 'PO-2026-001', 
      sku: 'FG-WASHER-X1', 
      status: 'Unreleased', 
      hasException: true, 
      exceptionMsg: 'Material Shortage at Line A',
      plannedStart: '2026-07-22 08:00', 
      plannedEnd: '2026-07-22 16:00',
      targetQty: 100, 
      completedQty: 0, 
      priority: 'High',
      workstation: 'Press-Station-01'
    },
    { 
      id: 'PO-2026-002', 
      sku: 'FG-OVEN-V2', 
      status: 'Released', 
      hasException: false, 
      plannedStart: '2026-07-22 10:00', 
      plannedEnd: '2026-07-22 14:00',
      targetQty: 50, 
      completedQty: 18, 
      priority: 'Medium',
      workstation: 'Assembly-Line-02'
    },
    { 
      id: 'PO-2026-003', 
      sku: 'FG-DRYER-S3', 
      status: 'Unreleased', 
      hasException: false, 
      plannedStart: '2026-07-22 13:00', 
      plannedEnd: '2026-07-22 18:00',
      targetQty: 30, 
      completedQty: 0, 
      priority: 'Low',
      workstation: 'Testing-Station-01'
    }
  ]);

  const [filter, setFilter] = useState('ALL');

  // حساب كروت الإحصائيات العصرية
  const stats = {
    total: orders.length,
    unreleased: orders.filter(o => o.status === 'Unreleased').length,
    released: orders.filter(o => o.status === 'Released').length,
    exceptions: orders.filter(o => o.hasException).length
  };

  const handleRelease = (id, station) => {
    if (!station) {
      toast.error("Please assign a workstation first!");
      return;
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Released' } : o));
    toast.success(`Order ${id} released to ${station}!`);
  };

  const handleToggleHold = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { 
      ...o, 
      status: o.status === 'On Hold' ? 'Unreleased' : 'On Hold' 
    } : o));
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'UNRELEASED') return o.status === 'Unreleased';
    if (filter === 'RELEASED') return o.status === 'Released';
    if (filter === 'EXCEPTIONS') return o.hasException;
    return true;
  });

  return (
    <div className="modern-dispatch-page">
      {/* Header Zone */}
      <header className="dispatch-top-nav">
        <div className="header-brand">
          <div className="brand-icon">
            <FiActivity />
          </div>
          <div>
            <h1>Production Dispatch Center</h1>
            <p>Real-time Operations Queue & ISA-95 Order Scheduling</p>
          </div>
        </div>

        <div className="header-right-actions">
          <div className="status-live-pill">
            <span className="pulse-dot"></span> SAP Sync Connected
          </div>
          <button className="btn-sync-action" onClick={() => toast.info("Syncing SAP Work Orders...")}>
            <FiRefreshCw /> Fetch SAP Orders
          </button>
        </div>
      </header>

      {/* KPI Modern Stat Cards */}
      <div className="modern-kpi-grid">
        <div 
          className={`stat-card ${filter === 'ALL' ? 'selected' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          <div className="stat-card-header">
            <span>Total Orders</span>
            <FiLayers className="card-icon" />
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-footer">Today's Total Work Queue</div>
        </div>

        <div 
          className={`stat-card warning ${filter === 'UNRELEASED' ? 'selected' : ''}`}
          onClick={() => setFilter('UNRELEASED')}
        >
          <div className="stat-card-header">
            <span>Pending Release</span>
            <FiClock className="card-icon" />
          </div>
          <div className="stat-value">{stats.unreleased}</div>
          <div className="stat-footer">Waiting for Dispatch</div>
        </div>

        <div 
          className={`stat-card success ${filter === 'RELEASED' ? 'selected' : ''}`}
          onClick={() => setFilter('RELEASED')}
        >
          <div className="stat-card-header">
            <span>Released</span>
            <FiZap className="card-icon" />
          </div>
          <div className="stat-value">{stats.released}</div>
          <div className="stat-footer">Running on Shop Floor</div>
        </div>

        <div 
          className={`stat-card danger ${filter === 'EXCEPTIONS' ? 'selected' : ''}`}
          onClick={() => setFilter('EXCEPTIONS')}
        >
          <div className="stat-card-header">
            <span>Exceptions</span>
            <FiAlertTriangle className="card-icon" />
          </div>
          <div className="stat-value">{stats.exceptions}</div>
          <div className="stat-footer">Requires Immediate Action</div>
        </div>
      </div>

      {/* Main Glassmorphic Table Container */}
      <div className="table-card-container">
        <div className="container-bar">
          <h3>Orders Dispatching Queue</h3>
          <span className="showing-tag">Showing {filteredOrders.length} Orders</span>
        </div>

        <div className="table-responsive">
          <table className="modern-mes-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product SKU</th>
                <th>Target / Completed Qty</th>
                <th>Priority</th>
                <th>Schedule (Start ➔ End)</th>
                <th>Assigned Workstation</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((job) => (
                <tr key={job.id} className={job.hasException ? 'has-issue-row' : ''}>
                  <td>
                    <div className="order-id-cell">
                      <span className="id-text">{job.id}</span>
                      {job.hasException && (
                        <span className="badge-issue" title={job.exceptionMsg}>
                          <FiAlertTriangle /> Issue
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="sku-tag">{job.sku}</span>
                  </td>
                  <td>
                    <div className="qty-progress-block">
                      <span className="qty-text">{job.completedQty} / {job.targetQty} units</span>
                      <div className="mini-progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(job.completedQty / job.targetQty) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-pill ${job.priority.toLowerCase()}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td>
                    <div className="time-block">
                      <span>{job.plannedStart}</span>
                      <span className="time-sub">to {job.plannedEnd}</span>
                    </div>
                  </td>
                  <td>
                    <select 
                      className="modern-select" 
                      defaultValue={job.workstation}
                      disabled={job.status === 'Released'}
                    >
                      <option value="Press-Station-01">Press Station 01</option>
                      <option value="Assembly-Line-01">Assembly Line 01</option>
                      <option value="Assembly-Line-02">Assembly Line 02</option>
                      <option value="Testing-Station-01">Testing Station 01</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-pill ${job.status.toLowerCase().replace(' ', '-')}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="actions-flex">
                      {job.status !== 'Released' ? (
                        <button 
                          className="btn-modern-primary" 
                          onClick={() => handleRelease(job.id, job.workstation)}
                        >
                          <FiPlay /> Release
                        </button>
                      ) : (
                        <button className="btn-modern-disabled" disabled>
                         Dispatched
                        </button>
                      )}

                      <button 
                        className={`btn-icon-soft ${job.status === 'On Hold' ? 'active' : ''}`}
                        onClick={() => handleToggleHold(job.id)}
                        title="Hold/Resume Order"
                      >
                        <FiPauseCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DispatchingManagement;
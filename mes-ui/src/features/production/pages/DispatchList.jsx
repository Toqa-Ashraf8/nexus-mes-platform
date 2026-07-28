import React, { useState } from 'react';
import {
  FiPlay,
  FiPauseCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiClock,
  FiLayers,
  FiZap,
  FiActivity,
  FiMapPin,
  FiPackage,
  FiSearch
} from 'react-icons/fi';
import './DispatchList.css';

// قائمة المحطات المتاحة في صالة الإنتاج
const availableWorkstations = [
  'Press-Station-01',
  'Press-Station-02',
  'Assembly-Line-01',
  'Assembly-Line-02',
  'Stamping-Station-04',
  'CNC-Cell-01'
];

const initialOrders = [
  {
    id: 'PO-2026-001',
    sku: 'FG-WASHER-X1',
    description: 'Front-Load Washer Chassis',
    status: 'Unreleased',
    hasException: true,
    exceptionMsg: 'Material Shortage at Line A',
    plannedStart: '08:00 AM',
    plannedEnd: '04:00 PM',
    targetQty: 100,
    completedQty: 0,
    priority: 'High',
    workstation: 'Press-Station-01'
  },
  
  {
    id: 'PO-2026-004',
    sku: 'FG-OVEN-K4',
    description: 'Built-in Oven Control Panel',
    status: 'On Hold',
    hasException: true,
    exceptionMsg: 'Tooling Calibration Error',
    plannedStart: '01:00 PM',
    plannedEnd: '09:00 PM',
    targetQty: 80,
    completedQty: 15,
    priority: 'High',
    workstation: 'CNC-Cell-01'
  }
];

const DispatchList = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = {
    total: orders.length,
    unreleased: orders.filter((o) => o.status === 'Unreleased').length,
    released: orders.filter((o) => o.status === 'Released').length,
    exceptions: orders.filter((o) => o.hasException).length
  };

  const handleRelease = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: 'Released' } : order
      )
    );
  };

  const handleToggleHold = (id) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const nextStatus = order.status === 'On Hold' ? 'Unreleased' : 'On Hold';
          return { ...order, status: nextStatus };
        }
        return order;
      })
    );
  };

  const handleWorkstationChange = (id, newWorkstation) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, workstation: newWorkstation } : order
      )
    );
  };

  const handleFetchSAP = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const filteredOrders = orders.filter((order) => {
    let matchesFilter = true;
    if (activeFilter === 'Pending release') matchesFilter = order.status === 'Unreleased';
    else if (activeFilter === 'Released') matchesFilter = order.status === 'Released';
    else if (activeFilter === 'Exceptions') matchesFilter = order.hasException;

    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.workstation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dispatch-page">
      <header className="dispatch-header">
        <div className="dispatch-header-left">
          <div className="dispatch-header-icon">
            <FiActivity />
          </div>
          <div>
            <h1>Production Dispatch Center</h1>
            <p>Real-time operations queue &amp; order scheduling</p>
          </div>
        </div>

        <div className="dispatch-header-right">
          <div className="live-status-pill">
            <span className="pulse-dot"></span> SAP sync connected
          </div>
          <button className="btn-fetch-sap" onClick={handleFetchSAP} disabled={isRefreshing}>
            <FiRefreshCw className={isRefreshing ? 'spin' : ''} />
            {isRefreshing ? 'Syncing...' : 'Fetch SAP orders'}
          </button>
        </div>
      </header>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-top">
            <span>Total orders</span>
            <FiLayers className="kpi-icon" />
          </div>
          <div className="kpi-value">{stats.total}</div>
          <span className="kpi-caption">Today's work queue</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span>Pending release</span>
            <FiClock className="kpi-icon" />
          </div>
          <div className="kpi-value">{stats.unreleased}</div>
          <span className="kpi-caption">Waiting for dispatch</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span>Released</span>
            <FiZap className="kpi-icon" />
          </div>
          <div className="kpi-value">{stats.released}</div>
          <span className="kpi-caption">Running on shop floor</span>
        </div>

        <div className="kpi-card kpi-danger">
          <div className="kpi-top">
            <span>Exceptions</span>
            <FiAlertTriangle className="kpi-icon" />
          </div>
          <div className="kpi-value">{stats.exceptions}</div>
          <span className="kpi-caption">Needs immediate action</span>
        </div>
      </div>

      <div className="filter-search-bar">
        <div className="filter-pills-row">
          {['All', 'Pending release', 'Released', 'Exceptions'].map((filterName) => (
            <button
              key={filterName}
              className={`filter-pill ${activeFilter === filterName ? 'active' : ''}`}
              onClick={() => setActiveFilter(filterName)}
            >
              {filterName === 'All' ? 'All orders' : filterName}
            </button>
          ))}
        </div>

        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Order, SKU, Workstation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="orders-queue">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>No production orders match the current filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const progressPercent = Math.round((order.completedQty / order.targetQty) * 100);

            return (
              <div
                key={order.id}
                className={`order-card priority-${order.priority.toLowerCase()} ${
                  order.hasException ? 'has-exception' : ''
                }`}
              >
                <div className="order-card-main">
                  <div className="order-identity">
                    <div className="order-id-row">
                      <span className="order-id">{order.id}</span>
                      <span className={`priority-tag ${order.priority.toLowerCase()}`}>
                        {order.priority}
                      </span>
                    </div>
                    <div className="order-sku-row">
                      <FiPackage className="inline-icon" />
                      <span className="sku-code">{order.sku}</span>
                      <span className="sku-desc">- {order.description}</span>
                    </div>
                    {order.hasException && (
                      <div className="exception-note">
                        <FiAlertTriangle /> {order.exceptionMsg}
                      </div>
                    )}
                  </div>

                  <div className="order-progress-block">
                    <div className="progress-label-row">
                      <span>{order.completedQty} / {order.targetQty} units</span>
                      <span className="progress-percent">{progressPercent}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${order.hasException ? 'fill-danger' : ''}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="order-meta-block">
                    <div className="meta-item">
                      <FiClock className="inline-icon" />
                      <span>{order.plannedStart} &rarr; {order.plannedEnd}</span>
                    </div>
                    
                    <div className="meta-item workstation-select-wrapper">
                      <FiMapPin className="inline-icon" />
                      {order.status === 'Unreleased' ? (
                        <select
                          className="workstation-select"
                          value={order.workstation}
                          onChange={(e) => handleWorkstationChange(order.id, e.target.value)}
                          title="Change workstation / re-route"
                        >
                          {availableWorkstations.map((ws) => (
                            <option key={ws} value={ws}>
                              {ws}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="workstation-readonly">{order.workstation}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="order-card-side">
                  <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>

                  <div className="order-actions">
                    {order.status !== 'Released' ? (
                      <button
                        className="btn-release"
                        onClick={() => handleRelease(order.id)}
                        disabled={order.hasException || order.status === 'On Hold'}
                        title={
                          order.hasException
                            ? 'Cannot release order with active exceptions'
                            : order.status === 'On Hold'
                            ? 'Resume order before release'
                            : 'Release to shop floor'
                        }
                      >
                        <FiPlay /> Release
                      </button>
                    ) : (
                      <button className="btn-dispatched" disabled>
                        Dispatched
                      </button>
                    )}
                    <button
                      className={`btn-hold-icon ${order.status === 'On Hold' ? 'is-on-hold' : ''}`}
                      onClick={() => handleToggleHold(order.id)}
                      title={order.status === 'On Hold' ? 'Resume order' : 'Place order on hold'}
                    >
                      <FiPauseCircle />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DispatchList;
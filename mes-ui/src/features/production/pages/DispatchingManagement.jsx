import React from 'react';
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
  FiPackage
} from 'react-icons/fi';
import './DispatchingManagement.css';

const dummyOrders = [
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
];

const stats = {
  total: dummyOrders.length,
  unreleased: dummyOrders.filter((o) => o.status === 'Unreleased').length,
  released: dummyOrders.filter((o) => o.status === 'Released').length,
  exceptions: dummyOrders.filter((o) => o.hasException).length
};

const DispatchingManagement = () => {
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
          <button className="btn-fetch-sap">
            <FiRefreshCw /> Fetch SAP orders
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

      <div className="filter-pills-row">
        <span className="filter-pill active">All orders</span>
        <span className="filter-pill">Pending release</span>
        <span className="filter-pill">Released</span>
        <span className="filter-pill">Exceptions</span>
      </div>

      <div className="orders-queue">
        {dummyOrders.map((order) => (
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
                  <span className="sku-desc">{order.description}</span>
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
                  <span className="progress-percent">
                    {Math.round((order.completedQty / order.targetQty) * 100)}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(order.completedQty / order.targetQty) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="order-meta-block">
                <div className="meta-item">
                  <FiClock className="inline-icon" />
                  <span>{order.plannedStart} &rarr; {order.plannedEnd}</span>
                </div>
                <div className="meta-item">
                  <FiMapPin className="inline-icon" />
                  <span>{order.workstation}</span>
                </div>
              </div>
            </div>

            <div className="order-card-side">
              <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                {order.status}
              </span>

              <div className="order-actions">
                {order.status !== 'Released' ? (
                  <button className="btn-release">
                    <FiPlay /> Release
                  </button>
                ) : (
                  <button className="btn-dispatched" disabled>
                    Dispatched
                  </button>
                )}
                <button className="btn-hold-icon" title="Hold / resume order">
                  <FiPauseCircle />
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
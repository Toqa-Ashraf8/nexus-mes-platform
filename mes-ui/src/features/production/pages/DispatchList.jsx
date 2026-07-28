import React, { useState, useEffect } from 'react';
import {
  FiPlay,
  FiPauseCircle,
  FiAlertTriangle,
  FiClock,
  FiLayers,
  FiZap,
  FiActivity,
  FiMapPin,
  FiPackage,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiEdit,
  FiX,
  FiCheck,
  FiCalendar,
  FiPrinter,
  FiRotateCcw
} from 'react-icons/fi';
import './DispatchList.css';
import alertWarningImg from '../../../assets/warning.png';
import orderPriorityImg from '../../../assets/task.png';
import calendarImg from '../../../assets/calendar.png';
import workStationImg from '../../../assets/oil-industry.png';

import { useDispatch, useSelector } from 'react-redux';
import { fetchReleasedWorkOrders } from '../services/dispatchListService';

 import {
  setPageNumber,
  setActiveTab,
  setSearchQuery,
  setSelectedWorkstation,
  setSelectedPriority,
  setDateSortOrder,
  resetFilters,
  releaseWorkOrder,
  toggleHoldWorkOrder,
  saveEditedOrder
} from '../slices/dispatchListSlice';

const DispatchList = () => {
  const dispatch = useDispatch();
  const {
    workOrders,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    activeTab,
    searchQuery,
    selectedWorkstation,
    selectedPriority,
    dateSortOrder,
    loading
  } = useSelector((state) => state.dispatchList);

  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    dispatch(
      fetchReleasedWorkOrders({
        pageNumber,
        pageSize,
        searchQuery,
        workstation: selectedWorkstation,
        priority: selectedPriority
      })
    );
  }, [dispatch, pageNumber, pageSize, searchQuery, selectedWorkstation, selectedPriority]);

  const stats = {
    total: totalCount || workOrders.length,
    pending: workOrders.filter((o) => o.status === 'Unreleased').length,
    released: workOrders.filter((o) => o.status === 'Released').length,
    exceptions: workOrders.filter((o) => o.hasException).length
  };

  const handleRelease = (workOrderID) => {
    dispatch(releaseWorkOrder(workOrderID));
  };

  const handleToggleHold = (workOrderID) => {
    dispatch(toggleHoldWorkOrder(workOrderID));
  };

  const handleOpenEditModal = (order) => {
    setEditingOrder({ ...order });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingOrder) {
      dispatch(saveEditedOrder(editingOrder));
      setEditingOrder(null);
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="dispatch-page">
      <header className="dispatch-header">
        <div className="dispatch-header-left">
          <div className="dispatch-header-icon">
            <FiActivity />
          </div>
          <div>
            <h1>Production Dispatch Center</h1>
            <p>Real-time SAP Work Orders &amp; Supervisory Control</p>
          </div>
        </div>

        <div className="dispatch-header-right">
          <div className="live-status-pill">
            <span className="pulse-dot"></span>
            <span>MES LIVE CONNECTED</span>
          </div>
          <button className="btn-action-top" onClick={() => window.print()} title="Print Dispatch Sheet">
            <FiPrinter /> Print Sheet
          </button>
        </div>
      </header>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-top"><span>Total Orders</span><FiLayers className="kpi-icon" /></div>
          <div className="kpi-value">{stats.total}</div>
          <span className="kpi-caption">Today's active queue</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span>Pending Release</span><FiClock className="kpi-icon" /></div>
          <div className="kpi-value">{stats.pending}</div>
          <span className="kpi-caption">Ready for shop floor</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span>Dispatched / Active</span><FiZap className="kpi-icon" /></div>
          <div className="kpi-value">{stats.released}</div>
          <span className="kpi-caption">Running on workstations</span>
        </div>
        <div className="kpi-card kpi-danger">
          <div className="kpi-top"><span>Exceptions</span><FiAlertTriangle className="kpi-icon" /></div>
          <div className="kpi-value">{stats.exceptions}</div>
          <span className="kpi-caption">Requires intervention</span>
        </div>
      </div>

      <div className="control-bar">
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('Pending'))}
          >
            Pending Release ({stats.pending})
          </button>
          <button
            className={`tab-btn ${activeTab === 'Released' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('Released'))}
          >
            Released / Active ({stats.released})
          </button>
          <button
            className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('All'))}
          >
            All Orders ({stats.total})
          </button>
        </div>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Order, SKU, Workstation..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      </div>

      <div className="filters-toolbar">
        <div className="filter-item">
          <span className="filter-label">
            <span><img src={workStationImg} alt="" width={15} height={15} /></span> Workstation Line:
          </span>
          <select
            value={selectedWorkstation}
            onChange={(e) => dispatch(setSelectedWorkstation(e.target.value))}
            className="filter-select"
          >
            <option value="ALL">All Workstations</option>
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">
            <span><img src={orderPriorityImg} alt="" width={15} height={15} /></span> Priority:
          </span>
          <select
            value={selectedPriority}
            onChange={(e) => dispatch(setSelectedPriority(e.target.value))}
            className="filter-select"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">
            <span><img src={calendarImg} alt="" width={15} height={15} /></span> Date Sort:
          </span>
          <button
            className="btn-filter-toggle"
            onClick={() => dispatch(setDateSortOrder(dateSortOrder === 'ASC' ? 'DESC' : 'ASC'))}
            title="Toggle Schedule Order"
          >
            {dateSortOrder === 'ASC' ? 'Earliest' : 'Latest'}
          </button>
        </div>

        {(selectedWorkstation !== 'ALL' || selectedPriority !== 'ALL' || searchQuery !== '' || dateSortOrder !== 'ASC') && (
          <button className="btn-reset-filters" onClick={handleReset} title="Reset all filters">
            <FiRotateCcw /> Reset Filters
          </button>
        )}
      </div>

      <div className="orders-queue">
        {loading ? (
          <div className="empty-state"><p>Loading work orders </p></div>
        ) : workOrders.length === 0 ? (
          <div className="empty-state">
            <p>No production orders match the selected criteria.</p>
            <button className="btn-reset-filters" style={{ margin: '10px auto 0 auto' }} onClick={handleReset}>
              Clear Active Filters
            </button>
          </div>
        ) : (
          workOrders.map((order) => {
            const progressPercent = Math.round((order.CompletedQuantity / order.TargetQuantity) * 100) || 0;

            return (
              <div
                key={order.WorkOrderNumber}
                className={`order-card priority-${order.Priority?.toLowerCase()} ${
                  order.HasException ? 'has-exception' : ''
                }`}
              >
                {order.HasException && (
                  <div className="order-alert-sidebanner">
                    {order.alertImage ? (
                      <img src={order.alertImage} alt="Exception Alert" className="alert-custom-img" />
                    ) : (
                      <div className="alert-banner-content">
                        <FiAlertTriangle className="alert-banner-icon" />
                        <span className="alert-banner-text">ALERT</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="order-card-main">
                  <div className="order-identity">
                    <div className="order-id-row">
                      <span className="order-id">{order.WorkOrderNumber}</span>
                      <span className={`priority-tag ${order.Priority?.toLowerCase()}`}>
                        {order.Priority}
                      </span>
                    </div>
                    <div className="order-sku-row">
                      <FiPackage className="inline-icon" />
                      <span className="sku-code">{order.SKU}</span>
                    </div>
                    {order.HasException===true && (
                      <div className="exception-note">
                        <FiAlertTriangle /> {order.ExceptionMessage}
                      </div>
                    )}
                  </div>

                  <div className="order-progress-block">
                    <div className="progress-label-row">
                      <span>{order.CompletedQuantity} / {order.TargetQuantity} units</span>
                      <span className="progress-percent">{progressPercent}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${order.HasException ? 'fill-danger' : ''}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="order-schedule-grid">
                    <div className="schedule-badge">
                      <FiClock className="sched-icon" />
                      <div className="sched-info">
                        <span className="sched-label">Start Time</span>
                        <span className="sched-value">{order.PlannedStartTime.replace('T', ' - ')}</span>
                      </div>
                    </div>
                    <div className="schedule-badge">
                      <FiCalendar className="sched-icon" />
                      <div className="sched-info">
                        <span className="sched-label">End Time</span>
                        <span className="sched-value">{order.PlannedEndTime.replace('T', ' - ')}</span>
                      </div>
                    </div>
                    <div className="schedule-badge workstation">
                      <FiMapPin className="sched-icon" />
                      <div className="sched-info">
                        <span className="sched-label">Workstation</span>
                        <span className="sched-value-ws">{order.WorkCenterName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-card-side">
                  <span className={`status-badge ${order.Status?.toLowerCase().replace(' ', '-')}`}>
                    {order.Status}
                  </span>
                  <div className="order-actions">
                    {order.Status !== 'Released' ? (
                      <button
                        className="btn-release"
                        onClick={() => handleRelease(order.WorkOrderID)}
                        disabled={order.HasException || order.Status === 'On Hold'}
                        title={
                          order.HasException
                            ? 'Cannot release with active exception'
                            : order.Status === 'On Hold'
                            ? 'Resume order before releasing'
                            : 'Release to WinForms Operator Terminal'
                        }
                      >
                        <FiPlay /> Release
                      </button>
                    ) : (
                      <button className="btn-dispatched" disabled>
                        <FiCheckCircle /> Dispatched
                      </button>
                    )}

                    <button
                      className={`btn-hold-icon ${order.Status === 'On Hold' ? 'is-on-hold' : ''}`}
                      onClick={() => handleToggleHold(order.WorkOrderID)}
                      title={order.Status === 'On Hold' ? 'Resume order' : 'Place order on hold'}
                    >
                      <FiPauseCircle />
                    </button>
                    {order.Status !== 'Released' && (
                      <button
                        className="btn-edit-icon"
                        onClick={() => handleOpenEditModal(order)}
                        title="Edit Order Parameters (Target Qty, Priority, Line, Schedule)"
                      >
                        <FiEdit />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pagination-footer">
        <div className="pagination-info">
          Showing <strong>{workOrders.length}</strong> of <strong>{totalCount}</strong> orders
        </div>
        <div className="pagination-controls">
          <button
            className="page-btn"
            disabled={pageNumber === 1}
            onClick={() => dispatch(setPageNumber(Math.max(pageNumber - 1, 1)))}
          >
            <FiChevronLeft /> Previous
          </button>
          <span className="page-indicator">Page {pageNumber} of {totalPages}</span>
          <button
            className="page-btn"
            disabled={pageNumber >= totalPages}
            onClick={() => dispatch(setPageNumber(Math.min(pageNumber + 1, totalPages)))}
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>

     {/*  {editingOrder && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Order Parameters: <span>{editingOrder.id}</span></h3>
              <button className="btn-close" onClick={() => setEditingOrder(null)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-body">
              <div className="form-group">
                <label>SKU &amp; Material Description</label>
                <input
                  type="text"
                  value={`${editingOrder.sku} - ${editingOrder.description}`}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingOrder.targetQty}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, targetQty: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Priority Level</label>
                  <select
                    value={editingOrder.priority}
                    onChange={(e) => setEditingOrder({ ...editingOrder, priority: e.target.value })}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Workstation (Routing)</label>
                <select
                  value={editingOrder.workstation}
                  onChange={(e) => setEditingOrder({ ...editingOrder, workstation: e.target.value })}
                >
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Planned Start Time</label>
                  <input
                    type="text"
                    value={editingOrder.plannedStart}
                    onChange={(e) => setEditingOrder({ ...editingOrder, plannedStart: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Planned End Time</label>
                  <input
                    type="text"
                    value={editingOrder.plannedEnd}
                    onChange={(e) => setEditingOrder({ ...editingOrder, plannedEnd: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditingOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FiCheck /> Save Order Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DispatchList;
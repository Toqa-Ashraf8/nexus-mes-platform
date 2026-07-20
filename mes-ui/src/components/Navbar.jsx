import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiLayers, 
  FiChevronDown, 
  FiBox, 
  FiActivity, 
  FiSettings,
  FiTrendingUp, 
  FiGrid, 
  FiClipboard, 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiFileText, 
  FiPieChart, 
  FiTool, 
  FiBarChart2, 
  FiShield, 
  FiCpu, 
  FiUsers, 
  FiPackage, 
  FiDatabase
} from 'react-icons/fi';

import './Navbar.css';

const MODULES = [
  {
    key: 'production',
    label: 'Operations & Execution',
    icon: FiSettings,
    header: 'Production Management',
    colorClass: 'prod', 
    items: [
      { to: '/order-dispatching', label: 'Dispatch List', icon: FiGrid },
      { to: '/process-definition', label: 'Route & Recipe Config', icon: FiLayers },
      { to: '/wip-tracking', label: 'Live WIP Tracking', icon: FiActivity },
      { to: '/digitized-instructions', label: 'E-Work Instructions', icon: FiFileText },
    ],
  },
  {
    key: 'quality',
    label: 'Quality & Compliance',
    icon: FiShield,
    header: 'Quality Management System',
    colorClass: 'qa', 
    items: [
      { to: '/inspection-plans', label: 'Inspection Master', icon: FiClipboard },
      { to: '/ncr-management', label: 'Non-Conformance (NCR)', icon: FiAlertTriangle },
      { to: '/genealogy', label: 'Product Traceability', icon: FiRefreshCw },
    ],
  },
  {
    key: 'assets',
    label: 'Asset Performance',
    icon: FiCpu,
    header: 'Maintenance & OEE',
    colorClass: 'maint', 
    items: [
      { to: '/oee-dashboard', label: 'OEE Real-time', icon: FiPieChart },
      { to: '/preventive-maintenance', label: 'Maintenance Schedule', icon: FiTool },
      { to: '/alarms-log', label: 'Machine Alarms History', icon: FiActivity },
    ],
  },
  {
    key: 'analytics',
    label: 'Operational Intelligence',
    icon: FiTrendingUp,
    header: 'Performance Analytics',
    colorClass: 'pur', 
    items: [
      { to: '/downtime-analysis', label: 'Downtime Pareto', icon: FiBarChart2 },
      { to: '/scrap-reports', label: 'Scrap & Yield Analysis', icon: FiBox },
    ],
  },
  {
    key: 'workforce',
    label: 'Workforce Management',
    icon: FiUsers,
    header: 'Workforce & Resource Management',
    colorClass: 'fin', 
    items: [
      { to: '/personnel-directory', label: 'Personnel Mapping', icon: FiUsers },
      { to: '/qualification-matrix', label: 'Skill Matrix', icon: FiClipboard }, 
      { to: '/operator-performance-history', label: 'Performance History', icon: FiTrendingUp },
    ],
  },
  {
    key: 'inventory',
    label: 'Inventory & Flow',
    icon: FiPackage,
    header: 'Inventory & Material Flow',
    colorClass: 'inv', 
    items: [
      { to: '/material-lot-tracking', label: 'Lot Tracking', icon: FiLayers },
      { to: '/raw-material-reception', label: 'Material Reception', icon: FiBox },
    ],
  }, 
  {
    key: 'integration',
    label: 'Integration Monitor',
    icon: FiDatabase,
    header: 'System Integration Monitor',
    colorClass: 'log', 
    items: [
      { to: '/erp-message-log', label: 'ERP Message Log', icon: FiFileText },
    ],
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (menuName) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="cyber-navbar">
      <div className="cyber-nav-container" ref={dropdownRef}>
        
        <div className="cyber-nav-links">
          {MODULES.map((mod) => {
            const TopIcon = mod.icon;
            const isActive = activeDropdown === mod.key;
            return (
              <div
                key={mod.key}
                className={`cyber-dropdown-wrapper ${isActive ? 'active' : ''}`}
              >
                <button
                  className="cyber-nav-btn"
                  onClick={() => toggleDropdown(mod.key)}
                >
                  <span className={`nav-icon-lead ${mod.colorClass}-icon`}>
                    <TopIcon />
                  </span>
                  <span>{mod.label}</span>
                  <FiChevronDown className={`chevron-arrow ${isActive ? 'rotate' : ''}`} />
                </button>

                {isActive && (
                  <div className="cyber-premium-menu">
                    <div className="menu-header">{mod.header}</div>
                    {mod.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          className="cyber-menu-item"
                          to={item.to}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className={`item-icon-box ${mod.colorClass}-box`}>
                            <ItemIcon />
                          </div>
                          <span className="item-title">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="system-status-badge">
          <div className="pulse-dot"></div>
          <span>Factory Server: Connected</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
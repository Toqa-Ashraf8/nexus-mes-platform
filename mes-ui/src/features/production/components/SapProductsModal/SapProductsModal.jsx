import React, { useState } from 'react';
import './SapProductsModal.css';

const SapProductsModal = ({ products, onSelectProduct, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter(prod => 
    prod.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sap-modal-overlay" onClick={onClose}>
      <div className="sap-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="sap-modal-header">
          <div className="sap-modal-title">
            <i className="fa fa-exchange-alt sap-icon-sync"></i>
            <div>
              <h3>SAP ERP Master Products</h3>
              <p>Select a product definition to import routing, BOM, and PLC recipes</p>
            </div>
          </div>
          <button className="sap-modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="sap-modal-search-wrapper">
          <i className="fa fa-search sap-search-icon"></i>
          <input 
            type="text" 
            placeholder="Search by Product ID or Description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sap-modal-search-input"
          />
        </div>
        <div className="sap-modal-body">
          {isLoading ? (
            <div className="sap-modal-loading">
              <i className="fa fa-spinner fa-spin"></i>
              <p>Fetching master data from SAP Middleware...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="sap-modal-empty">
              <i className="fa fa-folder-open"></i>
              <p>No products found matching your search.</p>
            </div>
          ) : (
            <div className="sap-table-responsive">
              <table className="sap-modal-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Description</th>
                    <th>Version</th>
                    <th>Segments Count</th>
                    <th style={{ textAlignment: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id}>
                      <td className="sap-prod-id">{prod.id}</td>
                      <td>{prod.description}</td>
                      <td>
                        <span className="sap-badge-version">v{prod.version}</span>
                      </td>
                      <td>
                        <span className="sap-badge-segments">
                          {prod.productSegments?.length || 0} Steps
                        </span>
                      </td>
                      <td style={{ textAlignment: 'center' }}>
                        <button 
                          className="sap-btn-select"
                          onClick={() => {
                            onSelectProduct(prod.id);
                            onClose();
                          }}
                        >
                          <i className="fa fa-check-circle"></i> Import Data
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="sap-modal-footer">
          <span className="sap-total-count">Total Items: {filteredProducts.length}</span>
          <button className="sap-btn-close" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
};

export default SapProductsModal;
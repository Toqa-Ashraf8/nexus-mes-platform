import React, { useEffect, useState } from 'react';
import './SapProductsModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { fillFormWithSAPValues, toggleProductsModal } from '../../slices/processDefinitionSlice';
import { fetchSapProducts } from '../../services/processDefinitionService';

const SapProductsModal = () => {
  const {products}=useSelector((state)=>state.processDefinition);
  const dispatch=useDispatch();


useEffect(()=>{
    dispatch(fetchSapProducts());
},[dispatch])
console.log("products",products)
  return (
    <div className="sap-modal-overlay" >
      <div className="sap-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="sap-modal-header">
          <div className="sap-modal-title">
            <i className="fa fa-exchange-alt sap-icon-sync"></i>
            <div>
              <h3>SAP ERP Master Products</h3>
            </div>
          </div>
          <button className="sap-modal-close-btn"
          onClick={()=>dispatch(toggleProductsModal(false))}
          >&times;</button>
        </div>
       
        <div className="sap-modal-body">
    
            <div className="sap-table-responsive">
              <table className="sap-modal-table">
                <thead>
                  <tr>
                    <th>Product SKU</th>
                    <th>Description</th>
                    <th>Version</th>
                    <th>Segments Count</th>
                  </tr>
                </thead>
              <tbody>
            {products && products.length > 0 ? (
                products.map((product, index) => (
                <tr key={index} style={{cursor:'pointer'}} onClick={()=>dispatch(fillFormWithSAPValues(index))}>
                    <td className="sap-prod-id">{product.SKU}</td>
                    <td>{product.Description}</td>
                    <td>
                    <span className="sap-badge-version">
                        v{product.Version}
                    </span>
                    </td>
                    <td>
                    <span className="sap-badge-segments">
                         {product.ProductSegments.length} Steps
                    </span>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No products found from SAP.
                </td>
                </tr>
            )}
            </tbody>
              </table>
            </div>
        </div>
        <div className="sap-modal-footer">
          <span className="sap-total-count">Total Items: {products ? products.length : 0}</span>
          <button className="sap-btn-close"  
          onClick={()=>dispatch(toggleProductsModal(false))}>
          Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SapProductsModal;
import React from 'react';
import { 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiPackage, 
  FiSettings, 
  FiList, 
  FiFileText, 
  FiLayers,
  FiRefreshCw,
  FiCopy,
  FiCheckCircle,
  FiSend
} from 'react-icons/fi';
import './ProcessDefinition.css';
import { useDispatch, useSelector } from 'react-redux';
import SapProductsModal from '../components/SapProductsModal/SapProductsModal';
import { 
  setProductsValues, 
  toggleProductsModal,
  addSegmentToProduct,
  removeSegmentFromProduct,
  addEquipmentRequirement,
  updateEquipmentRequirement,
  removeEquipmentRequirement,
  addPersonnelRequirement,
  updatePersonnelRequirement,
  removePersonnelRequirement,
  addMaterialRequirement,
  updateMaterialRequirement,
  removeMaterialRequirement,
  addParameter,
  updateParameter,
  removeParameter,
  updateSegmentField,
  setSegmentActiveTab
} from '../slices/processDefinitionSlice';
import { toast } from 'react-toastify';
import { fetchSapProducts, releaseProduct } from '../services/processDefinitionService';

const ProcessDefinition = () => {
  const { isProductsModalOpen, product } = useSelector((state) => state.processDefinition);
  const dispatch = useDispatch();
  const currentSegments = product?.ProductSegments || [];

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    dispatch(setProductsValues({ [name]: value }));
  };

  const handleCloneRoute = () => {
    alert('Opening Clone Route Selection Modal...');
  };

  const handleValidateConfig = () => {
    alert('Validating Route sequence, station assignments, and PLC tolerances...');
  };

  const handleSaveDraft = () => {
    alert('Saving current configuration as Draft...');
  };

  const handleApproveAndRelease = async()=> {
    const releasedProduct={...product,DefinitionStatus:"Released"};
   try { 
    const result=await dispatch(releaseProduct(releasedProduct)).unwrap();
    if(result){
      toast.success(result.message || "Product Definition successfully approved & saved!");
    }
   } catch (error) { toast.error(error)} 
     dispatch(fetchSapProducts());
  };

  return (
    <div className="mes-container">
      {isProductsModalOpen && <SapProductsModal />}
      
      <header className="mes-navbar">
        <div className="mes-logo-zone">
          <div>
            <h1>Product Definition Master</h1>
            <p>Production Routing & Process Recipe Configuration</p>
          </div>
        </div>
        
        <div className="mes-nav-actions">
          <button className="mes-btn-outline" onClick={() => dispatch(toggleProductsModal(true))}>
            <FiRefreshCw /> Fetch from SAP
          </button>
          <button className="mes-btn-outline" onClick={handleCloneRoute}>
            <FiCopy /> Clone Existing Route
          </button>
        </div>
      </header>

      <main className="mes-workspace">
        <section className="mes-meta-bar">
          <div className="meta-item">
            <span className="meta-label">PRODUCT SKU</span>
            <span className="meta-value">{product?.SKU || "-"}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ROUTE VERSION</span>
            <input 
              type="text" 
              className="meta-desc-input"
              name="Version"
              value={product?.Version || ''}
              onChange={handleChangeProduct}
            /> 
          </div>
          <div className="meta-item description-item">
            <span className="meta-label">ROUTE DESCRIPTION</span>
            <input 
              type="text" 
              className="meta-desc-input"
              name="Description"
              value={product?.Description || ''}
              onChange={handleChangeProduct}
            /> 
          </div>

          <div className="meta-actions-zone">
            <button className="mes-btn-secondary" onClick={handleValidateConfig}>
              <FiCheckCircle /> Validate Configuration
            </button>
            <button className="mes-btn-secondary" onClick={handleSaveDraft}>
              <FiSave /> Save as Draft
            </button>
            <button className="mes-btn-success" onClick={handleApproveAndRelease}>
              <FiSend /> Approve & Release
            </button>
          </div>
        </section>

        <div className="mes-routing-flow">
          {currentSegments.length === 0 ? ( 
            <div className="mes-empty-state" style={{ padding: '40px', textAlign: 'center' }}>
              <FiLayers size={40} style={{ color: '#64748b', marginBottom: '12px' }} />
              <p style={{ color: '#94a3b8' }}>No process routing segments loaded yet. Fetch from SAP or click below to add a step.</p>
            </div>
          ) : (
            currentSegments.map((seg, segIdx) => ( 
              <div key={seg.SequenceNo || segIdx} className="mes-step-card">
                <div className="mes-step-header">
                  <div className="step-ident">
                    <span className="step-seq-badge">{seg.SequenceNo || '0'}</span>
                    <input 
                      type="text" 
                      className="step-name-input-field" 
                      value={seg.SequenceName || ''}
                      onChange={(e) => dispatch(updateSegmentField({ segIdx, fieldName: 'SequenceName', value: e.target.value }))}
                      placeholder="Enter Operation Name" 
                    />  
                  </div>
                  
                  <div className="mes-tabs-row">
                    <button 
                      className={`tab-trigger ${(!seg.activeTab || seg.activeTab === 'station') ? 'active' : ''}`}
                      onClick={() => dispatch(setSegmentActiveTab({ segIdx, tabName: 'station' }))}
                    >
                      <FiSettings /> Resources
                    </button>
                    <button 
                      className={`tab-trigger ${seg.activeTab === 'bom' ? 'active' : ''}`}
                      onClick={() => dispatch(setSegmentActiveTab({ segIdx, tabName: 'bom' }))}
                    >
                      <FiPackage /> BOM Allocation ({seg.MaterialRequirements?.length || 0})
                    </button>
                    <button 
                      className={`tab-trigger ${seg.activeTab === 'parameters' ? 'active' : ''}`}
                      onClick={() => dispatch(setSegmentActiveTab({ segIdx, tabName: 'parameters' }))}
                    >
                      <FiList /> PLC Recipes ({seg.Parameters?.length || 0}) 
                    </button>
                  </div>

                  <button className="mes-btn-danger-icon" onClick={() => dispatch(removeSegmentFromProduct(segIdx))}>
                    <FiTrash2 />
                  </button>
                </div>

                <div className="mes-step-body">
                  {(!seg.activeTab || seg.activeTab === 'station') && (
                    <div className="tab-content-grid animate-fade">
                      <div className="resource-inputs">
                        
                        <div className="mes-form-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label>Equipment Classes / Workstations ({seg.EquipmentRequirements?.length || 0})</label>
                          </div>

                          {seg.EquipmentRequirements?.map((eq, eqIdx) => (
                            <div key={eqIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                              <select 
                                className="mes-input"
                                value={eq.EquipmentClassID || ''}
                                onChange={(e) => dispatch(updateEquipmentRequirement({ segIdx, eqIdx, value: e.target.value }))}
                              >
                                <option value="">Select Workstation</option>
                                <option key={eq.EquipmentClassID} value={eq.EquipmentClassID}>{eq.EquipmentClassID}</option>
                              </select>
                              <button 
                                type="button" 
                                className="btn-row-delete" 
                                onClick={() => dispatch(removeEquipmentRequirement({ segIdx, eqIdx }))}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mes-form-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label>Personnel Classes ({seg.PersonnelRequirements?.length || 0})</label>
                          </div>

                          {seg.PersonnelRequirements?.map((person, pIdx) => (
                            <div key={pIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                              <select 
                                className="mes-input"
                                value={person.PersonnelClassID || ''}
                                onChange={(e) => dispatch(updatePersonnelRequirement({ segIdx, pIdx, value: e.target.value }))}
                              > 
                                <option value="">Select Personnel</option>
                                <option key={person.PersonnelClassID} value={person.PersonnelClassID}>{person.PersonnelClassID}</option>
                               
                              </select>
                              <button 
                                type="button" 
                                className="btn-row-delete" 
                                onClick={() => dispatch(removePersonnelRequirement({ segIdx, pIdx }))}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mes-form-group">
                          <label>Standard Execution Time</label>
                          <div className="mes-input-unit-wrapper">
                            <input 
                              type="number" 
                              className="mes-input" 
                              value={seg.standardTimeMin || ''}
                              onChange={(e) => dispatch(updateSegmentField({ segIdx, fieldName: 'standardTimeMin', value: e.target.value }))}
                            />
                            <span className="input-unit-tag">Min</span>
                          </div>
                        </div>
                      </div>

                      <div className="sop-editor-zone">
                        <label className="sop-label"><FiFileText /> Operator Digital SOP Instructions</label>
                        <textarea 
                          className="mes-textarea"
                          value={seg.Instructions || ''}
                          onChange={(e) => dispatch(updateSegmentField({ segIdx, fieldName: 'Instructions', value: e.target.value }))}
                          placeholder="Write dynamic step-by-step SOP instructions for the station HMI display..."
                        />
                      </div>
                    </div>
                  )}

                  {seg.activeTab === 'bom' && (
                    <div className="tab-content-clean animate-fade">
                      <div className="bom-allocation-header" style={{ marginBottom: '12px', textAlign: 'right' }}>
                        <button className="mes-btn-secondary-sm" onClick={() => dispatch(addMaterialRequirement(segIdx))}>
                          <FiPlus /> Add Material Item
                        </button>
                      </div>

                      <div className="bom-items-table-view">
                        {(!seg.MaterialRequirements || seg.MaterialRequirements.length === 0) ? (
                          <div className="mes-empty-state">
                            <FiLayers size={24} />
                            <p>No materials linked to this operation segment yet.</p>
                          </div>
                        ) : (
                          <div className="bom-table-grid">
                            <div className="bom-table-header">
                              <span>Material Definition ID</span>
                              <span>Target Qty</span>
                              <span>Unit</span>
                              <span>Action</span>
                            </div>
                            {seg.MaterialRequirements.map((item, bIdx) => (
                              <div key={bIdx} className="bom-table-row">
                               
                                <input 
                                  type="text" 
                                  className="recipe-input-txt"
                                  value={item.MaterialDefinitionID || ''}
                                  onChange={(e) => dispatch(updateMaterialRequirement({ segIdx, matIdx: bIdx, fieldName: 'MaterialDefinitionID', value: e.target.value }))}
                                />
                                <input 
                                  type="number" 
                                  className="bom-qty-input" 
                                  value={item.Quantity || ""}
                                  onChange={(e) => dispatch(updateMaterialRequirement({ segIdx, matIdx: bIdx, fieldName: 'Quantity', value: e.target.value }))}
                                />
                                <input 
                                  type="text" 
                                  className="recipe-input-unit"
                                  value={item.UnitOfMeasure || ''}
                                  onChange={(e) => dispatch(updateMaterialRequirement({ segIdx, matIdx: bIdx, fieldName: 'UnitOfMeasure', value: e.target.value }))}
                                />
                                <button className="btn-row-delete" onClick={() => dispatch(removeMaterialRequirement({ segIdx, matIdx: bIdx }))}>
                                  <FiTrash2 />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {seg.activeTab === 'parameters' && (
                    <div className="tab-content-clean animate-fade">
                      <div className="recipe-toolbar">
                        <p className="section-note">Define machine setpoints and acceptable sensor tolerance values for automated PLC validation.</p>
                        <button className="mes-btn-secondary-sm" onClick={() => dispatch(addParameter(segIdx))}>
                          <FiPlus /> Add Recipe Parameter
                        </button>
                      </div>

                      <div className="recipe-parameters-list">
                        {(!seg.Parameters || seg.Parameters.length === 0) ? (
                          <div className="mes-empty-state">
                            <FiList size={24} />
                            <p>No PLC parameters or HMI tolerances configured for this step.</p>
                          </div>
                        ) : (
                          <div className="recipe-table">
                            <div className="recipe-th">
                              <span>PLC Tag / Variable</span>
                              <span>Target Value</span>
                              <span>UOM</span>
                              <span>Remove</span>
                            </div>
                            
                            {seg.Parameters.map((param, pIdx) => (
                              <div key={pIdx} className="recipe-tr"> 
                              
                                <input 
                                  type="text" 
                                  className="recipe-input-txt"   
                                  value={param.Tag || ''}
                                  onChange={(e) => dispatch(updateParameter({ segIdx, pIdx, fieldName: 'Tag', value: e.target.value }))}
                                />
                                <input 
                                  type="number" 
                                  className="recipe-input-num"   
                                  value={param.Value || ''}
                                  onChange={(e) => dispatch(updateParameter({ segIdx, pIdx, fieldName: 'Value', value: e.target.value }))}
                                />
                                <input 
                                  type="text" 
                                  className="recipe-input-unit"
                                  value={param.UnitOfMeasure || ''}
                                  onChange={(e) => dispatch(updateParameter({ segIdx, pIdx, fieldName: 'UnitOfMeasure', value: e.target.value }))}
                                />
                                <button className="btn-row-delete" onClick={() => dispatch(removeParameter({ segIdx, pIdx }))}>
                                  <FiTrash2 />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))
          )} 

          <button className="mes-btn-add-step-large" onClick={() => dispatch(addSegmentToProduct())}>
            <FiPlus /> Append New Operation Segment
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProcessDefinition;
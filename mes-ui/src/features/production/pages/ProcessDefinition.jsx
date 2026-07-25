import React from 'react';
import { 
  FiPlus, 
  FiTrash2, 
  FiPackage, 
  FiSettings, 
  FiList, 
  FiFileText,  
  FiSend, 
  FiUserPlus, 
  FiCpu, 
  FiImage, 
  FiVideo, 
  FiEdit, 
  FiX, 
  FiEye, 
  FiCopy, 
  FiClock,
  FiDatabase,
  FiShield
} from 'react-icons/fi';

import './ProcessDefinition.css';
import { useDispatch, useSelector } from 'react-redux';
import SapProductsModal from '../components/SapProductsModal/SapProductsModal';
import { 
  setProductsValues, 
  addSegmentToProduct, 
  insertSegmentBetween,
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
  setSegmentActiveTab,
  deleteInstructionStep,
  setViewSopModal,
  resetProductForm,
  toggleProductsModal,
  toggleActiveStepModal
} from '../slices/processDefinitionSlice';
import { toast } from 'react-toastify';
import { fetchSapProducts, releaseProduct, saveSapProducts } from '../services/processDefinitionService';
import { IoSearch } from "react-icons/io5";
import WorkInstructionsModal from '../components/WorkInstructionsModal/WorkInstructionsModal';
import { AiOutlineClear } from "react-icons/ai";

const ProcessDefinition = () => {
  const ImageUrl = import.meta.env.VITE_IMAGES_BASE_URL;
  const dispatch = useDispatch();
  const { 
    isProductsModalOpen, 
    product, 
    activeStepModal, 
    viewSopModal,
    products 
  } = useSelector((state) => state.processDefinition);
  const currentSegments = product?.ProductSegments || [];

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    dispatch(setProductsValues({ [name]: value }));
  };

  const handleApproveAndRelease = async () => {
    try { 
      const result = await dispatch(releaseProduct(product)).unwrap();
      if (result) toast.success(result.message || "Product Definition released!");
    } catch (error) { 
      toast.error(error);
    } 
    dispatch(fetchSapProducts());
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data on this screen?")) {
      dispatch(resetProductForm());
      toast.warn("Screen reset to new blank sheet.");
    }
  };

  const handleInsertSegmentBetween = (indexBefore) => {
    dispatch(insertSegmentBetween(indexBefore));
    toast.info(`Inserted Step`);
  };

  const handleSaveSapData = async () => {
    try {
      const result = await dispatch(saveSapProducts()).unwrap();
      if (result) {
        toast.success(result.message);
      }
    } catch (error) {}
  };

  const handleAddInstructionStep = (segIdx) => {
    const steps = currentSegments[segIdx]?.WorkInstructionSteps || [];
    const newStep = {
      StepSequence: steps.length + 1,
      Description: '',
      Category: '',
      CategoryUrl: '',
      ImageUrl: '',
      VideoUrl: ''
    };
    dispatch(toggleActiveStepModal({ segIdx, stepIdx: steps.length, stepData: newStep, isNew: true }));
  };
console.log("product",product)
console.log("products",products)

  return (
    <div className="mes-container">
      {isProductsModalOpen && <SapProductsModal />}
      {activeStepModal && <WorkInstructionsModal />}
      
      <aside className="mes-actions-sidebar">
        <button className="sidebar-action-btn sync" onClick={handleSaveSapData}>
          <FiDatabase /><span className="tooltip">Save SAP Data</span>
        </button>
        <button className="sidebar-action-btn search" onClick={() => dispatch(toggleProductsModal(true))}>
          <IoSearch /><span className="tooltip">Get Products</span>
        </button>
        <button className="sidebar-action-btn save" onClick={handleApproveAndRelease}>
          <FiSend /><span className="tooltip">Release Product Definition</span>
        </button>
        <button className="sidebar-action-btn verify" onClick={handleClearAll}>
          <AiOutlineClear /><span className="tooltip">Clear Form</span>
        </button>
        <button className="sidebar-action-btn duplicate">
          <FiFileText /><span className="tooltip">Save as Draft</span>
        </button>
        <button className="sidebar-action-btn undo">
          <FiShield /><span className="tooltip">Validation</span>
        </button>
        <button className="sidebar-action-btn clone">
          <FiCopy /><span className="tooltip">Clone Product</span>
        </button>
      </aside>

      {/* Main Navbar */}
      <header className="mes-navbar centered">
        <div className="mes-title-centered">
          <h1>Product Definition Master</h1>
          <p>Production Routing & Process Recipe Configuration</p>
        </div>
      </header>

      <main className="mes-workspace">
        {/* Routing Meta Header */}
        <section className="mes-meta-bar" style={{ textAlign: 'center' }}>
          <div className="meta-item">
            <span className="meta-label">PRODUCT SKU</span>
            <input type="text" className="meta-desc-input" name="SKU" value={product?.SKU || ''} onChange={handleChangeProduct} /> 
          </div>
          <div className="meta-item">
            <span className="meta-label">ROUTE VERSION</span>
            <input type="text" className="meta-desc-input" name="Version" value={product?.Version || ''} onChange={handleChangeProduct} /> 
          </div>
          <div className="meta-item description-item">
            <span className="meta-label">ROUTE DESCRIPTION</span>
            <input type="text" className="meta-desc-input" name="Description" value={product?.Description || ''} onChange={handleChangeProduct} /> 
          </div>
        </section>

        {/* Process Flow Operations */}
        <div className="mes-routing-flow">
          {currentSegments.map((seg, segIdx) => ( 
            <React.Fragment key={seg.SequenceNo || segIdx}>
              
              <div className="mes-step-card">
                {/* Step Header */}
                <div className="mes-step-header">
                  <div className="step-ident">
                    <span className="step-seq-badge">Step {seg.SequenceNo || (segIdx + 1) * 10}</span>
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
                      <FiSettings /> Resources & SOP
                    </button>
                    <button 
                      className={`tab-trigger ${seg.activeTab === 'bom' ? 'active' : ''}`} 
                      onClick={() => dispatch(setSegmentActiveTab({ segIdx, tabName: 'bom' }))}
                    >
                      <FiPackage /> BOM Allocation
                    </button>
                    <button 
                      className={`tab-trigger ${seg.activeTab === 'parameters' ? 'active' : ''}`} 
                      onClick={() => dispatch(setSegmentActiveTab({ segIdx, tabName: 'parameters' }))}
                    >
                      <FiList /> PLC Recipes
                    </button>
                  </div>

                  <button 
                    className="mes-btn-danger-icon" 
                    title="Delete Operation" 
                    onClick={() => dispatch(removeSegmentFromProduct(segIdx))}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* Step Body */}
                <div className="mes-step-body">
                  
                  {/* TAB 1: RESOURCES & SOP */}
                  {(!seg.activeTab || seg.activeTab === 'station') && (
                    <div className="tab-content-grid animate-fade">
                      
                      <div className="resource-inputs">
                        {/* Step Standard Duration */}
                        <div className="mes-form-group">
                          <div className="group-header">
                            <label><FiClock /> Operation Duration</label>
                          </div>
                          <div className="mes-input-unit-wrapper">
                            <input 
                              type="number" 
                              className="mes-input" 
                              value={seg.standardTimeMin || ''} 
                              onChange={(e) => dispatch(updateSegmentField({ segIdx, fieldName: 'standardTimeMin', value: e.target.value }))}
                            />
                            <span className="input-unit-tag">min</span>
                          </div>
                        </div>

                        <div className="mes-form-group">
                          <div className="group-header">
                            <label><FiCpu /> Workstations / Equipment</label>
                            <button type="button" className="mes-btn-secondary-sm" onClick={() => dispatch(addEquipmentRequirement(segIdx))}>
                              <FiPlus /> Add
                            </button>
                          </div>
                          {seg.EquipmentRequirements && seg.EquipmentRequirements.length > 0 ? (
                            seg.EquipmentRequirements.map((eq, eqIdx) => (
                              <div key={eqIdx} className="input-action-row">
                                <input 
                                  type="text" 
                                  className="mes-input" 
                                  placeholder="Enter workstation or equipment class..." 
                                  value={eq.EquipmentClassName || eq.EquipmentClassID || ''} 
                                  onChange={(e) => dispatch(updateEquipmentRequirement({ segIdx, eqIdx, value: e.target.value }))}
                                />
                                <button type="button" className="btn-row-delete" onClick={() => dispatch(removeEquipmentRequirement({ segIdx, eqIdx }))}>
                                  <FiTrash2 />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="no-items-hint">No equipment assigned to this operation.</p>
                          )}
                        </div>

                        {/* Personnel Roles Requirements */}
                        <div className="mes-form-group">
                          <div className="group-header">
                            <label><FiUserPlus /> Personnel Roles</label>
                            <button type="button" className="mes-btn-secondary-sm" onClick={() => dispatch(addPersonnelRequirement(segIdx))}>
                              <FiPlus /> Add
                            </button>
                          </div>

                          {seg.PersonnelRequirements && seg.PersonnelRequirements.length > 0 ? (
                            seg.PersonnelRequirements.map((person, pIdx) => (
                              <div className="input-action-row" key={pIdx}>
                                <input 
                                  type="text"
                                  className="mes-input" 
                                  placeholder="Enter personnel role..."
                                  value={person.PersonnelClassName || person.PersonnelClassID || ""}
                                  onChange={(e) => dispatch(updatePersonnelRequirement({ segIdx, pIdx, value: e.target.value }))}
                                />
                                <button type="button" className="btn-row-delete" onClick={() => dispatch(removePersonnelRequirement({ segIdx, pIdx }))}>
                                  <FiTrash2 />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="no-items-hint">No personnel roles assigned.</p>
                          )} 
                        </div>
                      </div>

                      {/* Standard Work Instructions (SOP) Zone */}
                      <div className="sop-editor-zone">
                        <div className="sop-header-bar">
                          <label className="sop-label"><FiFileText /> Standard Work Instructions (SOP)</label>
                          <span className="sop-count-badge">{seg.WorkInstructionSteps?.length || 0} Steps</span>
                        </div>

                        <div className="instruction-bubbles-row">
                          {seg.WorkInstructionSteps?.map((st, stIdx) => (
                            <div 
                              key={stIdx} 
                              className="step-circle-btn" 
                              onClick={() => dispatch(toggleActiveStepModal({ segIdx, stepIdx: stIdx, stepData: { ...st }, isNew: false }))}
                            >
                              {st.StepSequence || stIdx + 1}
                            </div>
                          ))}
                          <button className="step-circle-add" onClick={() => handleAddInstructionStep(segIdx)}>
                            <FiPlus />
                          </button>
                        </div>

                        {(!seg.WorkInstructionSteps || seg.WorkInstructionSteps.length === 0) ? (
                          <div className="sop-empty-box">No instruction steps. Click <FiPlus /> circle to add.</div>
                        ) : (
                          <div className="sop-steps-table">
                            {seg.WorkInstructionSteps.map((st, stIdx) => (
                              <div key={stIdx} className="sop-table-row">
                                <span className="sop-seq">{st.StepSequence}</span>
                                {st.CategoryUrl && <img src={`${ImageUrl}Images/StepCategory/${st.CategoryUrl}`} className="sop-mini-symbol" alt="Symbol" />}
                                <div className="sop-desc">{st.Description || <i>No description</i>}</div>
                                
                                <div className="sop-media-indicators">
                                  {st.ImageUrls?.length > 0 && <span className="media-tag img"><FiImage /> {st.ImageUrls.length}</span>}
                                  {st.VideoUrl && <span className="media-tag vid"><FiVideo /> Vid</span>}
                                </div>

                                <div className="sop-row-actions">
                                  <button title="View SOP Sheet" onClick={() => dispatch(setViewSopModal({ segName: seg.SequenceName, step: st }))}><FiEye /></button>
                                  <button title="Edit Step" onClick={() => dispatch(toggleActiveStepModal({ segIdx, stepIdx: stIdx, stepData: { ...st }, isNew: false }))}><FiEdit /></button>
                                  <button title="Delete Step" className="del" onClick={() => dispatch(deleteInstructionStep({ segIdx, stepIdx: stIdx }))}><FiTrash2 /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 2: BOM ALLOCATION */}
                  {seg.activeTab === 'bom' && (
                    <div className="tab-content-clean animate-fade">
                      <div className="recipe-toolbar">
                        <button className="mes-btn-secondary-sm" onClick={() => dispatch(addMaterialRequirement(segIdx))}>
                          <FiPlus /> Add Material
                        </button>
                      </div>
                      <div className="bom-items-table-view">
                        {seg.MaterialRequirements?.map((item, bIdx) => (
                          <div key={bIdx} className="bom-table-row">
                            <input 
                              type="text" 
                              value={item.MaterialDefinitionID || item.MaterialDefinition || ''} 
                              placeholder="Material ID" 
                              onChange={(e) => dispatch(updateMaterialRequirement({ segIdx, matIdx: bIdx, fieldName: 'MaterialDefinitionID', value: e.target.value }))} 
                            />
                            <input 
                              type="number" 
                              value={item.Quantity || ''} 
                              placeholder="Qty" 
                              onChange={(e) => dispatch(updateMaterialRequirement({ segIdx, matIdx: bIdx, fieldName: 'Quantity', value: e.target.value }))} 
                            />
                            <input 
                              type="text" 
                              value={item.UnitOfMeasure || ''} 
                              placeholder="UOM" 
                              onChange={(e) => dispatch(updateMaterialRequirement({ segIdx, matIdx: bIdx, fieldName: 'UnitOfMeasure', value: e.target.value }))} 
                            />
                            <button className="btn-row-delete" onClick={() => dispatch(removeMaterialRequirement({ segIdx, matIdx: bIdx }))}>
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PLC RECIPES / PARAMETERS */}
                  {seg.activeTab === 'parameters' && (
                    <div className="tab-content-clean animate-fade">
                      <div className="recipe-toolbar">
                        <p className="section-note">Configure target setpoints and standard manufacturing tolerances for equipment Tags.</p>
                        <button className="mes-btn-secondary-sm" onClick={() => dispatch(addParameter(segIdx))}>
                          <FiPlus /> Add Tag Parameter
                        </button>
                      </div>

                      <div className="recipe-parameters-list">
                        <div className="recipe-th">
                          <div>PLC Tag / Parameter</div>
                          <div>Target Setpoint</div>
                          <div>Tolerance (±)</div>
                          <div>Unit</div>
                          <div style={{ textAlign: 'center' }}>Action</div>
                        </div>

                        {seg.Parameters && seg.Parameters.length > 0 ? (
                          seg.Parameters.map((param, pIdx) => (
                            <div key={pIdx} className="recipe-tr">
                              <input 
                                type="text" 
                                value={param.Tag || ''} 
                                placeholder="e.g. MIXER_SPEED" 
                                onChange={(e) => dispatch(updateParameter({ segIdx, pIdx, fieldName: 'Tag', value: e.target.value }))} 
                              />
                              <input 
                                type="number" 
                                className="recipe-input-num"
                                value={param.Value || ''} 
                                placeholder="1200" 
                                onChange={(e) => dispatch(updateParameter({ segIdx, pIdx, fieldName: 'Value', value: e.target.value }))} 
                              />
                              <input 
                                type="number" 
                                className="recipe-input-num"
                                value={param.Tolerance || ''} 
                                placeholder="5" 
                                onChange={(e) => dispatch(updateParameter({ segIdx, pIdx, fieldName: 'Tolerance', value: e.target.value }))} 
                              />
                              <input 
                                type="text" 
                                className="recipe-input-unit"
                                value={param.UnitOfMeasure || ''} 
                                placeholder="RPM / °C" 
                                onChange={(e) => dispatch(updateParameter({ segIdx, pIdx, fieldName: 'UnitOfMeasure', value: e.target.value }))} 
                              />
                              <button className="btn-row-delete" onClick={() => dispatch(removeParameter({ segIdx, pIdx }))}>
                                <FiTrash2 />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="mes-empty-state">
                            <p>No PLC recipe parameters defined for this operation segment.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Step In-between Divider */}
              {segIdx < currentSegments.length - 1 && (
                <div className="mes-insert-divider">
                  <div className="divider-line"></div>
                  <button className="mes-btn-insert-between" onClick={() => handleInsertSegmentBetween(segIdx)}>
                    <FiPlus /> Insert Step {Math.floor(((seg.SequenceNo || (segIdx + 1) * 10) + (currentSegments[segIdx + 1]?.SequenceNo || (segIdx + 2) * 10)) / 2)}
                  </button>
                  <div className="divider-line"></div>
                </div>
              )}

            </React.Fragment>
          ))} 

          {/* Append New Step Button */}
          <button className="mes-btn-add-step-large" onClick={() => dispatch(addSegmentToProduct())}>
            <FiPlus /> Append New Operation Segment
          </button>
        </div>
      </main>

      {/* View SOP Sheet Modal */}
      {viewSopModal && (
        <div className="mes-modal-overlay">
          <div className="mes-modal-card sop-sheet-modal">
            <div className="mes-modal-header">
              <h3>STANDARD WORK INSTRUCTION SHEET</h3>
              <button className="close-btn" onClick={() => dispatch(setViewSopModal(null))}><FiX /></button>
            </div>
            
            <div className="sop-sheet-body">
              <div className="sop-sheet-table">
                <div className="sop-table-header">
                  <div className="cell seq">Step</div>
                  <div className="cell symbol">Symbol</div>
                  <div className="cell desc">Operation Step</div>
                  <div className="cell pics">Pictures & Media</div>
                </div>

                <div className="sop-table-content">
                  <div className="cell seq">{viewSopModal.step.StepSequence}</div>
                  <div className="cell symbol">
                    {viewSopModal.step.SymbolUrl ? (
                      <img src={viewSopModal.step.SymbolUrl} alt="Symbol" className="sheet-symbol-img" />
                    ) : '-'}
                  </div>
                  <div className="cell desc">{viewSopModal.step.Description || 'No description provided.'}</div>
                  <div className="cell pics">
                    <div className="sheet-images-grid">
                      {viewSopModal.step.ImageUrls?.map((url, i) => (
                        <img key={i} src={url} alt="SOP Visual" className="sheet-media-img" />
                      ))}
                    </div>
                    {viewSopModal.step.VideoUrl && (
                      <video src={viewSopModal.step.VideoUrl} controls className="sheet-media-video" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mes-modal-footer">
              <button className="mes-btn-secondary" onClick={() => dispatch(setViewSopModal(null))}>Close View</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProcessDefinition;
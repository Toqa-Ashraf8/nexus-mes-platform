import React, { useState } from 'react';
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

const ProcessDefinition = () => {
  const [product, setProduct] = useState({
    sku: '',
    version: '',
    description: '',
    segments: []
  });

  const setActiveTab = (segIdx, tabName) => {
    const updatedSegments = [...product.segments];
    updatedSegments[segIdx].activeTab = tabName;
    setProduct({ ...product, segments: updatedSegments });
  }; 

  const addSegment = () => {
    const newSegment = {
      id: 'seg-' + Date.now(),
      sequenceNo: (product.segments.length + 1) * 10,
      name: '',
      equipmentClass: '',
      personnelClass: '',
      standardTimeMin: '',
      instructions: '',
      bom: [],
      parameters: [],
      activeTab: 'station'
    };
    setProduct({ ...product, segments: [...product.segments, newSegment] });
  };

  const removeSegment = (segIdx) => {
    const updatedSegments = product.segments.filter((_, idx) => idx !== segIdx);
    setProduct({ ...product, segments: updatedSegments });
  };

  const addParameter = (segIdx) => {
    const updatedSegments = [...product.segments];
    updatedSegments[segIdx].parameters.push({ name: '', target: 0, tolerance: 0, unit: '' });
    setProduct({ ...product, segments: updatedSegments });
  };

  const removeParameter = (segIdx, pIdx) => {
    const updatedSegments = [...product.segments];
    updatedSegments[segIdx].parameters.splice(pIdx, 1);
    setProduct({ ...product, segments: updatedSegments });
  };

  const removeBomItem = (segIdx, bIdx) => {
    const updatedSegments = [...product.segments];
    updatedSegments[segIdx].bom.splice(bIdx, 1);
    setProduct({ ...product, segments: updatedSegments });
  };

  const handleFetchFromSAP = () => {
    alert('Calling SAP API to fetch Material Master Data...');
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

  const handleApproveAndRelease = () => {
    alert('Approving & Releasing Route to Shop Floor Execution (MES Level 3)!');
  };

  return (
    <div className="mes-container">
      <header className="mes-navbar">
        <div className="mes-logo-zone">
          <div className="mes-badge">LEVEL 3</div>
          <div>
            <h1>Product Definition Master</h1>
            <p>ISA-95 Production Routing & Process Recipe Configuration</p>
          </div>
        </div>
        
        <div className="mes-nav-actions">
          <button className="mes-btn-outline" onClick={handleFetchFromSAP}>
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
            <span className="meta-value">{product.sku || '—'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ROUTE VERSION</span>
            <span className="meta-value-badge">v{product.version || '1.0'}</span>
          </div>
          <div className="meta-item description-item">
            <span className="meta-label">ROUTE DESCRIPTION</span>
            <input 
              type="text" 
              className="meta-desc-input"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="Enter route description..."
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
          {product.segments.length === 0 ? (
            <div className="mes-empty-state" style={{ padding: '40px', textAlign: 'center' }}>
              <FiLayers size={40} style={{ color: '#64748b', marginBottom: '12px' }} />
              <p style={{ color: '#94a3b8' }}>No process routing segments loaded yet. Fetch from SAP or click below to add a step.</p>
            </div>
          ) : (
            product.segments.map((seg, segIdx) => (
              <div key={seg.id || segIdx} className="mes-step-card">
                <div className="mes-step-header">
                  <div className="step-ident">
                    <span className="step-seq-badge">#{seg.sequenceNo || '00'}</span>
                    <input 
                      type="text" 
                      className="step-name-input-field" 
                      value={seg.name || ''}
                      onChange={(e) => {
                        const updatedSegments = [...product.segments];
                        updatedSegments[segIdx].name = e.target.value;
                        setProduct({ ...product, segments: updatedSegments });
                      }}
                      placeholder="Enter Operation Name (e.g., Robot Welding)..." 
                    />  
                  </div>
                  
                  <div className="mes-tabs-row">
                    <button 
                      className={`tab-trigger ${seg.activeTab === 'station' ? 'active' : ''}`}
                      onClick={() => setActiveTab(segIdx, 'station')}
                    >
                      <FiSettings /> Resources
                    </button>
                    <button 
                      className={`tab-trigger ${seg.activeTab === 'bom' ? 'active' : ''}`}
                      onClick={() => setActiveTab(segIdx, 'bom')}
                    >
                      <FiPackage /> BOM Allocation ({seg.bom?.length || 0})
                    </button>
                    <button 
                      className={`tab-trigger ${seg.activeTab === 'parameters' ? 'active' : ''}`}
                      onClick={() => setActiveTab(segIdx, 'parameters')}
                    >
                      <FiList /> PLC Recipes ({seg.parameters?.length || 0})
                    </button>
                  </div>

                  <button className="mes-btn-danger-icon" onClick={() => removeSegment(segIdx)}>
                    <FiTrash2 />
                  </button>
                </div>

                <div className="mes-step-body">
                  {seg.activeTab === 'station' && (
                    <div className="tab-content-grid animate-fade">
                      <div className="resource-inputs">
                        <div className="mes-form-group">
                          <label>Equipment Class / Workstation</label>
                          <select 
                            className="mes-input"
                            value={seg.equipmentClass || ''}
                            onChange={(e) => {
                              const updatedSegments = [...product.segments];
                              updatedSegments[segIdx].equipmentClass = e.target.value;
                              setProduct({ ...product, segments: updatedSegments });
                            }}
                          >
                            <option value="">Select Workstation...</option>
                            <option value="Stamping-Press-01">Stamping Press Machine 01</option>
                            <option value="Manual-Assembly-Line">Main Assembly Line Station</option>
                            <option value="Welding-Robot-Station">Automated Welding Robot</option>
                          </select>
                        </div>

                        <div className="mes-form-group">
                          <label>Personnel Class (Labor Specialty)</label>
                          <select 
                            className="mes-input"
                            value={seg.personnelClass || ''}
                            onChange={(e) => {
                              const updatedSegments = [...product.segments];
                              updatedSegments[segIdx].personnelClass = e.target.value;
                              setProduct({ ...product, segments: updatedSegments });
                            }}
                          > 
                            <option value="">Select Personnel...</option>
                            <option value="PC-STAMP-OP">Stamping Operator</option>
                            <option value="PC-ASSEMBLER">Assembly Technician</option>
                          </select>
                        </div>

                        <div className="mes-form-group">
                          <label>Standard Execution Time</label>
                          <div className="mes-input-unit-wrapper">
                            <input 
                              type="number" 
                              className="mes-input" 
                              value={seg.standardTimeMin || ''}
                              onChange={(e) => {
                                const updatedSegments = [...product.segments];
                                updatedSegments[segIdx].standardTimeMin = e.target.value;
                                setProduct({ ...product, segments: updatedSegments });
                              }}
                              placeholder="Standard time"
                            />
                            <span className="input-unit-tag">Min</span>
                          </div>
                        </div>
                      </div>

                      <div className="sop-editor-zone">
                        <label className="sop-label"><FiFileText /> Operator Digital SOP Instructions</label>
                        <textarea 
                          className="mes-textarea"
                          value={seg.instructions || ''}
                          onChange={(e) => {
                            const updatedSegments = [...product.segments];
                            updatedSegments[segIdx].instructions = e.target.value;
                            setProduct({ ...product, segments: updatedSegments });
                          }}
                          placeholder="Write dynamic step-by-step SOP instructions for the station HMI display..."
                        />
                      </div>
                    </div>
                  )}

                  {seg.activeTab === 'bom' && (
                    <div className="tab-content-clean animate-fade">
                      <div className="bom-allocation-header">
                        <select className="mes-input bom-dropdown-highlight" value="">
                          <option value="">+ Allocate SAP Material Item to this Step...</option>
                        </select>
                      </div>

                      <div className="bom-items-table-view">
                        {(!seg.bom || seg.bom.length === 0) ? (
                          <div className="mes-empty-state">
                            <FiLayers size={24} />
                            <p>No materials linked to this operation segment yet.</p>
                          </div>
                        ) : (
                          <div className="bom-table-grid">
                            <div className="bom-table-header">
                              <span>Material ID</span>
                              <span>Target Qty</span>
                              <span>Unit</span>
                              <span>Action</span>
                            </div>
                            {seg.bom.map((item, bIdx) => (
                              <div key={bIdx} className="bom-table-row">
                                <span className="bom-mat-code">{item.materialId}</span>
                                <input 
                                  type="number" 
                                  className="bom-qty-input" 
                                  value={item.quantity || 1}
                                  onChange={(e) => {
                                    const updatedSegments = [...product.segments];
                                    updatedSegments[segIdx].bom[bIdx].quantity = e.target.value;
                                    setProduct({ ...product, segments: updatedSegments });
                                  }}
                                />
                                <span className="bom-unit">{item.uom || 'pcs'}</span>
                                <button className="btn-row-delete" onClick={() => removeBomItem(segIdx, bIdx)}>
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
                        <button className="mes-btn-secondary-sm" onClick={() => addParameter(segIdx)}>
                          <FiPlus /> Add Recipe Parameter
                        </button>
                      </div>

                      <div className="recipe-parameters-list">
                        {(!seg.parameters || seg.parameters.length === 0) ? (
                          <div className="mes-empty-state">
                            <FiList size={24} />
                            <p>No PLC parameters or HMI tolerances configured for this step.</p>
                          </div>
                        ) : (
                          <div className="recipe-table">
                            <div className="recipe-th">
                              <span>PLC Tag / Variable</span>
                              <span>Target Setpoint</span>
                              <span>Tolerance (±)</span>
                              <span>UOM</span>
                              <span>Remove</span>
                            </div>
                            
                            {seg.parameters.map((param, pIdx) => (
                              <div key={pIdx} className="recipe-tr">
                                <input 
                                  type="text" 
                                  placeholder="e.g. Injection_Pressure" 
                                  className="recipe-input-txt"   
                                  value={param.name || ''}
                                  onChange={(e) => {
                                    const updatedSegments = [...product.segments];
                                    updatedSegments[segIdx].parameters[pIdx].name = e.target.value;
                                    setProduct({ ...product, segments: updatedSegments });
                                  }}
                                />
                                <input 
                                  type="number" 
                                  placeholder="0.0" 
                                  className="recipe-input-num"   
                                  value={param.target || 0}
                                  onChange={(e) => {
                                    const updatedSegments = [...product.segments];
                                    updatedSegments[segIdx].parameters[pIdx].target = e.target.value;
                                    setProduct({ ...product, segments: updatedSegments });
                                  }}
                                />
                                <input 
                                  type="number" 
                                  placeholder="0.0" 
                                  className="recipe-input-num"
                                  value={param.tolerance || 0}
                                  onChange={(e) => {
                                    const updatedSegments = [...product.segments];
                                    updatedSegments[segIdx].parameters[pIdx].tolerance = e.target.value;
                                    setProduct({ ...product, segments: updatedSegments });
                                  }}
                                />
                                <input 
                                  type="text" 
                                  placeholder="bar" 
                                  className="recipe-input-unit"
                                  value={param.unit || ''}
                                  onChange={(e) => {
                                    const updatedSegments = [...product.segments];
                                    updatedSegments[segIdx].parameters[pIdx].unit = e.target.value;
                                    setProduct({ ...product, segments: updatedSegments });
                                  }}
                                />
                                <button className="btn-row-delete" onClick={() => removeParameter(segIdx, pIdx)}>
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

          <button className="mes-btn-add-step-large" onClick={addSegment}>
            <FiPlus /> Append New Routing Operation Segment
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProcessDefinition;
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
    removeImageFromActiveStepModal, 
    saveStepModal, 
    toggleActiveStepModal, 
    updateActiveStepModalData 
} from '../../slices/processDefinitionSlice';
import { 
  FiPlus, 
  FiTrash2, 
  FiSave, 
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
  FiUpload, 
  FiCopy, 
  FiCheckCircle, 
  FiRotateCcw
} from 'react-icons/fi';
import './WorkInstructionsModal.css'
import { toast } from 'react-toastify';
import { saveImageUrl, saveVideoUrl } from '../../services/processDefinitionService';
const WorkInstructionsModal = () => {
    const {activeStepModal}=useSelector((state)=>state.processDefinition);
    const dispatch=useDispatch();
    const ImageUrl = import.meta.env.VITE_IMAGES_BASE_URL;
    const STANDARD_SYMBOLS = [
  { id: 'PPE', label: 'PPE Required',CategoryUrl:'PPE.jpg' },
  { id: 'operation', label: 'Operation Step',CategoryUrl:'hand-holding-gear.jpg' },
  { id: 'safety', label: 'Safety Alert',CategoryUrl:'mark-warning.jpg'},
  { id: 'quality', label: 'Quality Check',CategoryUrl:'thumbnail.png'},
  { id: 'tooling', label: 'Tools / Equipment' ,CategoryUrl:'wrench.jpg'},
  { id: 'verification', label: 'Material Verification',CategoryUrl:'tracking-box.jpg'},
];

const handleFileChange = async(e) => {
    const {name}=e.target;
    if (!e.target.files || e.target.files.length === 0) return; 
    const file = e.target.files[0];
    const formData=new FormData();
    const fileName=file.name;
    formData.append("file",file);
    if(name==="ImageUrl"){
     await dispatch(saveImageUrl(
        {
          data:formData ,
          Folder:"InstructionSteps"
        }))
    }
    else if(name==="VideoUrl"){
     await dispatch(saveVideoUrl(
        {
          data:formData ,
          Folder:"InstructionSteps"
        }))
    }
    dispatch(updateActiveStepModalData({[name]:fileName}));

  };
const handleSaveStepModal = () => {
    dispatch(saveStepModal());
    toast.success("Instruction Step saved!");
  };
  return (
    <div>
       <div className="mes-modal-overlay">
          <div className="mes-modal-card split-modal">
            <div className="mes-modal-header">
              <h3>Configure Instruction Step 1</h3>
              <button className="close-btn" onClick={() => dispatch(toggleActiveStepModal(null))}><FiX /></button>
            </div>
            
            <div className="mes-modal-split-body">
              <div className="modal-left-pane">
                <div className="modal-field">
                  <label>Step Sequence</label>
                  <input 
                    type="number" 
                    className="mes-input"
                    onChange={(e) => dispatch(updateActiveStepModalData({ StepSequence: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="modal-field">
                  <label>Operation Icon / Symbol</label>
                  <div className="symbols-picker-grid">
                     {STANDARD_SYMBOLS.map(sym => (
                      <div 
                        key={sym.id} 
                        className={`symbol-card ${activeStepModal.stepData.CategoryUrl === sym.CategoryUrl ? 'selected' : ''}`}
                        onClick={() => dispatch(updateActiveStepModalData({Category:sym.label, CategoryUrl: sym.CategoryUrl }))}
                      >
                        <img src={`${ImageUrl}Images/StepCategory/${sym.CategoryUrl}`} alt='' />
                        <span>{sym.label}</span>
                      </div>
                    ))} 
                  </div>
                </div>

                <div className="modal-field">
                  <label>Step Description</label>
                  <textarea 
                    className="mes-textarea" rows={2}
                    placeholder="Describe the assembly/inspection step"
                    onChange={(e) => dispatch(updateActiveStepModalData({ Description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-right-pane">
               <div className="media-section-box">
                      <div className="media-box-title"><FiImage /> Step Illustrations (Images)</div>
                      <div className="gallery-container">
                        {activeStepModal.stepData.ImageUrl ? (
                          <div className="image-preview-wrapper">
                            <img 
                              src={`${ImageUrl?.endsWith('/') ? ImageUrl : `${ImageUrl}/`}Images/InstructionSteps/${activeStepModal.stepData.ImageUrl}`} 
                              alt='Step Illustration' 
                            />
                            <button 
                              className="thumb-remove" 
                              onClick={() => dispatch(updateActiveStepModalData({ ImageUrl: '' }))}
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (  
                          <label className="thumb-add-btn">
                            <FiPlus />
                            <span>Add</span>
                            <input type="file" name='ImageUrl' accept="image/*" onChange={handleFileChange} hidden />
                          </label>
                        )} 
                      </div>
                    </div>

                <div className="media-section-box">
                  <div className="media-box-title"><FiVideo /> Step Video Guidance</div>
                  {activeStepModal.stepData.VideoUrl ? (
                    <div className="video-preview-wrapper">
                      <video src={`${ImageUrl?.endsWith('/') ? ImageUrl : `${ImageUrl}/`}Videos/InstructionSteps/${activeStepModal.stepData.VideoUrl}`} controls />
                      <button className="video-remove-btn" onClick={() => dispatch(updateActiveStepModalData({ VideoUrl: '' }))}>
                        Remove Video
                      </button>
                    </div>
                  ) : (
                    <label className="video-dropzone">
                      <FiUpload className="upload-icon" />
                      <span>Click to select video from PC</span>
                      <input type="file" name='VideoUrl' accept="video/*" onChange={handleFileChange}  hidden />
                    </label>
                   )} 
                </div>
              </div>
            </div>

            <div className="mes-modal-footer">
              <button className="mes-btn-secondary" onClick={() => dispatch(toggleActiveStepModal(null))}>Cancel</button>
              <button className="mes-btn-success" onClick={handleSaveStepModal}><FiSave /> Save Instruction</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default WorkInstructionsModal

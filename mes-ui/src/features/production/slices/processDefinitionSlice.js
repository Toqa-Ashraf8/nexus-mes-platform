import { createSlice } from "@reduxjs/toolkit";
import { fetchSapProducts, releaseProduct, saveImageUrl, saveSapProducts, saveVideoUrl } from "../services/processDefinitionService";

const initialState = {
  products: [],
  isProductsModalOpen: false,
  product: {  
    ProductMasterId:0,
    SKU: "", 
    Description: "", 
    Version: "",
    DefinitionStatus: "", 
    ProductSegments: [] 
  },
  activeStepModal: null, // { segIdx, stepIdx, stepData, isNew }
  viewSopModal: null ,    // { segName, step }
  stepInstuctionImgUrl:'',
  productsAfterSave:[]
};

const processDefinitionSlice = createSlice({
  name: 'processDefinition',
  initialState,
  reducers: {
    toggleProductsModal: (state, action) => {
      state.isProductsModalOpen = action.payload;
    },
    setProductsValues: (state, action) => {
      state.product = { ...state.product, ...action.payload };
    },
    fillFormWithSAPValues: (state, action) => {
      const selectedSapProduct = state.products[action.payload];
      if (selectedSapProduct) {
        const productData = JSON.parse(JSON.stringify(selectedSapProduct));
        
        if (productData.ProductSegments) {
          productData.ProductSegments = productData.ProductSegments.map(seg => ({
            ...seg,
            activeTab: seg.activeTab || 'station',
            EquipmentRequirements: seg.EquipmentRequirements?.length > 0 
              ? seg.EquipmentRequirements 
              : [{ EquipmentClassID: 0 ,EquipmentClassName:''}],
            PersonnelRequirements: seg.PersonnelRequirements?.length > 0 
              ? seg.PersonnelRequirements 
              : [{ PersonnelClassID:0, PersonnelClassName:''}],
            MaterialRequirements: seg.MaterialRequirements || [],
            Parameters: seg.Parameters || [],
            WorkInstructionSteps: seg.WorkInstructionSteps || []
          }));
        }
        state.product = productData;
      }
      state.isProductsModalOpen = false;
    },

    setSegmentActiveTab: (state, action) => {
      const { segIdx, tabName } = action.payload;
      if (state.product.ProductSegments[segIdx]) {
        state.product.ProductSegments[segIdx].activeTab = tabName;
      }
    },

    updateSegmentField: (state, action) => {
      const { segIdx, fieldName, value } = action.payload;
      if (state.product.ProductSegments[segIdx]) {
        state.product.ProductSegments[segIdx][fieldName] = value;
      }
    },

    addSegmentToProduct: (state) => {
      const currentSegments = state.product?.ProductSegments || [];
      const nextSeq = (currentSegments.length + 1) * 10;
      const newSegment = {
        SequenceNo: nextSeq,
        SequenceName: `Step ${nextSeq}`,
        EquipmentRequirements: [{ EquipmentClassID: 0 ,EquipmentClassName:''}],
        PersonnelRequirements: [{ PersonnelClassID: 0,PersonnelClassName:'' }],
        MaterialRequirements: [],
        Parameters: [],
        WorkInstructionSteps: [],
        activeTab: 'station'
      };
      state.product.ProductSegments.push(newSegment);
    },

    insertSegmentBetween: (state, action) => {
      const indexBefore = action.payload;
      const currentSegments = state.product?.ProductSegments || [];
      const prevSeq = currentSegments[indexBefore]?.SequenceNo || (indexBefore + 1) * 10;
      const nextSeq = currentSegments[indexBefore + 1]?.SequenceNo || (indexBefore + 2) * 10;
      const midSeq = Math.floor((prevSeq + nextSeq) / 2);

      const newSegment = {
        SequenceNo: midSeq,
        SequenceName: `New Step ${midSeq}`,
        WorkInstructionSteps: [],
        EquipmentRequirements: [{ EquipmentClassID: '',EquipmentClassName:'' }],
        PersonnelRequirements: [{ PersonnelClassID: '' ,PersonnelClassName:''}],
        MaterialRequirements: [],
        Parameters: [],
        activeTab: 'station'
      };

      state.product.ProductSegments.splice(indexBefore + 1, 0, newSegment);
    },

    removeSegmentFromProduct: (state, action) => {
      const segIdx = action.payload;
      state.product.ProductSegments.splice(segIdx, 1);
    },

    // Equipment Reducers
    addEquipmentRequirement: (state, action) => {
      const segIdx = action.payload;
      const segment = state.product.ProductSegments[segIdx];
      if (!segment.EquipmentRequirements) segment.EquipmentRequirements = [];
      segment.EquipmentRequirements.push({ EquipmentClassID: '' });
    },
    updateEquipmentRequirement: (state, action) => {
      const { segIdx, eqIdx, value } = action.payload;
      if (state.product.ProductSegments[segIdx]?.EquipmentRequirements[eqIdx]) {
        state.product.ProductSegments[segIdx].EquipmentRequirements[eqIdx].EquipmentClassID = value;
      }
    },
    removeEquipmentRequirement: (state, action) => {
      const { segIdx, eqIdx } = action.payload;
      state.product.ProductSegments[segIdx].EquipmentRequirements.splice(eqIdx, 1);
    },

    // Personnel Reducers
    addPersonnelRequirement: (state, action) => {
      const segIdx = action.payload;
      const segment = state.product.ProductSegments[segIdx];
      if (!segment.PersonnelRequirements) segment.PersonnelRequirements = [];
      segment.PersonnelRequirements.push({ PersonnelClassID: '' });
    },
    updatePersonnelRequirement: (state, action) => {
      const { segIdx, pIdx, value } = action.payload;
      if (state.product.ProductSegments[segIdx]?.PersonnelRequirements[pIdx]) {
        state.product.ProductSegments[segIdx].PersonnelRequirements[pIdx].PersonnelClassID = value;
      }
    },
    removePersonnelRequirement: (state, action) => {
      const { segIdx, pIdx } = action.payload;
      state.product.ProductSegments[segIdx].PersonnelRequirements.splice(pIdx, 1);
    },

    // Material Reducers
    addMaterialRequirement: (state, action) => {
      const segIdx = action.payload;
      const segment = state.product.ProductSegments[segIdx];
      if (!segment.MaterialRequirements) segment.MaterialRequirements = [];
      segment.MaterialRequirements.push({ MaterialDefinitionID: '', Quantity: '', UnitOfMeasure: '' });
    },
    updateMaterialRequirement: (state, action) => {
      const { segIdx, matIdx, fieldName, value } = action.payload;
      if (state.product.ProductSegments[segIdx]?.MaterialRequirements[matIdx]) {
        state.product.ProductSegments[segIdx].MaterialRequirements[matIdx][fieldName] = value;
      }
    },
    removeMaterialRequirement: (state, action) => {
      const { segIdx, matIdx } = action.payload;
      state.product.ProductSegments[segIdx].MaterialRequirements.splice(matIdx, 1);
    },

    // Parameter Reducers
    addParameter: (state, action) => {
      const segIdx = action.payload;
      const segment = state.product.ProductSegments[segIdx];
      if (!segment.Parameters) segment.Parameters = [];
      segment.Parameters.push({ Tag: '', Value: '', UnitOfMeasure: '' });
    },
    updateParameter: (state, action) => {
      const { segIdx, pIdx, fieldName, value } = action.payload;
      if (state.product.ProductSegments[segIdx]?.Parameters[pIdx]) {
        state.product.ProductSegments[segIdx].Parameters[pIdx][fieldName] = value;
      }
    },
    removeParameter: (state, action) => {
      const { segIdx, pIdx } = action.payload;
      state.product.ProductSegments[segIdx].Parameters.splice(pIdx, 1);
    },

    toggleActiveStepModal: (state, action) => {
      state.activeStepModal = action.payload;
    },
    
    updateActiveStepModalData: (state, action) => {
      if (state.activeStepModal) {
        state.activeStepModal.stepData = {
          ...state.activeStepModal.stepData,
          ...action.payload
        };
      }
    },

  /*   addImageToActiveStepModal: (state, action) => {
      if (state.activeStepModal) {
        const currentImages = state.activeStepModal.stepData.ImageUrls || [];
        state.activeStepModal.stepData.ImageUrls = [...currentImages, ...action.payload];
      }
    }, */

    removeImageFromActiveStepModal: (state, action) => {
      if (state.activeStepModal) {
        const imgIdx = action.payload;
        state.activeStepModal.stepData.ImageUrl = state.activeStepModal.stepData.ImageUrl.filter((_, i) => i !== imgIdx);
      }
    },

    saveStepModal: (state) => {
      if (!state.activeStepModal) return;
      const { segIdx, stepIdx, stepData, isNew } = state.activeStepModal;
      const segment = state.product.ProductSegments[segIdx];
      if (segment) {
        if (!segment.WorkInstructionSteps) segment.WorkInstructionSteps = [];
        if (isNew) {
          segment.WorkInstructionSteps.push(stepData);
        } else {
          segment.WorkInstructionSteps[stepIdx] = stepData;
        }
      }
      state.activeStepModal = null;
    },

    deleteInstructionStep: (state, action) => {
      const { segIdx, stepIdx } = action.payload;
      const segment = state.product.ProductSegments[segIdx];
      if (segment && segment.WorkInstructionSteps) {
        const updatedSteps = segment.WorkInstructionSteps.filter((_, idx) => idx !== stepIdx);
        segment.WorkInstructionSteps = updatedSteps.map((st, i) => ({ ...st, StepSequence: i + 1 }));
      }
    },

    setViewSopModal: (state, action) => {
      state.viewSopModal = action.payload;
    },

    resetProductForm: (state) => {
      state.product = {
        SKU: '',
        Version: '1.0',
        Description: '',
        ProductSegments: []
      };
    },

    cloneProduct: (state) => {
      state.product = {
        ...state.product,
        SKU: `${state.product?.SKU || 'SKU'}_COPY`,
        Description: `${state.product?.Description || ''} (Cloned)`
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSapProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      
      .addCase(releaseProduct.fulfilled, (state, action) => {
        state.product.DefinitionStatus = "Released";
      })
      .addCase(saveImageUrl.fulfilled, (state, action) => {
        state.activeStepModal.stepData.ImageUrl = action.payload;
      })
       .addCase(saveVideoUrl.fulfilled, (state, action) => {
        state.activeStepModal.stepData.VideoUrl = action.payload;
      })
  }
});

export const { 
  toggleProductsModal, 
  setProductsValues, 
  fillFormWithSAPValues, 
  setSegmentActiveTab, 
  updateSegmentField, 
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
  toggleActiveStepModal,
  updateActiveStepModalData,
  removeImageFromActiveStepModal,
  saveStepModal,
  deleteInstructionStep,
  setViewSopModal,
  resetProductForm,
  cloneProduct
} = processDefinitionSlice.actions;

export default processDefinitionSlice.reducer;
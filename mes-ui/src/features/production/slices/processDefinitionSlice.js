import { createSlice } from "@reduxjs/toolkit";
import { fetchSapProducts, releaseProduct } from "../services/processDefinitionService";

const initialState = {
  products: [],
  isProductsModalOpen: false,
  product: {  
    SKU: "", 
    Description: "", 
    Version: "",
    DefinitionStatus:"", 
    ProductSegments: [] 
  },
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
            EquipmentRequirements: seg.EquipmentRequirements && seg.EquipmentRequirements.length > 0 
              ? seg.EquipmentRequirements 
              : [{ EquipmentClassID: '' }],
            PersonnelRequirements: seg.PersonnelRequirements && seg.PersonnelRequirements.length > 0 
              ? seg.PersonnelRequirements 
              : [{ PersonnelClassID: '' }],
            MaterialRequirements: seg.MaterialRequirements || [],
            Parameters: seg.Parameters || []
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

    addSegmentToProduct: (state) => {
      const currentSegments = state.product?.ProductSegments || [];
      const newSegment = {
        ID: `SEG-${(currentSegments.length + 1) * 10}`,
        Description: '',
        EquipmentRequirements: [{ EquipmentClassID: '' }],
        PersonnelRequirements: [{ PersonnelClassID: '' }],
        MaterialRequirements: [],
        Parameters: [],
        standardTimeMin: '',
        instructions: '',
        activeTab: 'station'
      };
      state.product.ProductSegments = [...currentSegments, newSegment];
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

    // Material Requirements Reducers
    addMaterialRequirement: (state, action) => {
      const segIdx = action.payload;
      const segment = state.product.ProductSegments[segIdx];
      if (!segment.MaterialRequirements) segment.MaterialRequirements = [];
      segment.MaterialRequirements.push({ MaterialDefinitionID: '', Quantity: 1, UnitOfMeasure: 'pcs' });
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

    // Parameters Reducers
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

    updateSegmentField: (state, action) => {
      const { segIdx, fieldName, value } = action.payload;
      if (state.product.ProductSegments[segIdx]) {
        state.product.ProductSegments[segIdx][fieldName] = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchSapProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    })
    .addCase(releaseProduct.fulfilled, (state, action) => {
      state.products = action.payload;
    })
  }
});

export const {
  toggleProductsModal,
  setProductsValues,
  fillFormWithSAPValues,
  setSegmentActiveTab,
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
  updateSegmentField
} = processDefinitionSlice.actions;

export default processDefinitionSlice.reducer;
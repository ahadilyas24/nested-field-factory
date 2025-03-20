
import React, { createContext, useContext, useReducer, useState } from 'react';
import { FormField, FormData } from '../types/form-builder';
import { createField, createSection, validateField, evaluateCondition } from '../utils/form-utils';

type FormBuilderState = {
  fields: FormField[];
  formData: FormData;
  errors: Record<string, string | null>;
  activeFieldId: string | null;
};

type FormBuilderAction =
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'UPDATE_FIELD'; field: FormField }
  | { type: 'REMOVE_FIELD'; fieldId: string }
  | { type: 'SET_FORM_DATA'; data: FormData }
  | { type: 'UPDATE_FORM_DATA'; fieldId: string; value: any }
  | { type: 'SET_ACTIVE_FIELD'; fieldId: string | null }
  | { type: 'VALIDATE_FIELD'; fieldId: string }
  | { type: 'VALIDATE_ALL_FIELDS' }
  | { type: 'REORDER_FIELDS'; sourceIndex: number; destinationIndex: number };

const initialState: FormBuilderState = {
  fields: [],
  formData: {},
  errors: {},
  activeFieldId: null,
};

const formBuilderReducer = (state: FormBuilderState, action: FormBuilderAction): FormBuilderState => {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        fields: [...state.fields, action.field],
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map(field => 
          field.id === action.field.id ? action.field : field
        ),
      };
    case 'REMOVE_FIELD': {
      // Get all fields that need to be removed (the field and its children)
      const fieldsToRemove = new Set<string>();
      fieldsToRemove.add(action.fieldId);
      
      // Find all child fields recursively
      const findChildren = (parentId: string) => {
        state.fields.forEach(field => {
          if (field.parentId === parentId) {
            fieldsToRemove.add(field.id);
            findChildren(field.id);
          }
        });
      };
      
      findChildren(action.fieldId);
      
      // Remove the fields
      const updatedFields = state.fields.filter(field => !fieldsToRemove.has(field.id));
      
      // Remove form data for deleted fields
      const updatedFormData = { ...state.formData };
      const updatedErrors = { ...state.errors };
      
      fieldsToRemove.forEach(id => {
        delete updatedFormData[id];
        delete updatedErrors[id];
      });
      
      return {
        ...state,
        fields: updatedFields,
        formData: updatedFormData,
        errors: updatedErrors,
      };
    }
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.data,
      };
    case 'UPDATE_FORM_DATA': {
      const updatedFormData = {
        ...state.formData,
        [action.fieldId]: action.value,
      };
      
      // Find the field
      const field = state.fields.find(f => f.id === action.fieldId);
      
      // Validate the field
      const error = field ? validateField(field, action.value, updatedFormData) : null;
      
      return {
        ...state,
        formData: updatedFormData,
        errors: {
          ...state.errors,
          [action.fieldId]: error,
        },
      };
    }
    case 'SET_ACTIVE_FIELD':
      return {
        ...state,
        activeFieldId: action.fieldId,
      };
    case 'VALIDATE_FIELD': {
      const field = state.fields.find(f => f.id === action.fieldId);
      if (!field) return state;
      
      const value = state.formData[action.fieldId];
      const error = validateField(field, value, state.formData);
      
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.fieldId]: error,
        },
      };
    }
    case 'VALIDATE_ALL_FIELDS': {
      const errors: Record<string, string | null> = {};
      
      state.fields.forEach(field => {
        const value = state.formData[field.id];
        errors[field.id] = validateField(field, value, state.formData);
      });
      
      return {
        ...state,
        errors,
      };
    }
    case 'REORDER_FIELDS': {
      const { sourceIndex, destinationIndex } = action;
      const fields = [...state.fields];
      const [removed] = fields.splice(sourceIndex, 1);
      fields.splice(destinationIndex, 0, removed);
      
      // Update order values
      const updatedFields = fields.map((field, index) => ({
        ...field,
        order: index,
      }));
      
      return {
        ...state,
        fields: updatedFields,
      };
    }
    default:
      return state;
  }
};

type FormBuilderContextType = {
  state: FormBuilderState;
  addField: (type: FormField['type'], parentId?: string) => void;
  addSection: (parentId?: string) => void;
  updateField: (field: FormField) => void;
  removeField: (fieldId: string) => void;
  setFormData: (data: FormData) => void;
  updateFormData: (fieldId: string, value: any) => void;
  setActiveField: (fieldId: string | null) => void;
  validateField: (fieldId: string) => void;
  validateAllFields: () => boolean;
  isFieldVisible: (field: FormField) => boolean;
  reorderFields: (sourceIndex: number, destinationIndex: number) => void;
};

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export const FormBuilderProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  const addField = (type: FormField['type'], parentId?: string) => {
    const newField = createField(type, undefined, parentId);
    dispatch({ type: 'ADD_FIELD', field: newField });
    dispatch({ type: 'SET_ACTIVE_FIELD', fieldId: newField.id });
    return newField;
  };

  const addSection = (parentId?: string) => {
    const newSection = createSection(undefined, parentId);
    dispatch({ type: 'ADD_FIELD', field: newSection });
    dispatch({ type: 'SET_ACTIVE_FIELD', fieldId: newSection.id });
    return newSection;
  };

  const updateField = (field: FormField) => {
    dispatch({ type: 'UPDATE_FIELD', field });
  };

  const removeField = (fieldId: string) => {
    dispatch({ type: 'REMOVE_FIELD', fieldId });
    if (state.activeFieldId === fieldId) {
      dispatch({ type: 'SET_ACTIVE_FIELD', fieldId: null });
    }
  };

  const setFormData = (data: FormData) => {
    dispatch({ type: 'SET_FORM_DATA', data });
  };

  const updateFormData = (fieldId: string, value: any) => {
    dispatch({ type: 'UPDATE_FORM_DATA', fieldId, value });
  };

  const setActiveField = (fieldId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_FIELD', fieldId });
  };

  const validateField = (fieldId: string) => {
    dispatch({ type: 'VALIDATE_FIELD', fieldId });
  };

  const validateAllFields = () => {
    dispatch({ type: 'VALIDATE_ALL_FIELDS' });
    return !Object.values(state.errors).some(error => error !== null);
  };

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditional) return true;
    return evaluateCondition(field.conditional, state.formData);
  };

  const reorderFields = (sourceIndex: number, destinationIndex: number) => {
    dispatch({ type: 'REORDER_FIELDS', sourceIndex, destinationIndex });
  };

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        addField,
        addSection,
        updateField,
        removeField,
        setFormData,
        updateFormData,
        setActiveField,
        validateField,
        validateAllFields,
        isFieldVisible,
        reorderFields,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};

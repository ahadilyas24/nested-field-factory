
import { FormField, FieldType, FieldOption } from '../types/form-builder';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

export const createField = (
  type: FieldType,
  name: string = '',
  parentId?: string,
  options?: FieldOption[]
): FormField => {
  const id = generateId();
  const defaultLabel = getDefaultLabelForType(type);
  
  return {
    id,
    type,
    name: name || `field_${id}`,
    label: defaultLabel,
    placeholder: `Enter ${defaultLabel.toLowerCase()}`,
    parentId,
    options: options || getDefaultOptionsForType(type),
    required: false,
    validations: [],
    order: Date.now(),
  };
};

export const createSection = (
  name: string = '',
  parentId?: string
): FormField => {
  const id = generateId();
  
  return {
    id,
    type: 'text',
    name: name || `section_${id}`,
    label: 'New Section',
    parentId,
    isSection: true,
    required: false,
    validations: [],
    order: Date.now(),
  };
};

export const getDefaultLabelForType = (type: FieldType): string => {
  switch (type) {
    case 'text': return 'Text Field';
    case 'dropdown': return 'Dropdown';
    case 'radio': return 'Radio Options';
    case 'file': return 'File Upload';
    case 'checkbox': return 'Checkbox';
    case 'country': return 'Country Selection';
    case 'date': return 'Date';
    case 'phone': return 'Phone Number';
    default: return 'Field';
  }
};

export const getDefaultOptionsForType = (type: FieldType): FieldOption[] => {
  switch (type) {
    case 'dropdown':
    case 'radio':
      return [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ];
    case 'country':
      return [
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Canada', value: 'CA' },
        { label: 'Australia', value: 'AU' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Japan', value: 'JP' },
      ];
    default:
      return [];
  }
};

export const getFieldIcon = (type: FieldType): string => {
  switch (type) {
    case 'text': return 'type';
    case 'dropdown': return 'list';
    case 'radio': return 'circle-dot';
    case 'file': return 'upload';
    case 'checkbox': return 'check-square';
    case 'country': return 'globe';
    case 'date': return 'calendar';
    case 'phone': return 'phone';
    default: return 'square';
  }
};

export const validateField = (field: FormField, value: any, formValues: any): string | null => {
  if (!field.validations || field.validations.length === 0) {
    return null;
  }

  for (const validation of field.validations) {
    switch (validation.type) {
      case 'required':
        if (!value) {
          return validation.message || 'This field is required';
        }
        break;
      case 'minLength':
        if (typeof value === 'string' && value.length < validation.value) {
          return validation.message || `Minimum length is ${validation.value} characters`;
        }
        break;
      case 'maxLength':
        if (typeof value === 'string' && value.length > validation.value) {
          return validation.message || `Maximum length is ${validation.value} characters`;
        }
        break;
      case 'pattern':
        if (typeof value === 'string' && !new RegExp(validation.value).test(value)) {
          return validation.message || 'Invalid format';
        }
        break;
      case 'custom':
        if (validation.validator && !validation.validator(value, formValues)) {
          return validation.message || 'Invalid value';
        }
        break;
    }
  }

  return null;
};

export const evaluateCondition = (
  condition: FormField['conditional'],
  formValues: Record<string, any>
): boolean => {
  if (!condition) return true;

  const { fieldId, operator, value } = condition;
  const fieldValue = formValues[fieldId];

  if (fieldValue === undefined) return false;

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'notEquals':
      return fieldValue !== value;
    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(value);
    case 'notContains':
      return typeof fieldValue === 'string' && !fieldValue.includes(value);
    case 'greater':
      return Number(fieldValue) > Number(value);
    case 'less':
      return Number(fieldValue) < Number(value);
    default:
      return true;
  }
};

export const organizeFieldsHierarchy = (fields: FormField[]): FormField[] => {
  // Sort by order
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);
  
  // Group fields by parent ID
  const fieldsByParent: Record<string, FormField[]> = {};
  
  sortedFields.forEach(field => {
    const parentId = field.parentId || 'root';
    if (!fieldsByParent[parentId]) {
      fieldsByParent[parentId] = [];
    }
    fieldsByParent[parentId].push(field);
  });
  
  // Function to recursively build the hierarchy
  const buildHierarchy = (parentId: string = 'root'): FormField[] => {
    return (fieldsByParent[parentId] || []);
  };
  
  return buildHierarchy();
};

export const getFieldIdToLabelMap = (fields: FormField[]): Record<string, string> => {
  return fields.reduce((acc, field) => {
    acc[field.id] = field.label;
    return acc;
  }, {} as Record<string, string>);
};

export const cloneField = (field: FormField): FormField => {
  const newId = generateId();
  return {
    ...field,
    id: newId,
    name: `${field.name}_copy`,
    label: `${field.label} (Copy)`,
    order: Date.now(),
  };
};

export const getParentPath = (fieldId: string, fields: FormField[]): string[] => {
  const path: string[] = [];
  let currentField = fields.find(f => f.id === fieldId);
  
  while (currentField?.parentId) {
    const parent = fields.find(f => f.id === currentField?.parentId);
    if (parent) {
      path.unshift(parent.id);
      currentField = parent;
    } else {
      break;
    }
  }
  
  return path;
};

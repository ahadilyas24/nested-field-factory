
export type FieldType = 
  | 'text'
  | 'dropdown'
  | 'radio'
  | 'file'
  | 'checkbox'
  | 'country'
  | 'date'
  | 'phone';

export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, formValues: any) => boolean;
};

export type FieldOption = {
  label: string;
  value: string;
};

export type ConditionalRule = {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greater' | 'less';
  value: any;
};

export type FormField = {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  validations?: ValidationRule[];
  options?: FieldOption[];
  parentId?: string;
  conditional?: ConditionalRule;
  isSection?: boolean;
  order: number;
};

export type FormData = {
  [key: string]: any;
};

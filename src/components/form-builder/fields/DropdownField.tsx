
import React from 'react';
import { FormField } from '../../../types/form-builder';
import BaseField from '../BaseField';
import { useFormBuilder } from '../../../contexts/FormBuilderContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface DropdownFieldProps {
  field: FormField;
}

const DropdownField: React.FC<DropdownFieldProps> = ({ field }) => {
  const { state, updateFormData } = useFormBuilder();
  const value = state.formData[field.id] || '';
  const error = state.errors[field.id];

  const handleChange = (value: string) => {
    updateFormData(field.id, value);
  };

  return (
    <BaseField field={field}>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={field.placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent className="popover-content">
          {field.options?.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
    </BaseField>
  );
};

export default DropdownField;

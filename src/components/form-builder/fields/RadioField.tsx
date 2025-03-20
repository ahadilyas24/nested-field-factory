
import React from 'react';
import { FormField } from '../../../types/form-builder';
import BaseField from '../BaseField';
import { useFormBuilder } from '../../../contexts/FormBuilderContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioFieldProps {
  field: FormField;
}

const RadioField: React.FC<RadioFieldProps> = ({ field }) => {
  const { state, updateFormData } = useFormBuilder();
  const value = state.formData[field.id] || '';
  const error = state.errors[field.id];

  const handleChange = (value: string) => {
    updateFormData(field.id, value);
  };

  return (
    <BaseField field={field}>
      <RadioGroup 
        value={value} 
        onValueChange={handleChange}
        className="flex flex-col space-y-2"
      >
        {field.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
            <Label 
              htmlFor={`${field.id}-${option.value}`}
              className="cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
    </BaseField>
  );
};

export default RadioField;

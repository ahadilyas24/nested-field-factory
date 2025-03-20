
import React from 'react';
import { FormField } from '../../../types/form-builder';
import BaseField from '../BaseField';
import { useFormBuilder } from '../../../contexts/FormBuilderContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxFieldProps {
  field: FormField;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ field }) => {
  const { state, updateFormData } = useFormBuilder();
  const checked = !!state.formData[field.id];
  const error = state.errors[field.id];

  const handleChange = (checked: boolean) => {
    updateFormData(field.id, checked);
  };

  return (
    <BaseField field={field}>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={field.id} 
          checked={checked}
          onCheckedChange={handleChange}
        />
        <Label 
          htmlFor={field.id}
          className="cursor-pointer"
        >
          {field.label}
        </Label>
      </div>
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
    </BaseField>
  );
};

export default CheckboxField;

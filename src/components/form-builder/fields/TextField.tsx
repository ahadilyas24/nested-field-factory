
import React from 'react';
import { FormField } from '../../../types/form-builder';
import BaseField from '../BaseField';
import { useFormBuilder } from '../../../contexts/FormBuilderContext';
import { Input } from '@/components/ui/input';

interface TextFieldProps {
  field: FormField;
}

const TextField: React.FC<TextFieldProps> = ({ field }) => {
  const { state, updateFormData } = useFormBuilder();
  const value = state.formData[field.id] || '';
  const error = state.errors[field.id];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData(field.id, e.target.value);
  };

  return (
    <BaseField field={field}>
      <Input
        type="text"
        placeholder={field.placeholder || ''}
        value={value}
        onChange={handleChange}
        className={error ? 'border-destructive' : ''}
      />
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
    </BaseField>
  );
};

export default TextField;

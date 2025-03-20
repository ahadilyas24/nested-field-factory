
import React from 'react';
import { FormField } from '../../../types/form-builder';
import BaseField from '../BaseField';
import { useFormBuilder } from '../../../contexts/FormBuilderContext';
import { Input } from '@/components/ui/input';

interface TextFieldProps {
  field: FormField;
}

const TextField: React.FC<TextFieldProps> = ({ field }) => {
  const { state, updateFormData, setActiveField } = useFormBuilder();
  const value = state.formData[field.id] || '';
  const error = state.errors[field.id];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData(field.id, e.target.value);
  };

  const handleFieldClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveField(field.id);
  };

  return (
    <BaseField field={field} onClick={handleFieldClick}>
      <Input
        type="text"
        placeholder={field.placeholder || ''}
        value={value}
        onChange={handleChange}
        className={error ? 'border-destructive' : ''}
        onClick={(e) => e.stopPropagation()} // Don't propagate clicks on input itself
      />
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
    </BaseField>
  );
};

export default TextField;

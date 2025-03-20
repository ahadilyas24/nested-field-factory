
import React from 'react';
import { FormField } from '../../types/form-builder';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import TextField from './fields/TextField';
import DropdownField from './fields/DropdownField';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import FileField from './fields/FileField';
import DateField from './fields/DateField';
import CountryField from './fields/CountryField';
import PhoneField from './fields/PhoneField';
import Section from './Section';

interface FieldRendererProps {
  field: FormField;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  const { isFieldVisible } = useFormBuilder();
  
  if (!isFieldVisible(field)) {
    return null;
  }

  if (field.isSection) {
    return <Section field={field} />;
  }

  switch (field.type) {
    case 'text':
      return <TextField field={field} />;
    case 'dropdown':
      return <DropdownField field={field} />;
    case 'radio':
      return <RadioField field={field} />;
    case 'checkbox':
      return <CheckboxField field={field} />;
    case 'file':
      return <FileField field={field} />;
    case 'date':
      return <DateField field={field} />;
    case 'country':
      return <CountryField field={field} />;
    case 'phone':
      return <PhoneField field={field} />;
    default:
      return <div>Unknown field type: {field.type}</div>;
  }
};

export default FieldRenderer;

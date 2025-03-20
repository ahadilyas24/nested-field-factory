
import React, { useState } from 'react';
import { FormField } from '../../../types/form-builder';
import BaseField from '../BaseField';
import { useFormBuilder } from '../../../contexts/FormBuilderContext';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PhoneFieldProps {
  field: FormField;
}

// Common country codes with formats
const countryCodes = [
  { code: '+1', country: 'US', format: '(XXX) XXX-XXXX' },
  { code: '+44', country: 'UK', format: 'XXXX XXX XXX' },
  { code: '+61', country: 'AU', format: 'XXXX XXX XXX' },
  { code: '+33', country: 'FR', format: 'X XX XX XX XX' },
  { code: '+49', country: 'DE', format: 'XXXX XXXXXXX' },
  { code: '+81', country: 'JP', format: 'XX XXXX XXXX' },
  { code: '+86', country: 'CN', format: 'XXX XXXX XXXX' },
];

const PhoneField: React.FC<PhoneFieldProps> = ({ field }) => {
  const { state, updateFormData } = useFormBuilder();
  const [countryCode, setCountryCode] = useState('+1');
  const phoneValue = state.formData[field.id]?.number || '';
  const error = state.errors[field.id];

  const handleCountryChange = (value: string) => {
    setCountryCode(value);
    updateFormData(field.id, { code: value, number: phoneValue });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    // Only allow digits
    if (/^[0-9\s\(\)\-]*$/.test(number)) {
      updateFormData(field.id, { code: countryCode, number });
    }
  };

  // Get format hint for selected country
  const selectedCountry = countryCodes.find(c => c.code === countryCode);
  const formatHint = selectedCountry?.format || 'XXX XXX XXXX';

  return (
    <BaseField field={field}>
      <div className="flex">
        <Select value={countryCode} onValueChange={handleCountryChange}>
          <SelectTrigger className={cn(
            "flex-shrink-0 w-24 mr-2 rounded-r-none border-r-0",
            error && "border-destructive"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="popover-content">
            {countryCodes.map((country) => (
              <SelectItem 
                key={country.code} 
                value={country.code}
                className="cursor-pointer"
              >
                {country.code} ({country.country})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          placeholder={formatHint}
          value={phoneValue}
          onChange={handleNumberChange}
          className={cn(
            "flex-grow rounded-l-none",
            error && "border-destructive"
          )}
        />
      </div>
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
      <div className="text-xs text-muted-foreground mt-1">Format: {formatHint}</div>
    </BaseField>
  );
};

export default PhoneField;

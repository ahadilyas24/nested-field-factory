
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
import { Globe, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CountryFieldProps {
  field: FormField;
}

const CountryField: React.FC<CountryFieldProps> = ({ field }) => {
  const { state, updateFormData } = useFormBuilder();
  const value = state.formData[field.id] || '';
  const error = state.errors[field.id];
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (value: string) => {
    updateFormData(field.id, value);
  };

  const filteredOptions = field.options?.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BaseField field={field}>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={cn(
          "flex items-center",
          error && "border-destructive"
        )}>
          <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder={field.placeholder || 'Select a country'} />
        </SelectTrigger>
        <SelectContent className="popover-content">
          <div className="p-2 sticky top-0 bg-background border-b">
            <div className="flex items-center px-3 py-1 rounded-md border">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                className="border-0 p-0 shadow-none focus-visible:ring-0"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions?.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
            {filteredOptions?.length === 0 && (
              <div className="p-2 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
    </BaseField>
  );
};

export default CountryField;

// Add the missing cn import
import { cn } from '@/lib/utils';

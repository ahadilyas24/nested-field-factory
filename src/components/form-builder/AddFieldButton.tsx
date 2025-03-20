
import React, { useState } from 'react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { FieldType } from '../../types/form-builder';
import { 
  PlusCircle, 
  Type, 
  List, 
  CheckSquare, 
  CircleDot, 
  Upload, 
  Calendar, 
  Globe, 
  Phone, 
  FolderPlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AddFieldButtonProps {
  parentId?: string;
  variant?: 'main' | 'section';
}

const fieldTypeIcons = {
  text: <Type className="h-4 w-4 mr-2" />,
  dropdown: <List className="h-4 w-4 mr-2" />,
  checkbox: <CheckSquare className="h-4 w-4 mr-2" />,
  radio: <CircleDot className="h-4 w-4 mr-2" />,
  file: <Upload className="h-4 w-4 mr-2" />,
  date: <Calendar className="h-4 w-4 mr-2" />,
  country: <Globe className="h-4 w-4 mr-2" />,
  phone: <Phone className="h-4 w-4 mr-2" />,
};

const AddFieldButton: React.FC<AddFieldButtonProps> = ({ parentId, variant = 'main' }) => {
  const { addField, addSection } = useFormBuilder();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddField = (type: FieldType) => {
    addField(type, parentId);
    setIsOpen(false);
  };

  const handleAddSection = () => {
    addSection(parentId);
    setIsOpen(false);
  };

  return (
    <div className={cn(
      "my-4",
      variant === 'section' && "pl-1"
    )}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "add-field-button group",
              variant === 'section' && "border-primary/25 bg-primary/5"
            )}
          >
            <PlusCircle className="h-5 w-5 mr-2 text-primary group-hover:scale-110 transition-transform duration-200" />
            Add {variant === 'section' ? 'to Section' : 'Field'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="popover-content w-56">
          <DropdownMenuItem onClick={() => handleAddSection()}>
            <FolderPlus className="h-4 w-4 mr-2" />
            <span>Add Section</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleAddField('text')}>
            {fieldTypeIcons.text}
            <span>Text Field</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAddField('dropdown')}>
            {fieldTypeIcons.dropdown}
            <span>Dropdown</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAddField('radio')}>
            {fieldTypeIcons.radio}
            <span>Radio Group</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAddField('checkbox')}>
            {fieldTypeIcons.checkbox}
            <span>Checkbox</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAddField('file')}>
            {fieldTypeIcons.file}
            <span>File Upload</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAddField('date')}>
            {fieldTypeIcons.date}
            <span>Date Picker</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAddField('country')}>
            {fieldTypeIcons.country}
            <span>Country Selection</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAddField('phone')}>
            {fieldTypeIcons.phone}
            <span>Phone Number</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AddFieldButton;


import React from 'react';
import { FormBuilderProvider } from '../../contexts/FormBuilderContext';
import FormCanvas from './FormCanvas';
import FieldPropertiesPanel from './FieldPropertiesPanel';
import FormDataDisplay from './FormDataDisplay';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormBuilderProps {
  className?: string;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  return (
    <FormBuilderProvider>
      <div className={cn("form-container", className)}>
        {isMobile ? (
          <MobileLayout />
        ) : (
          <DesktopLayout />
        )}
      </div>
    </FormBuilderProvider>
  );
};

const DesktopLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-7">
        <FormCanvas />
      </div>
      <div className="col-span-5 space-y-8">
        <FieldPropertiesPanel />
        <FormDataDisplay />
      </div>
    </div>
  );
};

const MobileLayout: React.FC = () => {
  return (
    <Tabs defaultValue="canvas" className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="canvas" className="flex-1">Form Builder</TabsTrigger>
        <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
        <TabsTrigger value="data" className="flex-1">Form Data</TabsTrigger>
      </TabsList>
      
      <TabsContent value="canvas">
        <FormCanvas />
      </TabsContent>
      
      <TabsContent value="properties">
        <FieldPropertiesPanel />
      </TabsContent>
      
      <TabsContent value="data">
        <FormDataDisplay />
      </TabsContent>
    </Tabs>
  );
};

export default FormBuilder;

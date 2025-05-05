import { Cpu, Users, Globe, Gift, Clock } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

type SidebarProps = {
  steps: Array<{ label: string }>;
  currentStep: number;
  onStepClick: (index: number) => void;
};

const getCategoryIcon = (label: string) => {
  switch (label) {
    case 'Technology':
      return <Cpu className="w-5 h-5 mr-2" />;
    case 'Customer':
      return <Users className="w-5 h-5 mr-2" />;
    case 'Geography':
      return <Globe className="w-5 h-5 mr-2" />;
    case 'Bonus':
      return <Gift className="w-5 h-5 mr-2" />;
    case 'Time':
      return <Clock className="w-5 h-5 mr-2" />;
    default:
      return null;
  }
};

export function AppSidebar({ steps, currentStep, onStepClick }: SidebarProps) {
  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-semibold mb-4 px-2">Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {steps.map((step, index) => (
                <SidebarMenuItem key={step.label}>
                  <SidebarMenuButton
                    onClick={() => onStepClick(index)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors
                      ${currentStep === index ? 'bg-gray-200 text-black' : 'hover:bg-gray-100'}`}
                  >
                    {getCategoryIcon(step.label)}
                    <span>{step.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

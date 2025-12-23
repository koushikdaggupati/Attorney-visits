import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, label: 'Attorney Info' },
    { id: 2, label: 'PIC Identification' },
    { id: 3, label: 'Scheduling' },
    { id: 4, label: 'Review' },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
        <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-nyc-blue -z-10 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
                <div key={step.id} className="flex flex-col items-center group">
                    <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 font-bold text-sm
                        ${isCompleted ? 'bg-nyc-blue border-nyc-blue text-white' : 
                          isCurrent ? 'bg-white border-nyc-blue text-nyc-blue shadow-lg scale-110' : 
                          'bg-white border-slate-300 text-slate-400'}`}
                    >
                        {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
                    </div>
                    <span className={`mt-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${isCurrent ? 'text-nyc-blue' : 'text-slate-400'}`}>
                        {step.label}
                    </span>
                </div>
            );
        })}
      </div>
    </div>
  );
};
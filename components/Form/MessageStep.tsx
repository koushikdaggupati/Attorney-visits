import React from 'react';
import { FormData, TIME_SLOTS } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MessageStep: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
            <Calendar className="text-nyc-gold" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Visit Scheduling</h2>
        </div>
        <p className="text-slate-500">Please propose your preferred dates and times for the legal visit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preference 1 */}
        <div className="space-y-4">
            <h3 className="font-semibold text-nyc-blue flex items-center gap-2">
                <Clock size={16} /> Preferred Slot
            </h3>
            <Input
                label="Date"
                type="date"
                min={today}
                value={data.preferredDate}
                onChange={(e) => updateData({ preferredDate: e.target.value })}
                required
            />
            <Select
                label="Time Window"
                value={data.preferredTime}
                onChange={(e) => updateData({ preferredTime: e.target.value })}
                required
                options={[
                    { value: "", label: "Select a time..." },
                    ...TIME_SLOTS.map(t => ({ value: t, label: t }))
                ]}
            />
        </div>

        {/* Preference 2 */}
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-500 flex items-center gap-2">
                <Clock size={16} /> Alternative Slot
            </h3>
            <Input
                label="Date"
                type="date"
                min={today}
                value={data.alternativeDate}
                onChange={(e) => updateData({ alternativeDate: e.target.value })}
                required
            />
            <Select
                label="Time Window"
                value={data.alternativeTime}
                onChange={(e) => updateData({ alternativeTime: e.target.value })}
                required
                options={[
                    { value: "", label: "Select a time..." },
                    ...TIME_SLOTS.map(t => ({ value: t, label: t }))
                ]}
            />
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft size={18} />}>
          Back
        </Button>
        <Button type="submit" rightIcon={<ArrowRight size={18} />}>
          Review Request
        </Button>
      </div>
    </form>
  );
};
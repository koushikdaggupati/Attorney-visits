import React from 'react';
import { FormData, TIME_SLOTS, VISIT_DURATIONS } from '../../types';
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

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const today = new Date();
  const minDate = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const maxDate = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
            <Calendar className="text-nyc-gold" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Visit Scheduling</h2>
        </div>
        <p className="text-slate-500">
          Please select a preferred date and time. Visits must be scheduled at least 24 hours in advance and no more than 7 days out.
        </p>
      </div>

      <div className="space-y-4">
          <h3 className="font-semibold text-nyc-blue flex items-center gap-2">
              <Clock size={16} /> Preferred Slot
          </h3>
          <Input
              label="Date"
              type="date"
              min={minDate}
              max={maxDate}
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
          <Select
              label="Visit Duration"
              value={data.visitDuration}
              onChange={(e) => updateData({ visitDuration: e.target.value })}
              required
              options={[
                  { value: "", label: "Select a duration..." },
                  ...VISIT_DURATIONS.map(duration => ({ value: duration, label: duration }))
              ]}
          />
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

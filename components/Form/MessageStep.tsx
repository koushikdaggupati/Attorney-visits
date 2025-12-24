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

  const parseTimeToMinutes = (time: string) => {
    const [clock, meridiem] = time.split(' ');
    const [rawHours, rawMinutes] = clock.split(':').map(Number);
    const normalizedHours = rawHours % 12;
    const hours = meridiem === 'PM' ? normalizedHours + 12 : normalizedHours;
    return hours * 60 + rawMinutes;
  };

  const durationToMinutes = (duration: string) => {
    switch (duration) {
      case '1 hour':
        return 60;
      case '1 hour 30 minutes':
        return 90;
      case '3 hours':
        return 180;
      default:
        return 0;
    }
  };

  const endOfDayMinutes = 18 * 60;
  const durationMinutes = durationToMinutes(data.visitDuration);
  const availableTimeSlots = TIME_SLOTS.filter((slot) => {
    if (durationMinutes < 90) {
      return true;
    }
    return parseTimeToMinutes(slot) + durationMinutes <= endOfDayMinutes;
  });

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
          <Select
              label="Visit Duration"
              value={data.visitDuration}
              onChange={(e) => updateData({ visitDuration: e.target.value, preferredTime: '' })}
              required
              options={[
                  { value: "", label: "Select a duration..." },
                  ...VISIT_DURATIONS.map(duration => ({ value: duration, label: duration }))
              ]}
          />
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
              label="Start Time"
              value={data.preferredTime}
              onChange={(e) => updateData({ preferredTime: e.target.value })}
              required
              options={[
                  { value: "", label: "Select a time..." },
                  ...availableTimeSlots.map(time => ({ value: time, label: time }))
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

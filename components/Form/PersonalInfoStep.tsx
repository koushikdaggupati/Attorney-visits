import React from 'react';
import { FormData } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AddressAutocomplete } from '../ui/AddressAutocomplete';
import { ArrowRight, Briefcase } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export const PersonalInfoStep: React.FC<Props> = ({ data, updateData, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
            <Briefcase className="text-nyc-gold" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Attorney Information</h2>
        </div>
        <p className="text-slate-500">Please provide your legal credentials and contact information.</p>
      </div>

      {/* Security Honeypot: Invisible to humans, tempting for bots */}
      <div className="opacity-0 absolute top-0 left-0 h-0 w-0 overflow-hidden -z-10 pointer-events-none">
        <label htmlFor="fax_number_secure">Fax Number</label>
        <input
            id="fax_number_secure"
            name="fax"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={data.fax}
            onChange={(e) => updateData({ fax: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={data.firstName}
          onChange={(e) => updateData({ firstName: e.target.value })}
          required
          placeholder="e.g. John"
          pattern="[A-Za-z \-\.]+"
          title="Names should only contain letters, spaces, hyphens, or periods."
        />
        <Input
          label="Last Name"
          value={data.lastName}
          onChange={(e) => updateData({ lastName: e.target.value })}
          required
          placeholder="e.g. Smith"
          pattern="[A-Za-z \-\.]+"
        />
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
        <Input
            label="Law Firm / Organization"
            value={data.firmName}
            onChange={(e) => updateData({ firmName: e.target.value })}
            required
            placeholder="e.g. Smith & Associates"
        />
        <AddressAutocomplete 
            label="Address"
            value={data.firmAddress}
            onChange={(value) => updateData({ firmAddress: value })}
            required
            placeholder="Start typing to search address..."
            helperText="Select from dropdown or type manually."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Work Email"
          type="email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          required
          placeholder="attorney@firm.com"
        />
        <Input
          label="Phone Number"
          type="tel"
          value={data.phone}
          onChange={(e) => updateData({ phone: e.target.value })}
          required
          placeholder="(212) 555-0123"
          pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
          title="Please enter a valid phone number (e.g., 212-555-0123)"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" rightIcon={<ArrowRight size={18} />}>
          Next: PIC Identification
        </Button>
      </div>
    </form>
  );
};
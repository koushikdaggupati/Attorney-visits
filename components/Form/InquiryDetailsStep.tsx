import React, { useEffect, useState } from 'react';
import { FACILITIES, FormData } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ArrowLeft, ArrowRight, User, Fingerprint, FileText } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const InquiryDetailsStep: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  // Initialize state based on which field already has data, defaulting to Book & Case
  const [idType, setIdType] = useState<'nysid' | 'bookCase'>(
    data.nysid && !data.bookAndCase ? 'nysid' : 'bookCase'
  );
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lastLookupValue, setLastLookupValue] = useState('');
  const trimmedBookCase = data.bookAndCase.trim();
  const hasBookCaseValue = trimmedBookCase.length > 0;
  const isBookCaseLengthValid = !hasBookCaseValue || trimmedBookCase.length === 10;
  const bookCaseValidationError = hasBookCaseValue && !isBookCaseLengthValid
    ? 'Book & Case number must be exactly 10 digits.'
    : null;

  const sanitizeName = (value: string) =>
    value.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '');

  useEffect(() => {
    const value = idType === 'nysid' ? data.nysid : data.bookAndCase;
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setLookupError(null);
      setIsLookingUp(false);
      setLastLookupValue('');
      return;
    }

    if (idType === 'bookCase' && trimmedValue.length !== 10) {
      setLookupError(null);
      setIsLookingUp(false);
      setLastLookupValue('');
      return;
    }

    if (trimmedValue === lastLookupValue) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLookingUp(true);
      setLookupError(null);
      try {
        const params = new URLSearchParams(
          idType === 'nysid' ? { nysid: trimmedValue } : { bookAndCase: trimmedValue }
        );
        const response = await fetch(`/api/pic-lookup?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No matching PIC found.');
          }
          throw new Error('Unable to retrieve PIC details.');
        }

        const payload = await response.json();
        const resolvedFacility = payload.facility
          ? FACILITIES.find(
            (facility) => facility.toLowerCase() === String(payload.facility).toLowerCase()
          )
          : undefined;
        updateData({
          picFirstName: sanitizeName(payload.picFirstName ?? ''),
          picLastName: sanitizeName(payload.picLastName ?? ''),
          ...(resolvedFacility ? { facility: resolvedFacility } : {})
        });
        setLastLookupValue(trimmedValue);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setLookupError(error instanceof Error ? error.message : 'Unable to retrieve PIC details.');
      } finally {
        setIsLookingUp(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [data.bookAndCase, data.nysid, idType, lastLookupValue, updateData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleTypeChange = (type: 'nysid' | 'bookCase') => {
    setIdType(type);
    setLookupError(null);
    setIsLookingUp(false);
    setLastLookupValue('');
    // Clear the other field to ensure mutual exclusivity in the data
    if (type === 'nysid') {
      updateData({ bookAndCase: '' });
    } else {
      updateData({ nysid: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
            <User className="text-nyc-gold" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">PIC Information</h2>
        </div>
        <p className="text-slate-500">Identify the Person in Custody (PIC) you wish to visit.</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-nyc-blue p-4 text-sm text-slate-700">
        <p>You must provide either the Book & Case Number or the NYSID to identify the individual.</p>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
            Identification Method <span className="text-red-500">*</span>
        </label>
        
        <div className="flex gap-4 mb-6">
            <button
                type="button"
                onClick={() => handleTypeChange('bookCase')}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200
                ${idType === 'bookCase' 
                    ? 'border-nyc-blue bg-blue-50 text-nyc-blue font-bold shadow-md transform scale-[1.02]' 
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
            >
                <FileText size={20} />
                <span>Book & Case No.</span>
            </button>
            <button
                type="button"
                onClick={() => handleTypeChange('nysid')}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200
                ${idType === 'nysid' 
                    ? 'border-nyc-blue bg-blue-50 text-nyc-blue font-bold shadow-md transform scale-[1.02]' 
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
            >
                <Fingerprint size={20} />
                <span>NYSID Number</span>
            </button>
        </div>

        <div className="animate-fadeIn min-h-[90px]">
            {idType === 'nysid' ? (
                <Input
                    key="nysid-input"
                    label="NYSID Number"
                    value={data.nysid}
                    onChange={(e) => updateData({ nysid: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g. 12345678Q"
                    helperText={isLookingUp ? 'Looking up PIC details...' : 'New York State Identification Number'}
                    pattern="^[0-9A-Z]+$"
                    title="NYSID must be alphanumeric."
                    maxLength={10}
                    error={lookupError ?? undefined}
                />
            ) : (
                <Input
                    key="bc-input"
                    label="Book & Case Number"
                    value={data.bookAndCase}
                    onChange={(e) => updateData({ bookAndCase: e.target.value })}
                    required
                    placeholder="e.g. 87654321"
                    helperText={isLookingUp ? 'Looking up PIC details...' : 'Enter the 10-digit booking number to auto-fill PIC details.'}
                    pattern="^[0-9]+$"
                    title="Book & Case number must be numeric only."
                    maxLength={10}
                    error={bookCaseValidationError ?? lookupError ?? undefined}
                />
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="PIC First Name"
          value={data.picFirstName}
          onChange={(e) => updateData({ picFirstName: sanitizeName(e.target.value) })}
          required
          placeholder="PIC's First Name"
          pattern="[A-Za-z \-\.]+"
        />
        <Input
          label="PIC Last Name"
          value={data.picLastName}
          onChange={(e) => updateData({ picLastName: sanitizeName(e.target.value) })}
          required
          placeholder="PIC's Last Name"
          pattern="[A-Za-z \-\.]+"
        />
        <div className="md:col-span-2">
          <Select
            label="Facility"
            value={data.facility}
            onChange={(e) => updateData({ facility: e.target.value })}
            required
            options={[
              { value: "", label: "Select a facility..." },
              ...FACILITIES.map((facility) => ({ value: facility, label: facility }))
            ]}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft size={18} />}>
          Back
        </Button>
        <Button type="submit" rightIcon={<ArrowRight size={18} />}>
          Next: Scheduling
        </Button>
      </div>
    </form>
  );
};

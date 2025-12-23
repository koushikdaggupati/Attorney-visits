import React, { useState } from 'react';
import { FormData } from '../../types';
import { Button } from '../ui/Button';
import { ArrowLeft, Send, AlertCircle, Shield } from 'lucide-react';

interface Props {
  data: FormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

export const ReviewStep: React.FC<Props> = ({ data, onBack, onSubmit, isSubmitting, error }) => {
  const [isVerified, setIsVerified] = useState(false);
  
  const ReviewItem = ({ label, value, fullWidth = false }: { label: string, value?: string, fullWidth?: boolean }) => (
    <div className={`py-3 border-b border-slate-100 last:border-0 ${fullWidth ? 'col-span-2' : ''}`}>
        <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</dt>
        <dd className="mt-1 text-slate-800 font-medium text-lg break-words">{value || <span className="text-slate-400 italic">Not provided</span>}</dd>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Review Request</h2>
        <p className="text-slate-500">Verify all information before submitting your legal visit request.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Section 1: Attorney */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Attorney</h3>
        </div>
        <div className="px-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ReviewItem label="Name" value={`${data.firstName} ${data.lastName}`} />
                <ReviewItem label="Firm" value={data.firmName} />
                <ReviewItem label="Email" value={data.email} />
                <ReviewItem label="Phone" value={data.phone} />
                <ReviewItem label="Address" value={data.firmAddress} fullWidth />
            </div>
        </div>

        {/* Section 2: Client */}
        <div className="bg-slate-50 px-6 py-3 border-y border-slate-200">
            <h3 className="font-bold text-slate-700">Person In Custody (PIC)</h3>
        </div>
        <div className="px-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ReviewItem label="PIC Name" value={`${data.picFirstName} ${data.picLastName}`} />
                {/* Dynamically show either NYSID or Book & Case */}
                {data.nysid && <ReviewItem label="NYSID" value={data.nysid} />}
                {data.bookAndCase && <ReviewItem label="Book & Case" value={data.bookAndCase} />}
            </div>
        </div>

        {/* Section 3: Scheduling */}
        <div className="bg-slate-50 px-6 py-3 border-y border-slate-200">
            <h3 className="font-bold text-slate-700">Requested Schedule</h3>
        </div>
        <div className="px-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ReviewItem label="Preferred Slot" value={`${data.preferredDate} @ ${data.preferredTime}`} />
                <ReviewItem label="Alternative Slot" value={`${data.alternativeDate} @ ${data.alternativeTime}`} />
            </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Security Checkbox */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
            <div className="bg-white p-1 rounded border border-blue-100 mt-0.5">
                <input 
                    type="checkbox" 
                    id="human-verify"
                    className="w-5 h-5 rounded border-gray-300 text-nyc-blue focus:ring-nyc-blue cursor-pointer"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                />
            </div>
            <label htmlFor="human-verify" className="text-sm text-slate-700 cursor-pointer select-none">
                <span className="font-bold text-nyc-blue block mb-1 flex items-center gap-1">
                    <Shield size={14} /> Security Verification
                </span>
                I confirm that I am a human user and that this inquiry is legitimate. I understand that automated submissions are prohibited.
            </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-fadeIn">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-semibold">Submission Failed</p>
                <p>{error}</p>
            </div>
        </div>
      )}

      <div className="pt-4 flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isSubmitting} leftIcon={<ArrowLeft size={18} />}>
          Edit Request
        </Button>
        <Button 
            type="button" 
            variant="primary" 
            onClick={onSubmit} 
            isLoading={isSubmitting} 
            disabled={!isVerified || isSubmitting}
            rightIcon={!isSubmitting && <Send size={18} />}
        >
          Submit Request
        </Button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { StepIndicator } from './components/Form/StepIndicator';
import { PersonalInfoStep } from './components/Form/PersonalInfoStep';
import { InquiryDetailsStep } from './components/Form/InquiryDetailsStep';
import { MessageStep } from './components/Form/MessageStep';
import { ReviewStep } from './components/Form/ReviewStep';
import { FormData, INITIAL_DATA } from './types';
import { CheckCircle, Lock } from 'lucide-react';

// When deployed, replace this empty string with your actual Cloud Run URL
// e.g., "https://nyc-doc-backend-xyz.a.run.app"
// If running locally, leave it empty to use relative paths if using a proxy, or "http://localhost:3000"
const API_BASE_URL = ''; 

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.min(prev + 1, 4));
  };
  
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setStep(1);
    setIsSuccess(false);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // --------------------------------------------------------------------------------
    // BOT PROTECTION & RATE LIMITING
    // --------------------------------------------------------------------------------
    
    // 1. Honeypot Check: If the hidden 'fax' field has a value, it's a bot.
    if (formData.fax !== '') {
        console.warn("Bot detected: Honeypot field filled.");
        // Fake success to slow down the bot loop without giving feedback
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true); 
        }, 1000);
        return;
    }

    // 2. Rate Limiting: Prevent rapid spam by checking last submission time.
    const lastSubmitTime = localStorage.getItem('nyc_doc_last_submit');
    const COOLDOWN_MS = 1 * 60 * 1000; // 1 minute

    if (lastSubmitTime) {
        const timeDiff = Date.now() - parseInt(lastSubmitTime, 10);
        if (timeDiff < COOLDOWN_MS) {
            const secondsLeft = Math.ceil((COOLDOWN_MS - timeDiff) / 1000);
            setSubmitError(`To prevent system spam, please wait ${secondsLeft} seconds before submitting another request.`);
            setIsSubmitting(false);
            return;
        }
    }
    
    // --------------------------------------------------------------------------------
    // SECURE SUBMISSION LOGIC (VIA BACKEND)
    // --------------------------------------------------------------------------------
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      // Exclude the honeypot field from the actual payload
      const { fax, ...payload } = formData;

      // Call our own backend endpoint
      const response = await fetch(`${API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Set cooldown timestamp on success
      localStorage.setItem('nyc_doc_last_submit', Date.now().toString());
      
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Transmission failed.");
      setSubmitError("Could not establish a connection to the submission server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 selection:bg-nyc-gold selection:text-nyc-blue">
      <Header />
      
      <main className="flex-grow flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-3xl">
          
          {!isSuccess ? (
            <>
                <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <StepIndicator currentStep={step} totalSteps={4} />
                </div>

                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200 ring-1 ring-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nyc-blue via-nyc-gold to-nyc-blue"></div>
                    
                    {step === 1 && (
                        <PersonalInfoStep 
                            data={formData} 
                            updateData={updateData} 
                            onNext={nextStep} 
                        />
                    )}
                    
                    {step === 2 && (
                        <InquiryDetailsStep 
                            data={formData} 
                            updateData={updateData} 
                            onNext={nextStep} 
                            onBack={prevStep} 
                        />
                    )}
                    
                    {step === 3 && (
                        <MessageStep 
                            data={formData} 
                            updateData={updateData} 
                            onNext={nextStep} 
                            onBack={prevStep} 
                        />
                    )}
                    
                    {step === 4 && (
                        <ReviewStep 
                            data={formData} 
                            onBack={prevStep} 
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            error={submitError}
                        />
                    )}
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Lock size={12} />
                    <span>256-bit SSL Encrypted Connection</span>
                  </p>
                </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-200 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Submitted</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Thanks for submitting your request. You will receive an email once your slot is confirmed to <strong>{formData.email}</strong>.
                </p>

                <button 
                    onClick={handleReset}
                    className="text-nyc-blue font-semibold hover:text-blue-800 hover:underline mt-4"
                >
                    Submit New Request
                </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
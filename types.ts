export interface FormData {
  // Step 1: Attorney Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  firmName: string;
  firmAddress: string;
  
  // Step 2: Client (PIC) Details
  picFirstName: string;
  picLastName: string;
  nysid: string;
  bookAndCase: string;
  
  // Step 3: Scheduling
  preferredDate: string;
  preferredTime: string;
  alternativeDate: string;
  alternativeTime: string;

  // Security (Honeypot)
  fax: string;
}

export const INITIAL_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  firmName: '',
  firmAddress: '',
  
  picFirstName: '',
  picLastName: '',
  nysid: '',
  bookAndCase: '',
  
  preferredDate: '',
  preferredTime: '',
  alternativeDate: '',
  alternativeTime: '',

  fax: '' // Should remain empty
};

export const TIME_SLOTS = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM"
];
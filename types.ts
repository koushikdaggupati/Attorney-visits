export interface FormData {
  // Step 1: Attorney Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  firmName: string;
  firmAddress: string;
  hasAdditionalVisitor: string;
  additionalVisitorName: string;
  additionalVisitorEmail: string;
  additionalVisitorPhone: string;
  
  // Step 2: Client (PIC) Details
  picFirstName: string;
  picLastName: string;
  facility: string;
  nysid: string;
  bookAndCase: string;
  
  // Step 3: Scheduling
  preferredDate: string;
  preferredTime: string;
  visitDuration: string;

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
  hasAdditionalVisitor: 'no',
  additionalVisitorName: '',
  additionalVisitorEmail: '',
  additionalVisitorPhone: '',
  
  picFirstName: '',
  picLastName: '',
  facility: '',
  nysid: '',
  bookAndCase: '',
  
  preferredDate: '',
  preferredTime: '',
  visitDuration: '',

  fax: '' // Should remain empty
};

export const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM"
];

export const VISIT_DURATIONS = [
  "1 hour",
  "1 hour 30 minutes",
  "2 hours"
];

export const FACILITIES = [
  "Anna M. Kross Center (AMKC)",
  "George R. Vierno Center (GRVC)",
  "Robert N. Davoren Center (RNDC)",
  "Otis Bantum Correctional Center (OBCC)",
  "George Motchan Detention Center (GMDC)"
];

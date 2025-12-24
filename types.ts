export interface FormData {
  // Step 1: Attorney Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  firmName: string;
  firmAddress: string;
  additionalVisitorCount: string;
  additionalVisitorOneName: string;
  additionalVisitorOneEmail: string;
  additionalVisitorOnePhone: string;
  additionalVisitorTwoName: string;
  additionalVisitorTwoEmail: string;
  additionalVisitorTwoPhone: string;
  additionalVisitorThreeName: string;
  additionalVisitorThreeEmail: string;
  additionalVisitorThreePhone: string;
  
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
  additionalVisitorCount: '0',
  additionalVisitorOneName: '',
  additionalVisitorOneEmail: '',
  additionalVisitorOnePhone: '',
  additionalVisitorTwoName: '',
  additionalVisitorTwoEmail: '',
  additionalVisitorTwoPhone: '',
  additionalVisitorThreeName: '',
  additionalVisitorThreeEmail: '',
  additionalVisitorThreePhone: '',
  
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
  "RMSC Enhanced Supervised Housing (RESH)",
  "George R. Vierno Center (GRVC)",
  "Rose M. Singer Center (RMSC)",
  "North Infirmary Command/West Facility (NIC-WF)",
  "Eric M. Taylor Center (EMTC)",
  "Robert N. Davoren Center (RNDC)",
  "Otis Bantum Correctional Center (OBCC)"
];

export const CAPTAINS = {
  pharmacy: {
    id: 'CAP-PH-8492',
    type: 'pharmacy',
    name: 'Arjun Verma',
    email: 'arjun.verma@mediunify.com',
    phone: '+91 98450 11928',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    dob: '1995-04-12',
    address: '#45, 2nd Cross, Saraswathipuram',
    city: 'Mysuru',
    state: 'Karnataka',
    pincode: '570009',
    rating: 4.95,
    totalDeliveries: 512,
    vehicle: 'Hero Splendor EV (KA-09-EA-3829)',
    verificationStatus: 'Verified (Certified Drug Logistics Agent)',
    licenseNo: 'DL-KA-2024-91823',
    status: 'ONLINE',
    joinedDate: 'March 2024'
  },
  lab: {
    id: 'CAP-LAB-5104',
    type: 'lab',
    name: 'Dr. Sneha Patil (DMLT)',
    email: 'sneha.patil@mediunify.com',
    phone: '+91 97410 88219',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    dob: '1993-08-25',
    address: 'Villa 108, Royal Enclave, Jayalakshmipuram',
    city: 'Mysuru',
    state: 'Karnataka',
    pincode: '570012',
    rating: 4.98,
    totalCollections: 645,
    vehicle: 'Ather 450X (KA-09-EV-7140)',
    verificationStatus: 'Verified (Certified NABL Phlebotomist)',
    licenseNo: 'MLT-NABL-2023-4410',
    coldBoxTemp: '3.6°C',
    status: 'ONLINE',
    joinedDate: 'January 2024'
  }
};

export const INITIAL_LAB_TASKS = [
  {
    id: 'LAB-20101',
    type: 'lab',
    patientName: 'Rajeshwari Kulkarni',
    patientAge: 52,
    patientGender: 'Female',
    patientPhone: '+91 94480 19283',
    patientAddress: 'No. 42, 2nd Main, Temple Road, Yadavagiri, Mysuru',
    bookingId: 'BKG-L-1082',
    testName: 'Complete Lipid Profile & Fasting Plasma Glucose (FBS)',
    testPackage: 'Cardiac Risk & Diabetic Monitoring Panel',
    bookingDate: 'Today',
    collectionDate: 'Today',
    collectionTime: '08:30 AM',
    distance: '2.1 km',
    eta: '7 mins',
    status: 'ASSIGNED', // ASSIGNED, ACCEPTED, ON_THE_WAY, ARRIVED, COLLECTED, VERIFIED, COMPLETED
    sampleType: 'Venous Blood & Fluoride Plasma',
    requiredSample: '1x SST Gold Gel (5ml), 1x Fluoride Grey (2ml)',
    tubeTypes: [
      { id: 'tube_sst_1', name: 'SST Gel Clot Activator (Gold)', volume: '5ml', test: 'Lipid Profile', collected: false },
      { id: 'tube_fbs_1', name: 'Fluoride Vacutainer (Grey)', volume: '2ml', test: 'Fasting Plasma Glucose', collected: false }
    ],
    specialInstructions: 'Patient has completed 12 hours of overnight fasting. Gently invert tubes 6 to 8 times after draw.',
    otp: '3941',
    earnings: 190,
    coldBoxRequired: true,
    coordinates: { lat: 12.3275, lng: 76.6432 }
  },
  {
    id: 'LAB-20102',
    type: 'lab',
    patientName: 'Ganesh Prasad',
    patientAge: 41,
    patientGender: 'Male',
    patientPhone: '+91 98452 33190',
    patientAddress: 'Villa 19, Golden Palms, Vijayanagar 1st Stage, Mysuru',
    bookingId: 'BKG-L-1095',
    testName: 'Thyroid Total (T3, T4, TSH) & Complete Blood Count (CBC)',
    testPackage: 'Endocrine & Hemogram Health Screening',
    bookingDate: 'Today',
    collectionDate: 'Today',
    collectionTime: '10:45 AM',
    distance: '3.6 km',
    eta: '12 mins',
    status: 'ASSIGNED',
    sampleType: 'Whole Blood & Serum',
    requiredSample: '1x Purple EDTA (3ml), 1x Gold SST Tube (5ml)',
    tubeTypes: [
      { id: 'tube_edta_1', name: 'EDTA Vacutainer (Lavender/Purple)', volume: '3ml', test: 'CBC / Hemogram', collected: false },
      { id: 'tube_sst_2', name: 'SST Clot Activator (Gold)', volume: '5ml', test: 'Thyroid Panel (T3, T4, TSH)', collected: false }
    ],
    specialInstructions: 'Non-fasting test. Confirm patient identity with phone OTP before collection.',
    otp: '7259',
    earnings: 210,
    coldBoxRequired: true,
    coordinates: { lat: 12.3325, lng: 76.6190 }
  },
  {
    id: 'LAB-20103',
    type: 'lab',
    patientName: 'Harish Venkatesh',
    patientAge: 66,
    patientGender: 'Male',
    patientPhone: '+91 97410 44812',
    patientAddress: '#89, 4th Cross, Double Road, Saraswathipuram, Mysuru',
    bookingId: 'BKG-L-1104',
    testName: 'Liver Function Test (LFT) & Kidney Function Test (KFT)',
    testPackage: 'Hepatic & Renal Biomarker Profile',
    bookingDate: 'Today',
    collectionDate: 'Today',
    collectionTime: '01:00 PM',
    distance: '1.7 km',
    eta: '6 mins',
    status: 'ASSIGNED',
    sampleType: 'Serum',
    requiredSample: '1x Plain Clot Activator (Red 4ml), 1x SST Gel (Yellow 5ml)',
    tubeTypes: [
      { id: 'tube_red_1', name: 'Plain Clot Tube (Red Top)', volume: '4ml', test: 'Kidney Function Test', collected: false },
      { id: 'tube_sst_3', name: 'SST Gel Tube (Yellow)', volume: '5ml', test: 'Liver Function Test', collected: false }
    ],
    specialInstructions: 'Senior citizen patient. Use 23G butterfly needle for comfortable collection.',
    otp: '5182',
    earnings: 185,
    coldBoxRequired: true,
    coordinates: { lat: 12.3021, lng: 76.6385 }
  }
];

export const INITIAL_PHARMACY_TASKS = [
  {
    id: 'PH-30510',
    type: 'pharmacy',
    patientName: 'Rohan Nambiar',
    patientPhone: '+91 98450 78210',
    deliveryAddress: 'Flat 304, Brigade Symphony, KRS Road, Vontikoppal, Mysuru',
    pharmacyName: 'Apollo Pharmacy - Gokulam 3rd Stage',
    pharmacyPhone: '+91 821 2419080',
    pharmacyAddress: 'Shop 12, 5th Main, Gokulam, Mysuru',
    medicines: [
      { name: 'Augmentin 625 Duo Tablet', dosage: '625mg', qty: 2, price: 430 },
      { name: 'Pan-D Gastro-Resistant Capsule', dosage: '40mg/30mg', qty: 1, price: 195 },
      { name: 'Allegra 120mg Tablet', dosage: '120mg', qty: 1, price: 165 },
      { name: 'Dolo 650mg Paracetamol', dosage: '650mg', qty: 1, price: 32 }
    ],
    totalAmount: 822,
    paymentMode: 'PREPAID (Razorpay UPI)',
    isPaid: true,
    scheduledTime: '10:30 AM',
    distance: '2.1 km',
    eta: '7 mins',
    status: 'ASSIGNED', // ASSIGNED, ACCEPTED, GOING_TO_PHARMACY, ARRIVED_AT_PHARMACY, ORDER_PICKED_UP, GOING_TO_PATIENT, ARRIVED_AT_PATIENT, DELIVERED, COMPLETED
    pharmacyOtp: '4921',
    deliveryOtp: '6385',
    earnings: 160,
    coldChain: false,
    notes: 'Prescription verified by Pharmacist Dr. N. Rao. Check tamper-evident seal before leaving counter.',
    coordinates: {
      pickup: { lat: 12.3275, lng: 76.6350, name: 'Apollo Pharmacy Gokulam' },
      drop: { lat: 12.3310, lng: 76.6280, name: 'Rohan Nambiar (Brigade Symphony)' }
    }
  },
  {
    id: 'PH-30511',
    type: 'pharmacy',
    patientName: 'Meenakshi Sundaram',
    patientPhone: '+91 99002 84192',
    deliveryAddress: 'Villa 88, Roopa Nagar, Bogadi 2nd Stage, Mysuru',
    pharmacyName: 'MedPlus Wellness - Saraswathipuram',
    pharmacyPhone: '+91 821 2548811',
    pharmacyAddress: 'Near Fire Brigade, Saraswathipuram, Mysuru',
    medicines: [
      { name: 'Lantus Solostar Insulin Glargine (100 IU/ml)', dosage: '3ml pen cartridge', qty: 2, price: 1650 },
      { name: 'BD Ultra-Fine Nano Needles (4mm 32G)', dosage: 'Box of 100', qty: 1, price: 890 },
      { name: 'Accu-Chek Active Blood Glucose Strips', dosage: '50 strips pack', qty: 1, price: 950 }
    ],
    totalAmount: 3490,
    paymentMode: 'CASH ON DELIVERY (Collect ₹3490)',
    isPaid: false,
    scheduledTime: '11:45 AM',
    distance: '3.8 km',
    eta: '12 mins',
    status: 'ASSIGNED',
    pharmacyOtp: '7154',
    deliveryOtp: '9203',
    earnings: 240,
    coldChain: true,
    notes: 'CRITICAL COLD CHAIN: Maintain insulated cooler bag with ice gel packs between 2°C - 8°C at all times.',
    coordinates: {
      pickup: { lat: 12.3021, lng: 76.6402, name: 'MedPlus Saraswathipuram' },
      drop: { lat: 12.3075, lng: 76.6315, name: 'Meenakshi Sundaram (Bogadi)' }
    }
  },
  {
    id: 'PH-30512',
    type: 'pharmacy',
    patientName: 'Kiran Basavaraju',
    patientPhone: '+91 97411 93021',
    deliveryAddress: '#214, 8th Cross, Kalidasa Road, Jayalakshmipuram, Mysuru',
    pharmacyName: 'Apollo 24|7 Express Pharmacy - Kalidasa Road',
    pharmacyPhone: '+91 821 2516622',
    pharmacyAddress: 'Kalidasa Road, Jayalakshmipuram, Mysuru',
    medicines: [
      { name: 'Telma-AM 40/5 (Telmisartan + Amlodipine)', dosage: '40mg/5mg', qty: 2, price: 380 },
      { name: 'Rosuvas 10mg (Rosuvastatin)', dosage: '10mg', qty: 2, price: 310 },
      { name: 'Ecosprin-AV 75/20 Capsule', dosage: '75mg/20mg', qty: 1, price: 185 }
    ],
    totalAmount: 875,
    paymentMode: 'PREPAID',
    isPaid: true,
    scheduledTime: '01:30 PM',
    distance: '1.6 km',
    eta: '5 mins',
    status: 'ASSIGNED',
    pharmacyOtp: '3692',
    deliveryOtp: '4178',
    earnings: 135,
    coldChain: false,
    notes: 'Contactless doorstep drop if requested. Ring bell twice upon arrival.',
    coordinates: {
      pickup: { lat: 12.3190, lng: 76.6390, name: 'Apollo Kalidasa Road' },
      drop: { lat: 12.3245, lng: 76.6340, name: 'Kiran Basavaraju (Jayalakshmipuram)' }
    }
  },
  {
    id: 'PH-30513',
    type: 'pharmacy',
    patientName: 'Pooja Hegde',
    patientPhone: '+91 98860 41209',
    deliveryAddress: '#15, 3rd Main, Kuvempunagar, Mysuru',
    pharmacyName: 'Care Pharmacy & Surgicals, Kuvempunagar',
    pharmacyPhone: '+91 821 2567990',
    pharmacyAddress: 'Complex B, Double Road, Kuvempunagar, Mysuru',
    medicines: [
      { name: 'Budecort 0.5mg Respules', dosage: '0.5mg (5 respules)', qty: 2, price: 145 },
      { name: 'Asthalin Inhaler (Salbutamol 100mcg)', dosage: '200 metered doses', qty: 1, price: 160 },
      { name: 'Cetirizine Pediatric Syrup', dosage: '60ml bottle', qty: 1, price: 65 }
    ],
    totalAmount: 370,
    paymentMode: 'PREPAID',
    isPaid: true,
    scheduledTime: '03:15 PM',
    distance: '2.9 km',
    eta: '9 mins',
    status: 'ASSIGNED',
    pharmacyOtp: '5820',
    deliveryOtp: '8314',
    earnings: 150,
    coldChain: false,
    notes: 'Pediatric prescription for infant. Ensure medicine expiry dates are beyond 2027.',
    coordinates: {
      pickup: { lat: 12.2890, lng: 76.6320, name: 'Care Pharmacy Kuvempunagar' },
      drop: { lat: 12.2945, lng: 76.6265, name: 'Pooja Hegde (Kuvempunagar)' }
    }
  }
];

export const INITIAL_COMPLETED_HISTORY = [
  {
    id: 'LAB-20098',
    type: 'lab',
    title: 'Comprehensive Diabetic & HbA1c Panel',
    patientName: 'Subhash Chandra',
    patientAddress: 'Saraswathipuram, Mysuru',
    date: 'Today',
    completedTime: '08:15 AM',
    status: 'COMPLETED',
    earnings: 195,
    sampleCount: 2,
    patientRating: 5.0,
    proofImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PH-30504',
    type: 'pharmacy',
    title: 'Emergency Bronchodilator & Antibiotic Refill',
    patientName: 'Devika Swaminathan',
    patientAddress: 'Hebbal 2nd Stage, Mysuru',
    date: 'Yesterday',
    completedTime: '04:30 PM',
    status: 'COMPLETED',
    earnings: 165,
    totalAmount: 1140,
    patientRating: 5.0,
    proofImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'LAB-20095',
    type: 'lab',
    title: 'Vitamin D3 & Vitamin B12 Quantitative Profile',
    patientName: 'Naveen Kurup',
    patientAddress: 'Yadavagiri Main Road, Mysuru',
    date: 'Yesterday',
    completedTime: '11:40 AM',
    status: 'COMPLETED',
    earnings: 220,
    sampleCount: 2,
    patientRating: 5.0,
    proofImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PH-30499',
    type: 'pharmacy',
    title: 'Post-Surgical Dressing Kits & Analgesics',
    patientName: 'Bharathi Raghavan',
    patientAddress: 'KRS Road, Metagalli, Mysuru',
    date: '17 Sep 2026',
    completedTime: '10:15 AM',
    status: 'COMPLETED',
    earnings: 145,
    totalAmount: 890,
    patientRating: 4.9,
    proofImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PH-30490',
    type: 'pharmacy',
    title: 'Cardiology Medication Monthly Dispatch',
    patientName: 'K. S. Narayanaswamy',
    patientAddress: 'Bannimantap C-Layout, Mysuru',
    date: '16 Sep 2026',
    completedTime: '05:50 PM',
    status: 'CANCELLED',
    reason: 'Patient collected from clinic directly',
    earnings: 35, // Cancellation compensation
    totalAmount: 620,
    patientRating: null
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Pharmacy Delivery Assigned',
    message: 'Order PH-30510 ready at Apollo Pharmacy Gokulam for Rohan Nambiar.',
    time: '3 mins ago',
    type: 'task',
    read: false,
    captainType: 'pharmacy'
  },
  {
    id: 'notif-2',
    title: 'Cold-Chain Insulin Dispatch Alert',
    message: 'Order PH-30511 contains Insulin Glargine. Maintain coolbox between 2°C - 8°C.',
    time: '15 mins ago',
    type: 'alert',
    read: false,
    captainType: 'pharmacy'
  },
  {
    id: 'notif-3',
    title: 'New Phlebotomy Sample Collection',
    message: 'Task LAB-20101 assigned: Rajeshwari Kulkarni for Fasting Glucose & Lipid Profile.',
    time: '28 mins ago',
    type: 'task',
    read: false,
    captainType: 'lab'
  },
  {
    id: 'notif-4',
    title: 'Daily Performance Incentive Milestone!',
    message: 'Congratulations! You earned ₹150 bonus for completing 4 on-time dispatches.',
    time: '2 hours ago',
    type: 'earnings',
    read: true,
    captainType: 'all'
  },
  {
    id: 'notif-5',
    title: 'Weekly Payout Processed',
    message: '₹5,280 credited to your Bank account (A/c ending in 4108).',
    time: 'Yesterday',
    type: 'payment',
    read: true,
    captainType: 'all'
  }
];

export const EARNINGS_SUMMARY = {
  today: {
    amount: 685,
    tasksCompleted: 4,
    incentive: 150,
    distanceKm: 21.4,
    hoursOnline: '5h 10m'
  },
  thisWeek: {
    amount: 4250,
    tasksCompleted: 26,
    incentive: 750,
    distanceKm: 156.0,
    hoursOnline: '34h 15m'
  },
  thisMonth: {
    amount: 16800,
    tasksCompleted: 104,
    incentive: 2800,
    distanceKm: 615.0,
    hoursOnline: '135h'
  },
  totalLifetime: 52400
};

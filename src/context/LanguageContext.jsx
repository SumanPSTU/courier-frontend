import { useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './languageContextValue';

const bn = {
     
     'Sign In': 'সাইন ইন',
   About: 'আমাদের সম্পর্কে', Contact: 'যোগাযোগ',  Privacy: 'গোপনীয়তা',
   COURIER: 'কুরিয়ার', 
  
  '1% Flat COD Fee with 24-Hour Settlement': '২৪ ঘণ্টায় নিষ্পত্তিসহ মাত্র ১% COD ফি', '50% Fair RTO Guarantee': 'ন্যায্য RTO-তে ৫০% ছাড়',
  '2025 Standard Tariffs': '২০২৫ সালের সাধারণ শুল্ক', 'Customer Support': 'গ্রাহক সহায়তা',
   
   'About MadiSynthia Courier Service': 'মাদিসিনথিয়া কুরিয়ার সার্ভিস সম্পর্কে',
     
     
    
   'Track a parcel': 'পার্সেল ট্র্যাক করুন', 'Calculate shipping': 'শিপিং খরচ হিসাব করুন',
  'Explore courier services': 'কুরিয়ার সেবাগুলো দেখুন',  'View your orders': 'আপনার অর্ডার দেখুন',
   
   
    
    
    
    
    
   
   'Don\'t have an account?': 'অ্যাকাউন্ট নেই?', 
     
    
   'By registering, you agree to our': 'নিবন্ধনের মাধ্যমে আপনি আমাদের',
  'and': 'এবং', 'Privacy Policy': 'গোপনীয়তা নীতি', 'Terms': 'শর্তাবলি', 
  'you@example.com': 'আপনার@ইমেইল.com', '1XXXXXXXXX': '১XXXXXXXXX',  
    
   'We could not create your account. Please try again.': 'অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।',
   
   'BD (+880)': 'বাংলাদেশ (+৮৮০)',
  'Enter your email': 'আপনার ইমেইল লিখুন', 'Enter your password': 'আপনার পাসওয়ার্ড লিখুন', 'Welcome Back to Your Priority Recipient Hub': 'আপনার অগ্রাধিকারপ্রাপ্ত গ্রাহক হাবে স্বাগতম',
   
   
   'Direct line to assigned delivery hero': 'নির্ধারিত ডেলিভারি কর্মীর সঙ্গে সরাসরি যোগাযোগ',
   'Shift deliveries to evening or office hours with 1 tap': 'এক ট্যাপে সন্ধ্যা বা অফিস সময়ে ডেলিভারি নির্ধারণ করুন',
   'Instant bKash, Nagad QR scan receipts at doorstep': 'দরজায় bKash বা Nagad QR স্ক্যান করে তাৎক্ষণিক রসিদ',
  'Linehaul Fleet Serving 495 Thanas Nationwide': 'দেশজুড়ে ৪৯৫ থানায় লাইনহল বহর',
  '99.4%': '৯৯.৪%',  
   'Secure Sign Up': 'নিরাপদ নিবন্ধন',
  'BTRC Licensed BD': 'BTRC লাইসেন্সপ্রাপ্ত', 'DG Post Verified': 'DG Post যাচাইকৃত', '256-Bit SSL Encrypted': '২৫৬-বিট SSL এনক্রিপ্টেড',
  'Switch to English': 'ইংরেজিতে দেখুন', 'বাংলায় দেখুন': 'বাংলায় দেখুন',
  
  'Next-generation algorithmic parcel dispatch, secured transit corridors, and integrated cash-on-delivery systems engineered across 64 administrative districts in Bangladesh.': 'বাংলাদেশের ৬৪ জেলায় আধুনিক পার্সেল ডেলিভারি, নিরাপদ পরিবহন ও ক্যাশ-অন-ডেলিভারি সেবা।',
  'Logistics Hubs': 'লজিস্টিকস হাব', 'Dhaka Central Sorting (Tejgaon)': 'ঢাকা সর্টিং (তেজগাঁও)',
  'Chittagong Port Terminal (Agrabad)': 'চট্টগ্রাম টার্মিনাল (আগ্রাবাদ)', 'Sylhet Hub (Subidbazar)': 'সিলেট হাব (সুবিদবাজার)',
  'Rajshahi Northern Depot': 'রাজশাহী ডিপো', 'Khulna Distribution Facility': 'খুলনা কেন্দ্র', 'All 64 District Points →': '৬৪ জেলার সব পয়েন্ট →',
  'Delivery rates': 'ডেলিভারি চার্জ', Coverage: 'কভারেজ', Company: 'প্রতিষ্ঠান', 'Terms and conditions': 'শর্তাবলি',
  '© 2025 MadiSynthia Courier Service Ltd. Incorporated in Bangladesh.': '© ২০২৫ মাদিসিনথিয়া কুরিয়ার সার্ভিস লিমিটেড। বাংলাদেশে নিবন্ধিত।',
  'LIVE DISPATCH': 'লাইভ ডিসপ্যাচ', 
  'From pickup to handover': 'পিকআপ থেকে হস্তান্তর পর্যন্ত', 'Tools for merchants and recipients': 'মার্চেন্ট ও প্রাপকের জন্য সুবিধা',
  'Our service priorities': 'আমাদের সেবার অগ্রাধিকার', 'Explore MadiSynthia': 'মাদিসিনথিয়া ঘুরে দেখুন',
  'Support hotline': 'সহায়তা হটলাইন', 'Tracking ID': 'ট্র্যাকিং আইডি', 'Have it ready': 'হাতে রাখুন', 'Delivery help': 'ডেলিভারি সহায়তা',
  'Call our support team': 'সহায়তা দলের সঙ্গে কথা বলুন', 'Check a parcel first': 'প্রথমে পার্সেল ট্র্যাক করুন',
  'Planning a shipment?': 'পার্সেল পাঠানোর পরিকল্পনা করছেন?', 'Protect your information': 'আপনার তথ্য সুরক্ষিত রাখুন',
  '1. Shipment information': '১. পার্সেলের তথ্য', '2. Parcel preparation and contents': '২. পার্সেল প্রস্তুতি ও বিষয়বস্তু',
  '3. Rates and payment': '৩. চার্জ ও পেমেন্ট', '4. Delivery and tracking': '৪. ডেলিভারি ও ট্র্যাকিং',
  '5. Recipient handover and delivery attempts': '৫. প্রাপকের কাছে হস্তান্তর ও ডেলিভারির প্রচেষ্টা',
  '6. Delays, restrictions, and service availability': '৬. বিলম্ব, সীমাবদ্ধতা ও সেবার প্রাপ্যতা',
  '7. Website information': '৭. ওয়েবসাইটের তথ্য', '8. Questions or concerns': '৮. প্রশ্ন বা অভিযোগ',
  '1. Information you provide': '১. আপনার দেওয়া তথ্য', '2. Service and usage information': '২. সেবা ও ব্যবহারসংক্রান্ত তথ্য',
  '3. How information is used': '৩. তথ্য কীভাবে ব্যবহার করা হয়', '4. When information may be shared': '৪. কখন তথ্য শেয়ার করা হতে পারে',
  '5. Keeping information': '৫. তথ্য সংরক্ষণ', '6. Protecting information': '৬. তথ্য সুরক্ষা',
  '7. Your choices and requests': '৭. আপনার পছন্দ ও অনুরোধ', '8. Contact about privacy': '৮. গোপনীয়তা বিষয়ে যোগাযোগ',
  'Home': 'হোম', 'Services': 'সেবাসমূহ', 'Zone Rates': 'জোনভিত্তিক মূল্য', 'Book Delivery': 'ডেলিভারি বুক করুন',
  'Live Tracking': 'লাইভ ট্র্যাকিং', 'Calculate Shipping': 'শিপিং খরচ হিসাব', 'Login': 'লগইন', 'About Us': 'আমাদের সম্পর্কে',
  'About MadiSynthia': 'মাদিসিনথিয়া সম্পর্কে', 'Contact us': 'যোগাযোগ করুন', 'Privacy policy': 'গোপনীয়তা নীতি',
  'MadiSynthia Courier Service': 'মাদিসিনথিয়া কুরিয়ার সার্ভিস', 'Bangladesh Logistics Express': 'বাংলাদেশ লজিস্টিকস এক্সপ্রেস',
  'Courier Service Limited • Bangladesh': 'কুরিয়ার সার্ভিস লিমিটেড • বাংলাদেশ',
  'Need a hand?': 'সহায়তা দরকার?', 'Our team can help with deliveries, services, or these pages.': 'ডেলিভারি, সেবা বা এই পেজগুলো সম্পর্কে আমাদের দল আপনাকে সাহায্য করতে পারে।',
  'Already have an account?': 'ইতিমধ্যে অ্যাকাউন্ট আছে?', 'Create Account': 'অ্যাকাউন্ট তৈরি করুন', 'Create My Account': 'আমার অ্যাকাউন্ট তৈরি করুন',
  'Full Name': 'পূর্ণ নাম', 'Email Address': 'ইমেইল ঠিকানা', 'Phone Number': 'ফোন নম্বর', Password: 'পাসওয়ার্ড',
  'Confirm Password': 'পাসওয়ার্ড নিশ্চিত করুন', 'As shown on deliveries': 'ডেলিভারিতে ব্যবহৃত নাম', 'Fill in your details to get started.': 'শুরু করতে আপনার তথ্য দিন।',
  'Your full name': 'আপনার পূর্ণ নাম', 'At least 8 characters': 'কমপক্ষে ৮টি অক্ষর', 'Re-enter your password': 'আবার পাসওয়ার্ড লিখুন',
  'Creating Account…': 'অ্যাকাউন্ট তৈরি হচ্ছে…', 'Show password': 'পাসওয়ার্ড দেখুন', 'Hide password': 'পাসওয়ার্ড লুকান',
  'Your passwords do not match.': 'দুটি পাসওয়ার্ড মিলছে না।', 'A smoother delivery experience': 'আরও সহজ ডেলিভারি অভিজ্ঞতা',
  'Sign up to manage your parcels from one place.': 'এক জায়গা থেকে পার্সেল পরিচালনা করতে নিবন্ধন করুন।', Recipient: 'প্রাপক',
  'Prestige Delivery Pass': 'প্রিমিয়াম ডেলিভারি পাস', 'Instant Account Access': 'তাৎক্ষণিক অ্যাকাউন্ট প্রবেশ',
  'Dynamic Handover PIN': 'ডেলিভারির নিরাপদ PIN', 'Tamper-proof package release key for riders': 'রাইডারের কাছে পার্সেল হস্তান্তরের নিরাপদ চাবি',
  'Real-Time Motorbike Radar': 'মোটরবাইকের অবস্থান সরাসরি দেখুন', 'Flexible Time Window': 'সুবিধামতো ডেলিভারি সময়',
  'Digital Cash on Delivery': 'ডিজিটাল ক্যাশ অন ডেলিভারি', 'On-Time Linehaul': 'সময়মতো লাইনহল', 'Active Recipients': 'সক্রিয় প্রাপক', 'Satisfaction Rating': 'সন্তুষ্টির রেটিং',
  '64': '৬৪', '495': '৪৯৫', 'One place': 'এক জায়গায়', 'District coverage': 'জেলার আওতা', 'Thanas served': 'থানা সেবা', 'For shipment updates': 'শিপমেন্ট আপডেট',
  'Made for everyday delivery': 'প্রতিদিনের ডেলিভারির জন্য', 'What matters on every shipment': 'প্রতিটি শিপমেন্টে যা গুরুত্বপূর্ণ',
  'Reach across Bangladesh': 'বাংলাদেশজুড়ে পৌঁছান', 'Stay informed': 'খবর রাখুন', 'Help when you need it': 'প্রয়োজনের সময় সহায়তা',
  'A clear path from start to finish': 'শুরু থেকে শেষ পর্যন্ত স্পষ্ট যাত্রা', 'How a delivery comes together': 'ডেলিভারি যেভাবে সম্পন্ন হয়',
  'Prepare your parcel': 'পার্সেল প্রস্তুত করুন', 'Choose your service': 'সেবা বেছে নিন', 'Follow the journey': 'ডেলিভারির অগ্রগতি দেখুন',
  'Calculate a delivery rate': 'ডেলিভারি চার্জ হিসাব করুন', 'Explore services': 'সেবা দেখুন', 
  'Book a delivery': 'ডেলিভারি বুক করুন', 'Talk to us': 'আমাদের সঙ্গে কথা বলুন', 'Ready when you are': 'আপনি প্রস্তুত হলে আমরাও প্রস্তুত',
  'Plan your next delivery with confidence.': 'নিশ্চিন্তে আপনার পরবর্তী ডেলিভারি পরিকল্পনা করুন।', 
  'Toggle navigation': 'নেভিগেশন খুলুন বা বন্ধ করুন',
  'MadiSynthia Courier Service helps businesses send and customers receive parcels across Bangladesh. We bring delivery planning, tracking, and support together to make each step easier to understand—from preparing a parcel to its final handover.': 'মাদিসিনথিয়া কুরিয়ার সার্ভিস ব্যবসাকে পার্সেল পাঠাতে এবং গ্রাহকদের বাংলাদেশজুড়ে পার্সেল পেতে সহায়তা করে। পার্সেল প্রস্তুতি থেকে চূড়ান্ত হস্তান্তর পর্যন্ত প্রতিটি ধাপ সহজে বুঝতে ডেলিভারি পরিকল্পনা, ট্র্যাকিং ও সহায়তাকে একত্র করে।',
  'Connected delivery network': 'সংযুক্ত ডেলিভারি নেটওয়ার্ক',
  'A network built for Bangladesh': 'বাংলাদেশের জন্য বিস্তৃত নেটওয়ার্ক',
  'Our delivery network is designed to connect major cities, district towns, and surrounding communities. Explore the Coverage page for service areas, or check the Zone Rates page to understand how destination zones affect delivery.': 'আমাদের ডেলিভারি নেটওয়ার্ক প্রধান শহর, জেলা শহর ও আশপাশের এলাকাগুলোকে যুক্ত করার জন্য তৈরি। সেবার এলাকা জানতে কভারেজ পেজ দেখুন, অথবা গন্তব্যভেদে চার্জ জানতে জোন রেট দেখুন।',
  'View coverage': 'কভারেজ দেখুন', 'Review zone rates': 'জোনভিত্তিক মূল্য দেখুন',
  'Service built around clear handovers': 'স্পষ্ট হস্তান্তরভিত্তিক সেবা',
  'We aim to make delivery information clear, handle parcels responsibly, and communicate when a shipment needs attention. Delivery timelines and availability can vary with destination, access, weather, and other operating conditions.': 'আমরা ডেলিভারির তথ্য স্পষ্ট রাখতে, পার্সেল যত্নসহকারে পরিচালনা করতে এবং শিপমেন্টে বিশেষ মনোযোগ প্রয়োজন হলে যোগাযোগ করতে সচেষ্ট। গন্তব্য, প্রবেশাধিকার, আবহাওয়া ও পরিচালনাগত অবস্থার কারণে সময় ও সেবার প্রাপ্যতা বদলাতে পারে।',
  'A simpler way to move every parcel forward.': 'প্রতিটি পার্সেল এগিয়ে নেওয়ার সহজ উপায়।',
  'Whether you are shipping customer orders or waiting for a delivery, the right information makes the experience smoother. MadiSynthia brings service options, rate planning, tracking, and support into one connected courier experience.': 'আপনি গ্রাহকের অর্ডার পাঠান বা ডেলিভারির অপেক্ষা করুন—সঠিক তথ্য অভিজ্ঞতাকে সহজ করে। মাদিসিনথিয়া সেবার বিকল্প, চার্জ পরিকল্পনা, ট্র্যাকিং ও সহায়তাকে একই কুরিয়ার অভিজ্ঞতায় যুক্ত করে।',
  'Plan deliveries across a network designed for all 64 districts.': '৬৪ জেলার জন্য তৈরি নেটওয়ার্কে ডেলিভারি পরিকল্পনা করুন।',
  'Use shipment tracking to follow the latest available parcel updates.': 'পার্সেলের সর্বশেষ আপডেট দেখতে ট্র্যাকিং ব্যবহার করুন।',
  'Get in touch with our team for delivery and service questions.': 'ডেলিভারি ও সেবা সংক্রান্ত প্রশ্নে আমাদের দলের সঙ্গে যোগাযোগ করুন।',
  'Pack securely and check sender, recipient, address, and phone details.': 'নিরাপদে প্যাক করুন এবং প্রেরক, প্রাপক, ঠিকানা ও ফোনের তথ্য যাচাই করুন।',
  'Review the delivery options and estimate the rate for your destination.': 'ডেলিভারির বিকল্প দেখুন এবং গন্তব্য অনুযায়ী চার্জ হিসাব করুন।',
  'Keep the consignment number handy and check tracking for updates.': 'কনসাইনমেন্ট নম্বর কাছে রাখুন এবং আপডেটের জন্য ট্র্যাকিং দেখুন।',
  'Tools and people working together to help parcels reach their destination.': 'পার্সেল গন্তব্যে পৌঁছাতে মানুষ ও প্রযুক্তি একসঙ্গে কাজ করে।',
  'Compare services, estimate a rate, or talk with our team about your parcel.': 'সেবার তুলনা করুন, চার্জ হিসাব করুন অথবা পার্সেল নিয়ে আমাদের দলের সঙ্গে কথা বলুন।',
  'NATIONWIDE 64 DISTRICTS': 'দেশজুড়ে ৬৪ জেলা',
  'Express Dispatch & Nationwide Linehaul live across 495 Thanas': '৪৯৫ থানায় এক্সপ্রেস ডিসপ্যাচ ও লাইনহল চালু',
  '1% Flat COD Fee': 'মাত্র ১% COD ফি', 'Explore 2025 Standard Tariffs': '২০২৫ সালের ডেলিভারি চার্জ দেখুন',
  'Next-day intra-city': 'একই শহরে পরদিনে ডেলিভারি', '2–3 days nationwide': 'দেশজুড়ে ২–৩ দিন', 'Doorstep PIN release': 'ঠিকানায় পিনে রিলিজ',
  'Book a pickup, follow every parcel in real time, and get your cash the next day. Built for online sellers, D2C brands, and shops that deliver across all 64 districts.': 'পিকআপ বুক করুন, প্রতিটি পার্সল রিয়েল টাইমে দেখুন এবং পরদিন টাকা পান। অনলাইন বিক্রেতা, D2C ব্র্যান্ড ও দোকানের জন্য তৈরি।',
  'Fast, Sustainable Parcel Delivery Across All': 'দ্রুত ও পরিবেশবান্ধব পার্সেল ডেলিভারি', '64 Districts': '৬৪ জেলায়', 'of Bangladesh.': 'বাংলাদেশজুড়ে।',
  'On-Time SLA': 'সময়মতো ডেলিভারি', 'Dhaka Metro Speed': 'ঢাকা মহানগর', 'Daily Orders': 'দৈনিক অর্ডার', 'Nationwide Mesh': 'দেশজুড়ে', 'COD Payout': 'COD পরিশোধ', 'bKash • Nagad • Bank': 'বিকাশ • নগদ • ব্যাংক',
  'Open Merchant Account': 'মার্চেন্ট অ্যাকাউন্ট খুলুন',
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('siteLanguage') === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('siteLanguage', language);
    } catch {
      // The in-memory language choice still works when storage is unavailable.
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    isBangla: language === 'bn',
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === 'en' ? 'bn' : 'en'),
    t: (text) => language === 'bn' ? (bn[text] ?? text) : text,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

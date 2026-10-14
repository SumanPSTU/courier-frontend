import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Box,
  Building,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  FileText,
  Layers,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Printer,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  Zap,
} from 'lucide-react';
import { ordersApi } from '../api/orders';
import { authApi } from '../api/auth';
import { useAuthContext } from '../context/authContextValue';
import Field from '../components/ui/TextField';
import { loadDemoParcel } from '../utils/loadDemoParcel';

// --- Bangladesh Logistics Hubs & Districts ---
const BANGLADESH_DISTRICTS = [
  { name: 'Dhaka', division: 'Dhaka', code: 'DAC', hub: 'Tejgaon Pickup Center', isSuburban: false, popularAreas: ['Dhanmondi', 'Gulshan 1 & 2', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Badda', 'Motijheel', 'Tejgaon', 'Khilgaon', 'Bashundhara R/A'] },
  { name: 'Gazipur', division: 'Dhaka', code: 'GZP', hub: 'Gazipur Pickup Center', isSuburban: true, popularAreas: ['Tongi', 'Board Bazar', 'Chowrasta', 'Joydebpur', 'Konabari'] },
  { name: 'Narayanganj', division: 'Dhaka', code: 'NGJ', hub: 'Narayanganj Pickup Center', isSuburban: true, popularAreas: ['Chashara', 'Fatullah', 'Siddhirganj', 'Bandar', 'Rupganj'] },
  { name: 'Savar', division: 'Dhaka', code: 'SVR', hub: 'Savar Pickup Center', isSuburban: true, popularAreas: ['Savar Bazar', 'Ashulia', 'DEPZ', 'Hemayetpur', 'Baipayl'] },
  { name: 'Keraniganj', division: 'Dhaka', code: 'KRG', hub: 'South Dhaka Pickup Center', isSuburban: true, popularAreas: ['Zinzira', 'Aganagar', 'Rohitpur', 'Kadamttoli'] },
  { name: 'Dhamrai', division: 'Dhaka', code: 'DHM', hub: 'Dhamrai Pickup Center', isSuburban: true, popularAreas: ['Dhamrai Sadar', 'Kautia', 'Rowail'] },
  { name: 'Chattogram', division: 'Chattogram', code: 'CTG', hub: 'Agrabad Delivery Center', isSuburban: false, popularAreas: ['Agrabad C/A', 'GEC Circle', 'Panchlaish', 'Nasirabad', 'Halishahar', 'Khulshi', 'Kotwali', 'Muradpur'] },
  { name: 'Sylhet', division: 'Sylhet', code: 'SYL', hub: 'Sylhet Delivery Center', isSuburban: false, popularAreas: ['Zindabazar', 'Amberkhana', 'Shahjalal Uposhohor', 'Shibgonj', 'Subidbazar'] },
  { name: 'Rajshahi', division: 'Rajshahi', code: 'RAJ', hub: 'Rajshahi Delivery Center', isSuburban: false, popularAreas: ['Shaheb Bazar', 'Boalia', 'Motihar', 'Rajpara', 'Kazla'] },
  { name: 'Khulna', division: 'Khulna', code: 'KHL', hub: 'Khulna Delivery Center', isSuburban: false, popularAreas: ['Shibbari', 'Khalishpur', 'Daulatpur', 'Sonadanga', 'Boyra'] },
  { name: 'Barishal', division: 'Barishal', code: 'BAR', hub: 'Barishal Delivery Center', isSuburban: false, popularAreas: ['Sadarganj', 'Natun Bazar', 'Rupatoli', 'Amtala'] },
  { name: 'Rangpur', division: 'Rangpur', code: 'RNG', hub: 'Rangpur Delivery Center', isSuburban: false, popularAreas: ['Jahaj Company More', 'Dhap', 'Modern More', 'Medical More'] },
  { name: 'Mymensingh', division: 'Mymensingh', code: 'MYM', hub: 'Mymensingh Delivery Center', isSuburban: false, popularAreas: ['Ganginar Par', 'Charpara', 'Town Hall', 'Kashor'] },
  { name: 'Cumilla', division: 'Chattogram', code: 'CUM', hub: 'Cumilla Delivery Center', isSuburban: false, popularAreas: ['Kandirpar', 'Badurtala', 'Tomchom Bridge', 'Paduar Bazar'] },
  { name: 'Bogura', division: 'Rajshahi', code: 'BOG', hub: 'Bogura Delivery Center', isSuburban: false, popularAreas: ['Satmatha', 'Joleshwaritola', 'Thanthania', 'Sherpur Road'] },
  { name: 'Cox\'s Bazar', division: 'Chattogram', code: 'CXB', hub: 'Cox\'s Bazar Delivery Center', isSuburban: false, popularAreas: ['Kolatoli Point', 'Laboni Point', 'Main Road', 'Teknaf'] },
  { name: 'Jashore', division: 'Khulna', code: 'JSH', hub: 'Jashore Delivery Center', isSuburban: false, popularAreas: ['Chowrasta', 'Daratana', 'Kotwali', 'Benapole'] },
  { name: 'Kushtia', division: 'Khulna', code: 'KST', hub: 'Kushtia Delivery Center', isSuburban: false, popularAreas: ['Majampur', 'Court Station', 'NS Road'] },
  { name: 'Dinajpur', division: 'Rangpur', code: 'DNJ', hub: 'Dinajpur Delivery Center', isSuburban: false, popularAreas: ['Nimtala', 'Balubari', 'Goneshtola'] },
  { name: 'Pabna', division: 'Rajshahi', code: 'PAB', hub: 'Pabna Delivery Center', isSuburban: false, popularAreas: ['Abdul Hamid Road', 'Traffic More', 'Gacha More'] },
  { name: 'Tangail', division: 'Dhaka', code: 'TNG', hub: 'Tangail Delivery Center', isSuburban: false, popularAreas: ['Nirala More', 'Old Bus Stand', 'Akurtakur Para'] },
  { name: 'Faridpur', division: 'Dhaka', code: 'FRP', hub: 'Faridpur Delivery Center', isSuburban: false, popularAreas: ['Mujib Sarak', 'Goalchamot', 'Alipur'] },
  { name: 'Feni', division: 'Chattogram', code: 'FEN', hub: 'Feni Delivery Center', isSuburban: false, popularAreas: ['Trunk Road', 'Grand Trunk', 'SSK Road'] },
  { name: 'Noakhali', division: 'Chattogram', code: 'NOA', hub: 'Noakhali Delivery Center', isSuburban: false, popularAreas: ['Maijdee Court', 'Super Market', 'Town Hall'] },
  { name: 'Brahmanbaria', division: 'Chattogram', code: 'BRB', hub: 'Brahmanbaria Delivery Center', isSuburban: false, popularAreas: ['Halderpara', 'Court Road', 'Kashba'] },
];

const SUBURBAN_NAMES = ['SAVAR', 'GAZIPUR', 'NARAYANGANJ', 'KERANIGANJ', 'DHAMRAI'];

// --- Zone Resolver (Matches Backend Algorithm) ---
function resolveZone(pickupDistrict = '', deliveryDistrict = '') {
  const p = (pickupDistrict || '').trim().toUpperCase();
  const d = (deliveryDistrict || '').trim().toUpperCase();
  if (!p || !d) return { zone: 'INSIDE_DHAKA', label: 'Local delivery', distance: '~15 km', sla: 'Same or next day' };

  const isPickupDhaka = p === 'DHAKA';
  const isDeliveryDhaka = d === 'DHAKA';
  const isDeliverySuburban = SUBURBAN_NAMES.includes(d);

  if (isPickupDhaka && isDeliveryDhaka) {
    return { zone: 'INSIDE_DHAKA', label: 'Delivery within Dhaka', distance: '~15-25 km', sla: 'Within 24 hours' };
  }
  if (isPickupDhaka && isDeliverySuburban) {
    return { zone: 'DHAKA_SUBURBAN', label: 'Delivery near Dhaka', distance: '~35-65 km', sla: 'Within 24 hours' };
  }
  if (isPickupDhaka || isDeliveryDhaka) {
    return { zone: 'OUTSIDE_DHAKA', label: 'Dhaka to another district', distance: '~180-280 km', sla: 'Usually 24–48 hours' };
  }
  return { zone: 'DISTRICT_TO_DISTRICT', label: 'Delivery between districts', distance: '~250-450 km', sla: 'Usually 48–72 hours' };
}

// --- Parcel Categories ---
const CATEGORIES = [
  { id: 'PARCEL', label: 'General parcel', icon: Package, badge: 'Everyday items', desc: 'Clothes, gifts, shop items, and household goods' },
  { id: 'DOCUMENTS', label: 'Documents', icon: FileText, badge: 'Protective pouch', desc: 'Letters, contracts, certificates, and passports' },
  { id: 'ELECTRONICS', label: 'Electronics', icon: Zap, badge: 'Extra padding', desc: 'Phones, laptops, cameras, and other electronics' },
  { id: 'FRAGILE', label: 'Fragile items', icon: ShieldCheck, badge: 'Handle with care', desc: 'Glass, dishes, cosmetics, and other breakable items' },
  { id: 'CLOTHING', label: 'Clothes and shoes', icon: Layers, badge: 'Protective bag', desc: 'Clothes, fabric, shoes, and fashion items' },
  { id: 'Book', label: 'Books', icon: Box, badge: 'Books and printed materials', desc: 'Books and other printed materials' },
  { id: 'HEAVY', label: 'Heavy parcel (over 5 kg)', icon: Scale, badge: 'Extra handling', desc: 'Equipment, large boxes, and heavy appliances' },
];

const getPaymentMethodLabel = (method) => ({
  COD: 'Cash on delivery',
  PREPAID: 'Already paid',
  CARD: 'Online payment',
}[method] || 'Cash on delivery');

const getDeliverySpeedLabel = (speed) => ({
  STANDARD: 'Standard',
  PRIORITY: 'Fast',
  SAME_DAY: 'Same day',
}[speed] || 'Standard');

const emptyForm = {
  senderName: '',
  senderPhone: '',
  pickupAddress: '',
  pickupDistrict: '',
  pickupArea: '',
  pickupWindow: 'ANYTIME',
  recipientName: '',
  recipientPhone: '',
  recipientAltPhone: '',
  deliveryAddress: '',
  deliveryDistrict: '',
  deliveryArea: '',
  deliveryNotes: '',
  description: '',
  category: 'PARCEL',
  weightKG: '1',
  lengthCM: '',
  widthCM: '',
  heightCM: '',
  serviceSpeed: 'STANDARD',
  paymentMethod: 'COD',
  codAmount: '0',
  openBoxVerification: false,
  fragileSticker: false,
  smsNotification: true,
  extraServiceIds: ['SMS_UPDATES'],
};

const STEPS = [
  { id: 1, title: 'Pickup details', subtitle: 'Your name and pickup address', icon: MapPin },
  { id: 2, title: 'Delivery details', subtitle: 'Who gets it and where it goes', icon: PackageCheck },
  { id: 3, title: 'Parcel details', subtitle: 'What you are sending', icon: Package },
  { id: 4, title: 'Payment and booking', subtitle: 'Delivery speed and payment', icon: Truck },
];

export default function BookParcel() {
  const { auth, user } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [showVolumetric, setShowVolumetric] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);
  const [deliveryServices, setDeliveryServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [zoneTariffs, setZoneTariffs] = useState([]);
  const [pricingSettings, setPricingSettings] = useState(null);
  const [pricingConfigStatus, setPricingConfigStatus] = useState('loading');
  const [pricingConfigError, setPricingConfigError] = useState('');
  const currencySymbol = pricingSettings?.currencySymbol || '৳';

  useEffect(() => {
    let active = true;
    setPricingConfigStatus('loading');
    ordersApi.getPricingConfig().then(({ data }) => {
      if (!active) return;
      const config = data.data?.appConfig;
      if (!config) throw new Error('Pricing settings are not available. Please try again later.');
      setPricingSettings(config);
      setZoneTariffs(data.data?.zoneConfigs || []);
      setDeliveryServices(Array.isArray(config.deliveryServices) ? config.deliveryServices : []);
      setExtraServices(Array.isArray(config.extraServices) ? config.extraServices : []);
      if (Array.isArray(config.categoryPricing)) {
        const categoryRows = config.categoryPricing.filter((item) => item.enabled !== false);
        const categoriesById = new Map(CATEGORIES.map((item) => [item.id, item]));
        const available = categoryRows.map((item) => ({
          ...(categoriesById.get(item.category) || { icon: Package, badge: 'Parcel item' }),
          id: item.category, label: item.label || categoriesById.get(item.category)?.label || item.category,
          desc: item.description || categoriesById.get(item.category)?.desc || '',
          badge: Number(item.discount) > 0 ? `${config.currencySymbol || '৳'}${item.discount} discount` : categoriesById.get(item.category)?.badge || 'Parcel item',
        }));
        setCategories(available);
        setForm((current) => available.some((item) => item.id === current.category) ? current : { ...current, category: available[0]?.id || '' });
      } else setCategories([]);
      const enabledIds = new Set((config.extraServices || []).filter((item) => item.enabled).map((item) => item.id));
      setForm((current) => {
        const selected = current.extraServiceIds.filter((id) => enabledIds.has(id));
        if (enabledIds.has('SMS_UPDATES') && !selected.includes('SMS_UPDATES')) selected.push('SMS_UPDATES');
        return { ...current, extraServiceIds: selected };
      });
      setPricingConfigError('');
      setPricingConfigStatus('ready');
    }).catch((error) => {
      if (!active) return;
      setPricingConfigError(error.response?.data?.message || error.message || 'Could not load current delivery pricing. Please refresh the page.');
      setPricingConfigStatus('error');
    });
    return () => { active = false; };
  }, []);

  // Autofill sender details from auth profile on mount
  useEffect(() => {
    if (!auth) return;
    let active = true;
    authApi.getProfile()
      .then(({ data }) => {
        if (!active) return;
        const sender = data.data;
        if (sender) {
          setForm((curr) => ({
            ...curr,
            senderName: curr.senderName || sender.name || user?.name || '',
            senderPhone: curr.senderPhone || sender.phone || '',
            pickupAddress: curr.pickupAddress || sender.address || '',
          }));
        }
      })
      .catch(() => {
        if (active && user?.name) {
          setForm((curr) => ({ ...curr, senderName: curr.senderName || user.name }));
        }
      });
    return () => { active = false; };
  }, [auth, user?.name]);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((curr) => ({
      ...curr,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleAutofillProfile = () => {
    if (!auth) {
      navigate('/login');
      return;
    }
    authApi.getProfile().then(({ data }) => {
      const sender = data.data;
      if (sender) {
        setForm((curr) => ({
          ...curr,
          senderName: sender.name || curr.senderName,
          senderPhone: sender.phone || curr.senderPhone,
          pickupAddress: sender.address || curr.pickupAddress,
        }));
      }
    });
  };

  const handleSwapAddresses = () => {
    setForm((curr) => ({
      ...curr,
      senderName: curr.recipientName,
      senderPhone: curr.recipientPhone,
      pickupAddress: curr.deliveryAddress,
      pickupDistrict: curr.deliveryDistrict,
      pickupArea: curr.deliveryArea,
      recipientName: curr.senderName,
      recipientPhone: curr.senderPhone,
      deliveryAddress: curr.pickupAddress,
      deliveryDistrict: curr.pickupDistrict,
      deliveryArea: curr.pickupArea,
    }));
  };

  const handleLoadSample = () => loadDemoParcel({ setForm, setError });

  const handleResetForm = () => {
    const enabledExtras = extraServices.filter((service) => service.enabled);
    setForm({
      ...emptyForm,
      category: categories[0]?.id || '',
      serviceSpeed: availableSpeeds[0]?.id || '',
      extraServiceIds: enabledExtras.filter((service) => service.id === 'SMS_UPDATES').map((service) => service.id),
    });
    setCurrentStep(1);
    setError('');
    setOrder(null);
  };

  // --- Dynamic Pricing & Corridor Calculation ---
  const corridor = useMemo(() => {
    return resolveZone(form.pickupDistrict, form.deliveryDistrict);
  }, [form.pickupDistrict, form.deliveryDistrict]);
  const selectedZoneTariff = zoneTariffs.find((tariff) => tariff.zoneKey === corridor.zone) || null;

  const availableSpeeds = useMemo(() => {
    if (pricingConfigStatus !== 'ready' || !zoneTariffs.some((tariff) => tariff.zoneKey === corridor.zone)) return [];
    return deliveryServices.filter((service) => service.enabled && (service.priceMode !== 'ZONE_PRICE' || service.zonePrices?.[corridor.zone] != null));
  }, [deliveryServices, corridor, pricingConfigStatus, zoneTariffs]);

  useEffect(() => {
    if (availableSpeeds.length && !availableSpeeds.some((service) => service.id === form.serviceSpeed)) {
      setForm((current) => ({ ...current, serviceSpeed: availableSpeeds[0].id }));
    }
  }, [availableSpeeds, form.serviceSpeed]);

  const estimatePayload = useMemo(() => ({
    pickupAddress: { district: form.pickupDistrict.trim(), area: form.pickupArea.trim() },
    deliveryAddress: { district: form.deliveryDistrict.trim(), area: form.deliveryArea.trim() },
    parcel: {
      actualWeight: Math.max(0.1, Number(form.weightKG) || 1),
      category: form.category,
      description: form.description.trim(),
      dimensions: { length: Number(form.lengthCM) || 0, width: Number(form.widthCM) || 0, height: Number(form.heightCM) || 0 },
    },
    serviceSpeed: form.serviceSpeed,
    extraServiceIds: form.extraServiceIds,
    openBoxVerification: form.extraServiceIds.includes('OPEN_BOX'),
    fragileSticker: form.extraServiceIds.includes('FRAGILE'),
    paymentMethod: form.paymentMethod,
    codAmount: form.paymentMethod === 'COD' ? Math.max(0, Number(form.codAmount) || 0) : 0,
  }), [form]);
  const estimateKey = useMemo(() => JSON.stringify(estimatePayload), [estimatePayload]);
  const hasEstimateInputs = Boolean(
    pricingConfigStatus === 'ready' &&
    form.pickupDistrict &&
    form.deliveryDistrict &&
    form.pickupAddress.trim() &&
    form.deliveryAddress.trim() &&
    form.description.trim() &&
    Number(form.weightKG) > 0
  );
  const [estimateState, setEstimateState] = useState(null);
  useEffect(() => {
    if (!hasEstimateInputs) {
      setEstimateState(null);
      return;
    }

    let active = true;
    ordersApi.estimate(estimatePayload)
      .then(({ data }) => { if (active) setEstimateState({ key: estimateKey, data: data.data }); })
      .catch((err) => { if (active) setEstimateState({ key: estimateKey, error: err.response?.data?.message || 'Unable to calculate the delivery estimate.' }); });
    return () => { active = false; };
  }, [estimateKey, estimatePayload, hasEstimateInputs]);

  const estimate = hasEstimateInputs && estimateState?.key === estimateKey ? estimateState.data : null;
  const pricingError = hasEstimateInputs && estimateState?.key === estimateKey ? estimateState.error : null;
  const pricing = estimate ? {
    zone: estimate.zone,
    zoneLabel: corridor.label,
    actualWeight: estimatePayload.parcel.actualWeight.toFixed(1),
    volumetricWeight: estimate.volumetricWeightKg > 0 ? estimate.volumetricWeightKg.toFixed(1) : null,
    billableWeight: estimate.billableWeightKg.toFixed(1),
    isVolumetricApplied: estimate.isVolumetricApplied,
    baseRate: estimate.breakdown.baseAndDistanceFee + estimate.breakdown.bookDiscount,
    bookDiscount: estimate.breakdown.bookDiscount,
    weightSurcharge: estimate.breakdown.weightSurcharge,
    speedFee: estimate.breakdown.speedFee ?? estimate.breakdown.priorityFee,
    handlingFee: estimate.breakdown.extraServicesFee ?? (estimate.breakdown.openBoxVerificationFee + estimate.breakdown.fragileStickerFee),
    codFee: estimate.breakdown.codFee,
    totalDeliveryFee: estimate.breakdown.totalDeliveryFee,
    codAmount: estimatePayload.codAmount,
    netPayableToMerchant: estimate.merchantLedger.netPayableToMerchant,
    codPercentage: selectedZoneTariff?.codPercentage ?? 0,
    currencySymbol,
  } : {
    zone: corridor.zone, zoneLabel: corridor.label,
    actualWeight: estimatePayload.parcel.actualWeight.toFixed(1), volumetricWeight: null,
    billableWeight: estimatePayload.parcel.actualWeight.toFixed(1), isVolumetricApplied: false,
    baseRate: 0, bookDiscount: 0, weightSurcharge: 0, speedFee: 0, handlingFee: 0,
    codFee: 0, totalDeliveryFee: 0, codAmount: estimatePayload.codAmount, netPayableToMerchant: 0, codPercentage: selectedZoneTariff?.codPercentage ?? 0, currencySymbol,
  };
  const pricingPending = hasEstimateInputs && !estimate;
  const formatNetPayout = (amount) => amount < 0
    ? `-${currencySymbol}${Math.abs(amount).toFixed(2)}`
    : `${currencySymbol}${Number(amount).toFixed(2)}`;

  // --- Step Validation Helpers ---
  const validateStep = (stepNumber) => {
    if (pricingConfigStatus === 'loading') return 'Loading current delivery prices. Please wait a moment.';
    if (pricingConfigStatus === 'error') return pricingConfigError || 'Delivery prices could not be loaded. Please refresh the page.';
    if (stepNumber === 1) {
      if (!form.senderName.trim()) return 'Enter your name.';
      if (!form.senderPhone.trim() || !/^01[3-9]\d{8}$/.test(form.senderPhone.trim())) {
        return 'Enter a valid 11-digit Bangladesh phone number starting with 01.';
      }
      if (!form.pickupAddress.trim()) return 'Enter the pickup street address.';
      if (!form.pickupDistrict.trim()) return 'Choose a pickup district.';
    }
    if (stepNumber === 2) {
      if (!form.recipientName.trim()) return 'Enter the receiver’s name.';
      if (!form.recipientPhone.trim() || !/^01[3-9]\d{8}$/.test(form.recipientPhone.trim())) {
        return 'Enter a valid 11-digit receiver phone number starting with 01.';
      }
      if (!form.deliveryAddress.trim()) return 'Enter the delivery street address.';
      if (!form.deliveryDistrict.trim()) return 'Choose a delivery district.';
    }
    if (stepNumber === 3) {
      if (!categories.length) return 'No parcel categories are currently available. Please contact support.';
      if (!categories.some((category) => category.id === form.category)) return 'Choose an available parcel category.';
      if (!form.description.trim()) return 'Describe what is inside the parcel.';
      const w = parseFloat(form.weightKG);
      if (isNaN(w) || w <= 0 || w > 100) return 'Enter a weight between 0.1 kg and 100 kg.';
    }
    if (stepNumber === 4) {
      if (!zoneTariffs.some((tariff) => tariff.zoneKey === corridor.zone)) return 'Delivery pricing is not configured for this route yet.';
      if (!availableSpeeds.length) return 'No delivery speed is currently available for this route.';
      if (!availableSpeeds.some((speed) => speed.id === form.serviceSpeed)) return 'Choose an available delivery speed.';
      if (form.paymentMethod === 'COD') {
        const cod = parseFloat(form.codAmount);
        if (isNaN(cod) || cod < 0) return 'Enter a valid amount to collect.';
      }
    }
    return null;
  };

  const handleNextStep = () => {
    const errorMsg = validateStep(currentStep);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError('');
    setCurrentStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  const jumpToStep = (stepNumber) => {
    if (stepNumber < currentStep) {
      setError('');
      setCurrentStep(stepNumber);
      return;
    }
    const errorMsg = validateStep(currentStep);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError('');
    setCurrentStep(stepNumber);
  };

  // --- Submit Booking to Backend API ---
  const submitBooking = async (e) => {
    if (e) e.preventDefault();
    if (!auth) {
      setError('You must sign in to create and track your parcel booking.');
      return;
    }
    if (pricingConfigStatus !== 'ready') {
      setError(pricingConfigError || 'Wait for current delivery settings to load before booking.');
      return;
    }
    if (pricingPending) {
      setError(pricingError || 'Wait for the delivery price before booking.');
      return;
    }

    for (let s = 1; s <= 4; s++) {
      const err = validateStep(s);
      if (err) {
        setError(err);
        setCurrentStep(s);
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        pickupDetails: {
          name: form.senderName.trim(),
          phone: form.senderPhone.trim(),
          address: form.pickupAddress.trim(),
        },
        deliveryDetails: {
          name: form.recipientName.trim(),
          phone: form.recipientPhone.trim(),
          address: form.deliveryAddress.trim(),
        },
        pickupAddress: {
          district: form.pickupDistrict.trim(),
          area: form.pickupArea.trim(),
        },
        deliveryAddress: {
          district: form.deliveryDistrict.trim(),
          area: form.deliveryArea.trim(),
        },
        packageDetails: {
          weightKG: Number(form.weightKG),
          description: form.description.trim(),
          category: form.category,
        },
        parcel: {
          actualWeight: Number(form.weightKG),
          category: form.category,
          description: form.description.trim(),
          dimensions: {
            length: Number(form.lengthCM) || 0,
            width: Number(form.widthCM) || 0,
            height: Number(form.heightCM) || 0,
          },
        },
        serviceSpeed: form.serviceSpeed,
        extraServiceIds: form.extraServiceIds,
        openBoxVerification: form.extraServiceIds.includes('OPEN_BOX'),
        fragileSticker: form.extraServiceIds.includes('FRAGILE'),
        codAmount: form.paymentMethod === 'COD' ? Number(form.codAmount) || 0 : 0,
        paymentMethod: form.paymentMethod,
      };

      const { data } = await ordersApi.create(payload);
      setOrder({ ...data.data, currencySymbol });
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'We could not book your parcel. Check your connection and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPickupDistrict = useMemo(() => {
    return BANGLADESH_DISTRICTS.find(
      (item) => item.name.toLowerCase() === form.pickupDistrict.toLowerCase()
    ) || null;
  }, [form.pickupDistrict]);

  const selectedDeliveryDistrict = useMemo(() => {
    return BANGLADESH_DISTRICTS.find(
      (item) => item.name.toLowerCase() === form.deliveryDistrict.toLowerCase()
    ) || null;
  }, [form.deliveryDistrict]);

  const originHub = useMemo(() => {
    return selectedPickupDistrict
      ? selectedPickupDistrict.hub
      : '';
  }, [selectedPickupDistrict]);

  const destHub = useMemo(() => {
    return selectedDeliveryDistrict
      ? selectedDeliveryDistrict.hub
      : '';
  }, [selectedDeliveryDistrict]);

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-28 sm:pb-32 font-sans selection:bg-primary selection:text-on-primary">

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <BookingHeroBanner
          auth={auth}
          codPercentage={selectedZoneTariff?.codPercentage}
          onAutofillProfile={handleAutofillProfile}
          onLoadSample={handleLoadSample}
          onReset={handleResetForm}
        />

        {/* 3. Conditional View: Non-Auth Banner, Booking Confirmation, or Form Workflow */}
        {!auth ? (
          <SignInRequiredBanner />
        ) : order ? (
          <BookingSuccess order={order} onBookAnother={handleResetForm} />
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* 4. Luxury Step Progression Bar */}
            <BookingStepBar
              currentStep={currentStep}
              jumpToStep={jumpToStep}
            />

            {/* Error Notification Banner */}
            {error && (
              <StepErrorBanner
                error={error}
              />
            )}
            {pricingConfigStatus === 'loading' && <p aria-live="polite" className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">Loading current parcel categories, services, and delivery rates…</p>}
            {pricingConfigStatus === 'error' && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{pricingConfigError}</p>}
            {pricingConfigStatus === 'ready' && form.pickupDistrict && form.deliveryDistrict && !zoneTariffs.some((tariff) => tariff.zoneKey === corridor.zone) && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Delivery rates are not set for this route yet. Please choose another route or contact support.</p>}
            {pricingPending && (
              <p aria-live="polite" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {pricingError || 'Calculating your delivery price…'} You can book when the price is ready.
              </p>
            )}

            {/* 5. Main Booking Grid: Dynamic Form + Sticky Summary Side Panel */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Multi-Step Interactive Form */}
              <div className="space-y-6 lg:col-span-7">
                {/* STEP 1: Sender & Origin Hub */}
                {currentStep === 1 && (
                  <StepPickupPanel
                    auth={auth}
                    form={form}
                    categories={categories}
                    handleAutofillProfile={handleAutofillProfile}
                    handleNextStep={handleNextStep}
                    originHub={originHub}
                    selectedPickupDistrict={selectedPickupDistrict}
                    setForm={setForm}
                    update={update}
                  />
                )}

                {/* STEP 2: Consignee & Destination */}
                {currentStep === 2 && (
                  <StepRecipientPanel
                    corridor={corridor}
                    form={form}
                    handleNextStep={handleNextStep}
                    handlePrevStep={handlePrevStep}
                    handleSwapAddresses={handleSwapAddresses}
                    selectedDeliveryDistrict={selectedDeliveryDistrict}
                    setForm={setForm}
                    update={update}
                  />
                )}

                {/* STEP 3: Parcel Specs & Volumetric Calculator */}
                {currentStep === 3 && (
                  <StepParcelPanel
                    form={form}
                    categories={categories}
                    handleNextStep={handleNextStep}
                    handlePrevStep={handlePrevStep}
                    pricing={pricing}
                    setForm={setForm}
                    setShowVolumetric={setShowVolumetric}
                    showVolumetric={showVolumetric}
                    update={update}
                  />
                )}

                {/* STEP 4: Speed, Payment & Digital Waybill Review */}
                {currentStep === 4 && (
                  <StepPaymentPanel
                    corridor={corridor}
                    availableSpeeds={availableSpeeds}
                    extraServices={extraServices}
                    form={form}
                    handlePrevStep={handlePrevStep}
                    pricing={pricing}
                    setForm={setForm}
                    setShowWaybillModal={setShowWaybillModal}
                    submitBooking={submitBooking}
                    submitting={submitting}
                    update={update}
                    formatNetPayout={formatNetPayout}
                  />
                )}
              </div>

              {/* Right Column: Lucrative Air Waybill & Live Tariff Rail */}
              <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-5">
                {/* 1. Parcel slip Card (Lucrative Look) */}
                <BookingWaybillCard
                  corridor={corridor}
                  currentStep={currentStep}
                  form={form}
                  originHub={originHub}
                  destHub={destHub}
                  handleLoadSample={handleLoadSample}
                  handleNextStep={handleNextStep}
                  handleResetForm={handleResetForm}
                  pricing={pricing}
                  submitBooking={submitBooking}
                  submitting={submitting}
                  formatNetPayout={formatNetPayout}
                />
              </aside>
            </div>
          </div>
        )}
      </div>

      {/* 6. Sticky Floating Mobile Action Bar */}
      {auth && !order && (
        <BookingMobileActionBar
          currentStep={currentStep}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          pricing={pricing}
          submitBooking={submitBooking}
          submitting={submitting}
        />
      )}

      {/* 7. Modal: Digital Air Waybill / Consignment Slip Preview */}
      {showWaybillModal && (
        <BookingWaybillModal
          corridor={corridor}
          form={form}
          pricing={pricing}
          setShowWaybillModal={setShowWaybillModal}
        />
      )}
    </main>
  );
}

// --- Theme-Maintained Hero Header Banner ---
function BookingHeroBanner({ auth, codPercentage, onAutofillProfile, onLoadSample, onReset }) {
  return (
    <header className="relative mb-5 overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-surface-container-lowest via-surface-container-lowest to-primary-fixed/25 p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-9 lg:p-11">
      <div className="pointer-events-none absolute -right-8 -top-12 hidden h-64 w-64 rounded-full border-24 border-primary/5 sm:block" />
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-secondary-fixed/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 -bottom-24 h-72 w-72 rounded-full bg-primary-fixed/25 blur-3xl" />

      <div className="relative grid gap-4 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-10">
        <div className="max-w-2xl">
          <div className="hidden flex-wrap items-center gap-2 sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-on-primary-fixed shadow-xs sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-wider">
              <Truck className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
              <span className="sm:hidden">PARCEL DELIVERY</span>
              <span className="hidden sm:inline">BANGLADESH PARCEL DELIVERY</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-on-secondary-fixed sm:px-3 sm:text-[10px] sm:tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-ping" />
              Delivery in 24–48 hours
            </span>
          </div>
          <h1 className="mt-3 font-syne text-2xl font-extrabold leading-tight tracking-tight text-on-surface sm:mt-4 sm:text-4xl lg:text-5xl">
            <span className="sm:hidden">Send a <span className="text-primary">parcel</span>.</span>
            <span className="hidden sm:inline">Send a parcel with ease.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm font-normal leading-relaxed text-on-surface-variant sm:mt-3.5 sm:text-base">
            <span className="sm:hidden">Doorstep pickup in 4 steps.</span>
            <span className="hidden sm:inline">Book a pickup anywhere in Bangladesh in four simple steps. See your delivery price, choose how fast it arrives, and track your parcel.</span>
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
            {/* <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 font-syne text-xs font-bold text-on-primary shadow-md transition hover:bg-primary-container hover:shadow-lg active:scale-95 cursor-pointer sm:px-4"
            >
              <Sparkles className="h-4 w-4" />
              <span className="sm:hidden">Try a demo</span><span className="hidden sm:inline">Sample parcel</span>
            </button> */}
            {auth && (
              <button
                type="button"
                onClick={onAutofillProfile}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-4 py-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition cursor-pointer shadow-xs"
              >
                <User className="h-4 w-4 text-primary" />
                Use saved address
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Right Column Highlights Matching Theme */}
        <div className="hidden flex-col gap-3 sm:flex">
          <div className="rounded-xl border border-primary/20 bg-surface-container-lowest p-3 shadow-sm sm:rounded-2xl sm:p-4.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <BadgeCheck className="h-5 w-5" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-primary sm:text-[11px] sm:tracking-wider">Clear prices</span>
              </div>
              <span className="hidden rounded bg-secondary-fixed px-2 py-0.5 font-mono text-xs font-bold text-on-secondary-fixed shadow-xs sm:inline">
                {codPercentage == null ? 'Cash collection fee' : `${codPercentage}% cash collection fee`}
              </span>
            </div>
            <p className="mt-1.5 text-xs font-bold leading-snug text-on-surface sm:mt-2 sm:text-sm">Cash sent to you within 24 hours</p>
            <p className="mt-1 hidden text-xs leading-relaxed text-on-surface-variant sm:block">
              See your delivery price before booking. Cash collected from the receiver is sent to you within 24 hours.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/80 p-3 shadow-sm sm:rounded-2xl sm:p-4">
            <div className="flex items-center justify-between text-xs text-primary font-bold">
                <span className="flex items-center gap-1.5 text-[10px] leading-tight sm:text-xs">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary sm:h-4.5 sm:w-4.5" /> Verified and secure
              </span>
              <span className="hidden rounded bg-surface-container px-2 py-0.5 font-mono text-[10px] text-on-surface-variant sm:inline">Secure checkout</span>
            </div>
            <p className="mt-1 hidden text-xs leading-relaxed text-on-surface-variant sm:mt-1.5 sm:block">
              Each parcel gets a tracking number. We send text updates as it moves, and you can see the rider’s location.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function SignInRequiredBanner() {
  return (
<div className="mb-8 overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="font-syne text-2xl sm:text-3xl font-bold text-slate-900">
                  Sign in to book your parcel
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  Sign in to book pickups, track your parcels, and receive money collected from parcel deliveries.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/login"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-6 py-3 font-syne text-sm font-bold text-white shadow-md hover:from-[#73400a] hover:to-primary transition"
                  >
                    Sign in <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/registration"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-stone-100 transition"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-[#f9f6f0] p-5 lg:col-span-4 shadow-sm">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Your account includes</h3>
                <ul className="mt-3 space-y-2.5 text-xs text-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Money collected is sent within 24 hours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Live parcel and rider tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Printable parcel slips and barcodes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Save addresses for future bookings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
  );
}

function BookingStepBar({ currentStep, jumpToStep }) {
  const stepTabsRef = useRef(null);
  const scrollSteps = (direction) => stepTabsRef.current?.scrollBy({ left: direction * 170, behavior: 'smooth' });

  return (
<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-md sm:p-5">
              <div className="flex items-center justify-between pb-3 sm:px-2">
                <div>
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    Booking steps
                  </span>
                  <p className="font-syne text-sm sm:text-base font-bold text-slate-900">
                    Step {currentStep} of 4: {STEPS[currentStep - 1].title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600">
                    {Math.round((currentStep / 4) * 100)}% done
                  </span>
                  <div className="h-2 w-24 sm:w-32 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary to-[#d5a568] transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Step Navigation Tabs */}
              <div className="flex min-w-0 items-center gap-1.5">
                <button type="button" aria-label="Scroll steps left" title="Scroll left" onClick={() => scrollSteps(-1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-slate-700 transition hover:border-primary hover:bg-amber-50 sm:h-9 sm:w-9">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div ref={stepTabsRef} role="tablist" aria-label="Booking steps" className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-1">
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  const isCurrent = currentStep === s.id;
                  const isCompleted = currentStep > s.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      onClick={() => jumpToStep(s.id)}
                      className={`group flex w-max flex-none snap-start items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-primary bg-amber-50/80 shadow-md ring-2 ring-primary/20'
                          : isCompleted
                          ? 'border-stone-200 bg-stone-50 hover:border-primary/40'
                          : 'border-stone-200/70 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-colors ${
                          isCurrent
                            ? 'bg-primary text-white shadow-sm'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <div>
                        <span className="block whitespace-nowrap text-xs font-bold text-slate-900 sm:text-sm">
                          {s.title}
                        </span>
                        <span className="hidden whitespace-nowrap font-mono text-[10px] text-slate-500 sm:block">
                          {s.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
                </div>
                <button type="button" aria-label="Scroll steps right" title="Scroll right" onClick={() => scrollSteps(1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-slate-700 transition hover:border-primary hover:bg-amber-50 sm:h-9 sm:w-9">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
  );
}

function StepErrorBanner({ error }) {
  return (
<div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-900 shadow-sm"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold text-rose-950">Please review this step:</p>
                  <p className="mt-0.5 text-rose-800">{error}</p>
                </div>
              </div>
  );
}

function StepPickupPanel({ auth, form, handleAutofillProfile, handleNextStep, originHub, selectedPickupDistrict, setForm, update }) {
  return (
<section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-primary">
                          <MapPin className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                            Step 01 / 04
                          </span>
                          <h2 className="font-syne text-lg sm:text-xl font-bold text-slate-900">
                            Pickup details
                          </h2>
                        </div>
                      </div>
                      {auth && (
                        <button
                          type="button"
                          onClick={handleAutofillProfile}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-primary hover:bg-amber-100 transition"
                        >
                          <User className="h-3.5 w-3.5" />
                          Use my saved details
                        </button>
                      )}
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          label="Your full name"
                          name="senderName"
                          value={form.senderName}
                          onChange={update}
                          placeholder="e.g. Tanvir Hasan"
                          required
                          icon={User}
                        />
                        <Field
                          label="Your phone number"
                          name="senderPhone"
                          value={form.senderPhone}
                          onChange={update}
                          placeholder="01XXXXXXXXX"
                          required
                          type="tel"
                          pattern="01[3-9][0-9]{8}"
                          icon={Phone}
                          hint="Enter your 11-digit Bangladesh phone number."
                        />
                      </div>

                      <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-sm sm:p-5">
                        <label htmlFor="pickupDistrictSelect" className="block text-sm font-bold text-on-surface">
                          Pickup district <span className="text-primary">*</span>
                        </label>
                        <p className="mt-1 text-xs text-on-surface-variant">Choose where the parcel will be picked up.</p>
                        <div className="relative mt-3">
                          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary">
                            <Building aria-hidden="true" className="h-5 w-5" />
                          </span>
                          <select
                            id="pickupDistrictSelect"
                            name="pickupDistrict"
                            value={form.pickupDistrict}
                            onChange={update}
                            className="w-full appearance-none rounded-xl border border-outline-variant/60 bg-white py-3.5 pl-11 pr-10 text-sm font-semibold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="" disabled>Choose a pickup district</option>
                            {BANGLADESH_DISTRICTS.map((district) => (
                              <option key={district.name} value={district.name}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                          <ChevronRight aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-primary" />
                        </div>
                        {selectedPickupDistrict && (
                          <p className="mt-2 text-xs text-on-surface-variant">
                            Pickup center: <span className="font-semibold text-on-surface">{selectedPickupDistrict.hub}</span>
                          </p>
                        )}
                      </div>

                      {/* Area / Thana */}
                      <div>
                        <Field
                          label="Pickup area or neighborhood"
                          name="pickupArea"
                          value={form.pickupArea}
                          onChange={update}
                          placeholder="e.g. Dhanmondi, Gulshan, Banani"
                          icon={Building}
                        />
                        {/* Area suggestions based on chosen district */}
                        {(() => {
                          const distObj = BANGLADESH_DISTRICTS.find(
                            (d) => d.name.toLowerCase() === form.pickupDistrict.toLowerCase()
                          );
                          if (!distObj?.popularAreas) return null;
                          return (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] text-slate-500 font-medium">Popular areas:</span>
                              {distObj.popularAreas.slice(0, 6).map((area) => (
                                <button
                                  key={area}
                                  type="button"
                                  onClick={() => setForm((c) => ({ ...c, pickupArea: area }))}
                                  className={`rounded-lg px-2.5 py-0.5 text-[11px] font-semibold transition cursor-pointer ${
                                    form.pickupArea.toLowerCase() === area.toLowerCase()
                                      ? 'bg-amber-100 text-primary border border-amber-300'
                                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                                  }`}
                                >
                                  {area}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      <Field
                          label="Pickup address"
                        name="pickupAddress"
                        value={form.pickupAddress}
                        onChange={update}
                        placeholder="House or flat, road, area, and a nearby landmark"
                        required
                        icon={MapPin}
                      />

                        {/* Preferred pickup time */}
                      <div>
                        <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800">
                          Preferred pickup time
                        </label>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          {[
                            { value: 'MORNING', title: 'Morning', time: '9:00 AM – 1:00 PM' },
                            { value: 'AFTERNOON', title: 'Afternoon', time: '2:00 PM – 6:00 PM' },
                            { value: 'ANYTIME', title: 'Any time', time: 'First available pickup' },
                          ].map((slot) => (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => setForm((c) => ({ ...c, pickupWindow: slot.value }))}
                              className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition cursor-pointer ${
                                form.pickupWindow === slot.value
                                  ? 'border-primary bg-amber-50/90 ring-2 ring-primary/20 shadow-xs'
                                  : 'border-stone-200 bg-white hover:border-primary/40'
                              }`}
                            >
                              <span className="text-xs font-bold text-slate-900">{slot.title}</span>
                              <span className="mt-0.5 text-[11px] text-slate-600 font-medium">{slot.time}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pickup center information */}
                      {selectedPickupDistrict && <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm border border-stone-200">
                            <Truck className="h-5 w-5" />
                          </span>
                          <div className="text-xs">
                            <span className="font-bold text-slate-900">Pickup center:</span>
                            <p className="text-slate-600 font-medium">{originHub}</p>
                          </div>
                        </div>
                      </div>}

                      {/* Bottom Nav Action */}
                      <div className="pt-4 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-7 py-3 font-syne text-sm font-bold text-white shadow-lg hover:from-[#73400a] hover:to-primary transition hover:scale-102 active:scale-98"
                        >
                          Next: Delivery details <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </section>
  );
}

function StepRecipientPanel({ corridor, form, handleNextStep, handlePrevStep, handleSwapAddresses, selectedDeliveryDistrict, setForm, update }) {
  return (
<section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-primary">
                          <PackageCheck className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                            Step 02 / 04
                          </span>
                          <h2 className="font-syne text-lg sm:text-xl font-bold text-slate-900">
                            Delivery details
                          </h2>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSwapAddresses}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-stone-100 transition shadow-xs"
                        title="Swap pickup and delivery details"
                      >
                        <ArrowDownUp className="h-3.5 w-3.5 text-primary" />
                        Swap addresses
                      </button>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          label="Receiver's name"
                          name="recipientName"
                          value={form.recipientName}
                          onChange={update}
                          placeholder="e.g. Farhana Yasmin"
                          required
                          icon={User}
                        />
                        <Field
                          label="Receiver's phone number"
                          name="recipientPhone"
                          value={form.recipientPhone}
                          onChange={update}
                          placeholder="01XXXXXXXXX"
                          required
                          type="tel"
                          pattern="01[3-9][0-9]{8}"
                          icon={Phone}
                          hint="We’ll text them a delivery code and parcel updates."
                        />
                        <Field
                          className="sm:col-span-2"
                          label="Backup phone number (optional)"
                          name="recipientAltPhone"
                          value={form.recipientAltPhone}
                          onChange={update}
                          placeholder="01XXXXXXXXX (in case primary is unreachable)"
                          type="tel"
                        />
                      </div>

                      <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-sm sm:p-5">
                        <label htmlFor="deliveryDistrictSelect" className="block text-sm font-bold text-on-surface">
                          Delivery district <span className="text-primary">*</span>
                        </label>
                        <p className="mt-1 text-xs text-on-surface-variant">Choose where the parcel will be delivered.</p>
                        <div className="relative mt-3">
                          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary">
                            <Building aria-hidden="true" className="h-5 w-5" />
                          </span>
                          <select
                            id="deliveryDistrictSelect"
                            name="deliveryDistrict"
                            value={form.deliveryDistrict}
                            onChange={update}
                            className="w-full appearance-none rounded-xl border border-outline-variant/60 bg-white py-3.5 pl-11 pr-10 text-sm font-semibold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="" disabled>Choose a delivery district</option>
                            {BANGLADESH_DISTRICTS.map((district) => (
                              <option key={district.name} value={district.name}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                          <ChevronRight aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-primary" />
                        </div>
                        {selectedDeliveryDistrict && (
                          <p className="mt-2 text-xs text-on-surface-variant">
                            Delivery center: <span className="font-semibold text-on-surface">{selectedDeliveryDistrict.hub}</span>
                          </p>
                        )}
                      </div>

                      {/* Destination Area */}
                      <div>
                        <Field
                          label="Delivery area or neighborhood"
                          name="deliveryArea"
                          value={form.deliveryArea}
                          onChange={update}
                          placeholder="e.g. Agrabad, GEC Circle, Panchlaish"
                          icon={Building}
                        />
                        {(() => {
                          const distObj = BANGLADESH_DISTRICTS.find(
                            (d) => d.name.toLowerCase() === form.deliveryDistrict.toLowerCase()
                          );
                          if (!distObj?.popularAreas) return null;
                          return (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] text-slate-500 font-medium">Popular areas:</span>
                              {distObj.popularAreas.slice(0, 6).map((area) => (
                                <button
                                  key={area}
                                  type="button"
                                  onClick={() => setForm((c) => ({ ...c, deliveryArea: area }))}
                                  className={`rounded-lg px-2.5 py-0.5 text-[11px] font-semibold transition cursor-pointer ${
                                    form.deliveryArea.toLowerCase() === area.toLowerCase()
                                      ? 'bg-amber-100 text-primary border border-amber-300'
                                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                                  }`}
                                >
                                  {area}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      <Field
                        label="Delivery address"
                        name="deliveryAddress"
                        value={form.deliveryAddress}
                        onChange={update}
                        placeholder="House or flat, road, area, and a nearby landmark"
                        required
                        icon={MapPin}
                      />

                      <Field
                        label="Delivery instructions (optional)"
                        name="deliveryNotes"
                        value={form.deliveryNotes}
                        onChange={update}
                        placeholder="e.g. Call before delivery or leave with reception"
                      />

                      {/* Delivery route and time estimate */}
                      {form.pickupDistrict && form.deliveryDistrict && <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4.5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                              <Truck className="h-5 w-5" />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-extrabold text-primary">
                                  {form.pickupDistrict} ➔ {form.deliveryDistrict}
                                </span>
                                <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">Delivery route</span>
                              </div>
                              <p className="mt-0.5 text-xs text-slate-600 font-medium">
                                About {corridor.distance} away
                              </p>
                            </div>
                          </div>
                          <div className="rounded-xl bg-white px-3.5 py-2 text-right shadow-sm border border-stone-200">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Expected delivery
                            </span>
                            <span className="font-mono text-xs font-bold text-emerald-800">
                              {corridor.sla}
                            </span>
                          </div>
                        </div>
                      </div>}

                      {/* Bottom Nav Action */}
                      <div className="pt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-stone-50 transition"
                        >
                          <ArrowLeft className="h-4 w-4" /> Back to pickup
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-7 py-3 font-syne text-sm font-bold text-white shadow-lg hover:from-[#73400a] hover:to-primary transition hover:scale-102 active:scale-98"
                        >
                          Next: Parcel details <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </section>
  );
}

function StepParcelPanel({ form, categories, handleNextStep, handlePrevStep, pricing, setForm, setShowVolumetric, showVolumetric, update }) {
  return (
<section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-primary">
                          <Package className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                            Step 03 / 04
                          </span>
                          <h2 className="font-syne text-lg sm:text-xl font-bold text-slate-900">
                            Parcel details
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-8 space-y-5 sm:space-y-6">
                      {/* Visual Category Selection Cards */}
                      <div>
                        <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-800 sm:mb-2.5 sm:text-[11px]">
                          What are you sending? <span className="text-primary">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                          {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = form.category === cat.id;

                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setForm((c) => ({ ...c, category: cat.id }))}
                                className={`flex min-h-16 flex-row items-center gap-2 rounded-xl border p-2.5 text-left transition-all cursor-pointer sm:min-h-0 sm:flex-col sm:items-start sm:gap-0 sm:rounded-2xl sm:p-4 ${
                                  isSelected
                                    ? 'border-primary bg-amber-50/90 shadow-md ring-2 ring-primary/20'
                                    : 'border-stone-200 bg-white hover:border-primary/40'
                                }`}
                              >
                                <div className="flex w-auto shrink-0 items-center justify-between sm:w-full sm:shrink">
                                  <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${
                                      isSelected ? 'bg-primary text-white shadow-xs' : 'bg-stone-100 text-slate-700'
                                    }`}
                                  >
                                    <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                                  </span>
                                  <span
                                    className={`hidden font-mono text-[10px] font-extrabold px-2 py-0.5 rounded sm:inline-flex ${
                                      cat.id === 'Book'
                                        ? 'bg-amber-200 text-amber-950 border border-amber-300'
                                        : 'bg-stone-100 text-slate-700'
                                    }`}
                                  >
                                    {cat.badge}
                                  </span>
                                </div>
                                <span className="min-w-0 text-[10px] font-bold leading-tight text-slate-900 sm:mt-3 sm:block sm:text-sm">{cat.label}</span>
                                <span className="mt-1 hidden text-[11px] leading-relaxed text-slate-600 line-clamp-2 sm:block">
                                  {cat.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Content Description */}
                      <div>
                        <Field
                          label="Describe your parcel"
                          name="description"
                          value={form.description}
                          onChange={update}
                          placeholder="e.g. Two shirts and a pair of shoes"
                          required
                          icon={FileText}
                        />
                      </div>

                      {/* Actual Weight Selector */}
                      <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                              Parcel weight (kg)
                            </span>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Enter the parcel's weight. The price updates automatically.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const curr = parseFloat(form.weightKG) || 1.0;
                                setForm((c) => ({ ...c, weightKG: Math.max(0.1, curr - 0.5).toFixed(1) }));
                              }}
                              className="h-11 w-11 rounded-xl border border-stone-300 bg-white font-mono text-lg font-bold text-slate-900 shadow-xs hover:bg-stone-100 transition cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              name="weightKG"
                              step="0.1"
                              min="0.1"
                              max="100"
                              value={form.weightKG}
                              onChange={update}
                              className="h-11 w-24 rounded-xl border border-stone-300 bg-white text-center font-mono text-base font-extrabold text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const curr = parseFloat(form.weightKG) || 1.0;
                                setForm((c) => ({ ...c, weightKG: Math.min(100, curr + 0.5).toFixed(1) }));
                              }}
                              className="h-11 w-11 rounded-xl border border-stone-300 bg-white font-mono text-lg font-bold text-slate-900 shadow-xs hover:bg-stone-100 transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Volumetric Weight Calculator (Collapsible) */}
                      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => setShowVolumetric(!showVolumetric)}
                          aria-label={showVolumetric ? 'Close box dimensions' : 'Open box dimensions'}
                          aria-expanded={showVolumetric}
                          className="flex w-full items-center justify-between p-4.5 text-left transition hover:bg-stone-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-primary">
                              <Box className="h-5 w-5" />
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-900 sm:text-sm">Box dimensions</span>
                              <p className="text-[11px] text-slate-600">For bulky parcels (L × W × H)</p>
                            </div>
                          </div>
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 font-mono text-lg font-bold leading-none text-primary">
                            {showVolumetric ? '−' : '+'}
                          </span>
                        </button>
                        {showVolumetric && (
                          <div className="border-t border-stone-200 bg-[#fbf9f5] p-5 space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                              <Field label="Length (cm)" name="lengthCM" type="number" min="1" placeholder="e.g. 30" value={form.lengthCM} onChange={update} />
                              <Field label="Width (cm)" name="widthCM" type="number" min="1" placeholder="e.g. 20" value={form.widthCM} onChange={update} />
                              <Field label="Height (cm)" name="heightCM" type="number" min="1" placeholder="e.g. 15" value={form.heightCM} onChange={update} />
                            </div>
                            {pricing.volumetricWeight && (
                              <div className="flex flex-col gap-2 rounded-xl bg-white border border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between text-xs shadow-xs">
                                <div>
                              <span className="font-mono font-bold text-slate-900">Size-based weight: {pricing.volumetricWeight} kg</span>
                                  <p className="text-slate-600 text-[11px]">We use parcel size to calculate its shipping weight.</p>
                                </div>
                                <div className="rounded-lg bg-amber-100 border border-amber-300 px-3 py-1 font-mono text-xs font-extrabold text-primary">
                                  Weight used for pricing: {pricing.billableWeight} kg
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Nav Action */}
                      <div className="pt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-stone-50 transition"
                        >
                          <ArrowLeft className="h-4 w-4" /> Back to Destination
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-7 py-3 font-syne text-sm font-bold text-white shadow-lg hover:from-[#73400a] hover:to-primary transition hover:scale-102 active:scale-98"
                        >
                          Next: Speed &amp; Payment <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </section>
  );
}

function StepPaymentPanel({ corridor, availableSpeeds, extraServices, form, handlePrevStep, pricing, setForm, setShowWaybillModal, submitBooking, submitting, update, formatNetPayout }) {
  return (
<section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-primary">
                          <Truck className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                            Step 04 / 04
                          </span>
                          <h2 className="font-syne text-lg sm:text-xl font-bold text-slate-900">
                            Delivery and payment
                          </h2>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowWaybillModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-primary hover:bg-amber-100 transition shadow-xs"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Preview parcel slip
                      </button>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      {/* Service Speed Tier Selection */}
                      <div>
                        <label className="mb-2.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800">
                          Choose a delivery speed
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {availableSpeeds.length ? availableSpeeds.map((speed) => {
                            const isSelected = form.serviceSpeed === speed.id;
                            const badge = speed.priceMode === 'BASE' ? 'Lowest price' : speed.priceMode === 'FLAT_FEE' ? `+${pricing.currencySymbol}${speed.flatFee}` : `${pricing.currencySymbol}${speed.zonePrices?.[corridor.zone]}`;

                            return (
                              <button
                                key={speed.id}
                                type="button"
                                onClick={() => setForm((c) => ({ ...c, serviceSpeed: speed.id }))}
                                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'border-primary bg-amber-50/90 ring-2 ring-primary/20 shadow-md'
                                    : 'border-stone-200 bg-white hover:border-primary/40'
                                }`}
                              >
                                <span className="font-mono text-[10px] font-extrabold text-primary bg-amber-100 px-2 py-0.5 rounded">
                                  {badge}
                                </span>
                                <span className="mt-2.5 text-sm font-bold text-slate-900">{speed.name}</span>
                                <span className="mt-0.5 text-xs text-emerald-800 font-extrabold">{speed.eta || corridor.sla}</span>
                                <span className="mt-1 text-[11px] text-slate-600 font-medium">{speed.description}</span>
                              </button>
                            );
                          }) : <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 sm:col-span-3">No delivery service is available for this route right now.</p>}
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div>
                        <label className="mb-2.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800">
                          How will they pay?
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            {
                              id: 'COD',
                              label: 'Cash on delivery',
                              desc: 'They pay when the parcel arrives. We send you the money within 24 hours.',
                            },
                            {
                              id: 'CARD',
                              label: 'Online payment',
                              desc: 'Pay online by mobile wallet or bank card.',
                            },
                          ].map((method) => {
                            const isSelected = form.paymentMethod === method.id;

                            return (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => setForm((c) => ({ ...c, paymentMethod: method.id }))}
                                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'border-primary bg-amber-50/90 ring-2 ring-primary/20 shadow-md'
                                    : 'border-stone-200 bg-white hover:border-primary/40'
                                }`}
                              >
                                <span className="text-xs sm:text-sm font-bold text-slate-900">{method.label}</span>
                                <span className="mt-1 text-[11px] text-slate-600 leading-relaxed font-medium">
                                  {method.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* COD Cash to Collect Input */}
{form?.paymentMethod === 'COD' && (
                          <div className="mt-4 rounded-2xl border border-amber-300 bg-[#fdf9f2] p-5 space-y-4 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                                  Amount to collect from receiver ({pricing.currencySymbol})
                                </label>
                                <p className="text-xs text-slate-600 font-medium">
                                  The rider will collect this amount when the parcel is delivered.
                                </p>
                              </div>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-base font-extrabold text-slate-500">
                                  {pricing.currencySymbol}
                                </span>
                                <input
                                  type="number"
                                  name="codAmount"
                                  min="0"
                                  step="1"
                                  value={form.codAmount}
                                  onChange={update}
                                  className="h-11 w-44 rounded-xl border border-stone-300 bg-white pl-9 pr-3 text-right font-mono text-base font-extrabold text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            {/* Settlement Ledger Card */}
                            <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-3 text-xs">
                              <div className="rounded-xl bg-white p-3 border border-stone-200 shadow-xs">
                                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Amount collected</span>
                                <p className="mt-0.5 font-mono text-base font-extrabold text-slate-900">{pricing.currencySymbol}{pricing.codAmount}</p>
                              </div>
                              <div className="rounded-xl bg-white p-3 border border-stone-200 shadow-xs">
                                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Delivery fee</span>
                                <p className="mt-0.5 font-mono text-base font-extrabold text-rose-700">-{pricing.currencySymbol}{pricing.totalDeliveryFee}</p>
                              </div>
                              <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-3 shadow-xs">
                                <span className="text-[10px] text-emerald-800 uppercase font-mono font-extrabold">
                                  You receive
                                </span>
                                <p className="mt-0.5 font-mono text-base font-extrabold text-emerald-900">
                                  {formatNetPayout(pricing.netPayableToMerchant)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Value-Added Special Services */}
                      <div>
                        <label className="mb-2.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800">
                          Extra services
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {extraServices.filter((service) => service.enabled).length ? extraServices.filter((service) => service.enabled).map((service) => {
                            const checked = form.extraServiceIds.includes(service.id);
                            return <label key={service.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3.5 text-xs shadow-xs transition hover:bg-stone-50 ${checked ? 'border-primary ring-1 ring-primary/20' : 'border-stone-200'}`}>
                              <input type="checkbox" checked={checked} onChange={(event) => setForm((current) => ({ ...current, extraServiceIds: event.target.checked ? [...new Set([...current.extraServiceIds, service.id])] : current.extraServiceIds.filter((id) => id !== service.id) }))} className="h-4 w-4 rounded text-primary focus:ring-primary" />
                              <div><span className="font-bold text-slate-900">{service.name} ({service.free || Number(service.fee) === 0 ? 'Free' : `+${pricing.currencySymbol}${service.fee}`})</span><p className="text-[11px] font-medium text-slate-600">{service.description}</p></div>
                            </label>;
                          }) : <p className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-slate-600 sm:col-span-3">No extra services are currently offered.</p>}
                        </div>
                      </div>

                      {/* Manifest Waybill Quick Preview Card */}
                      <div className="rounded-2xl border border-stone-200 bg-[#f9f7f2] p-5 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                              Booking summary
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-emerald-900 font-extrabold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            Route selected
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-3.5 sm:grid-cols-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Pickup:</span>
                            <p className="font-bold text-slate-900 text-sm mt-0.5">{form.senderName || '—'}</p>
                            <p className="text-slate-700 font-medium">{form.senderPhone} | {form.pickupDistrict}</p>
                            <p className="text-[11px] text-slate-500 truncate">{form.pickupAddress}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Delivery:</span>
                            <p className="font-bold text-slate-900 text-sm mt-0.5">{form.recipientName || '—'}</p>
                            <p className="text-slate-700 font-medium">{form.recipientPhone} | {form.deliveryDistrict}</p>
                            <p className="text-[11px] text-slate-500 truncate">{form.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Submit Action */}
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-stone-50 transition"
                        >
                          <ArrowLeft className="h-4 w-4" /> Back to Specs
                        </button>
                        <button
                          type="button"
                          onClick={submitBooking}
                          disabled={submitting}
                          className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-8 py-3.5 font-syne text-sm font-bold text-white shadow-xl hover:from-[#73400a] hover:to-primary transition hover:scale-102 active:scale-98 disabled:cursor-wait disabled:opacity-60"
                        >
                          {submitting ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Booking your parcel…
                            </>
                          ) : (
                            <>
                              Book delivery <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </section>
  );
}

function BookingWaybillCard({ corridor, currentStep, form, originHub, destHub, handleLoadSample, handleNextStep, handleResetForm, pricing, submitBooking, submitting, formatNetPayout }) {
  const pickupDistrict = form?.pickupDistrict || 'Dhaka';
  const deliveryDistrict = form?.deliveryDistrict || 'Chattogram';
  const safeCorridor = corridor || { zone: 'INSIDE_DHAKA', label: 'Local delivery' };
  const safePricing = pricing || {
    baseRate: 0, bookDiscount: 0, weightSurcharge: 0, speedFee: 0, handlingFee: 0,
    codFee: 0, totalDeliveryFee: 0, codAmount: 0, netPayableToMerchant: 0,
    billableWeight: '0', volumetricWeight: null, isVolumetricApplied: false,
    zone: safeCorridor.zone, zoneLabel: safeCorridor.label,
    actualWeight: '0',
  };

  return (
<div className="overflow-hidden rounded-3xl border-2 border-stone-300 bg-white p-5 sm:p-6 shadow-xl relative">
                  {/* Waybill Stamp Badge */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-stone-200 pb-4">
                    <div>
                      <span className="font-syne text-lg font-black tracking-tight text-primary">MADISYNTHIA</span>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Parcel delivery</p>
                    </div>
                    <div className="text-right">
                  <span className="font-mono text-[11px] font-extrabold text-slate-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
Route: {safeCorridor.label}
                      </span>
                    </div>
                  </div>

                  {/* Simulated Code-128 Barcode */}
                  <div className="my-4 flex flex-col items-center justify-center rounded-xl bg-stone-50 border border-stone-200 p-3">
                    <div className="h-10 w-full max-w-60 bg-[repeating-linear-gradient(90deg,#1c1917,#1c1917_2px,transparent_2px,transparent_4px,#1c1917_4px,#1c1917_7px,transparent_7px,transparent_9px)]" />
                    <span className="mt-1 font-mono text-[10px] tracking-[0.25em] font-extrabold text-slate-900">
                      *MS-{pickupDistrict.slice(0, 3).toUpperCase()}-{deliveryDistrict.slice(0, 3).toUpperCase()}-PRIORITY*
                    </span>
                  </div>

                  {(form.pickupDistrict || form.deliveryDistrict) && (
                    <div className="grid grid-cols-[1.5rem_1fr] gap-x-3 border-b border-stone-200 pb-4 text-xs">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        {form.pickupDistrict && <span className="h-3 w-3 rounded-full border-2 border-primary bg-white ring-2 ring-primary/30" />}
                        {form.pickupDistrict && form.deliveryDistrict && <span className="min-h-8 w-px flex-1 border-l-2 border-dashed border-stone-300" />}
                        {form.deliveryDistrict && <span className="h-3 w-3 rounded-sm bg-[#183b31] ring-2 ring-[#183b31]/30" />}
                      </div>
                      <div className="space-y-3">
                        {form.pickupDistrict && (
                          <div>
                          <p className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Pickup</p>
                            <p className="font-bold text-slate-900">{pickupDistrict}</p>
                            <p className="truncate text-[11px] text-slate-500">{originHub}</p>
                          </div>
                        )}
                        {form.deliveryDistrict && (
                          <div>
                          <p className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Delivery</p>
                            <p className="font-bold text-slate-900">{deliveryDistrict}</p>
                            <p className="truncate text-[11px] text-slate-500">{destHub}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tariff & Financial Ledger Breakdown */}
                  <div className="pt-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 font-medium">
                      <span>Starting delivery price</span>
                      <span className="font-mono font-bold text-slate-900">{safePricing.currencySymbol || '৳'}{safePricing.baseRate}</span>
                    </div>

                    {safePricing.bookDiscount > 0 && (
                      <div className="flex items-center justify-between text-amber-800 font-bold">
                        <span>Category discount</span>
                        <span className="font-mono">-{safePricing.currencySymbol || '৳'}{safePricing.bookDiscount}</span>
                      </div>
                    )}

                    {safePricing.weightSurcharge > 0 && (
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span>Extra weight ({safePricing.billableWeight} kg)</span>
                        <span className="font-mono font-bold text-slate-900">+{safePricing.currencySymbol || '৳'}{safePricing.weightSurcharge}</span>
                      </div>
                    )}

                    {safePricing.speedFee > 0 && (
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span>Fast delivery fee</span>
                        <span className="font-mono font-bold text-slate-900">+{safePricing.currencySymbol || '৳'}{safePricing.speedFee}</span>
                      </div>
                    )}

                    {safePricing.handlingFee > 0 && (
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span>Extra service fees</span>
                        <span className="font-mono font-bold text-slate-900">+{safePricing.currencySymbol || '৳'}{safePricing.handlingFee}</span>
                      </div>
                    )}

                    {safePricing.codFee > 0 && (
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span>Cash collection fee ({safePricing.codPercentage ?? 0}%)</span>
                        <span className="font-mono font-bold text-slate-900">+{safePricing.currencySymbol || '৳'}{safePricing.codFee}</span>
                      </div>
                    )}

                    {/* Total Estimated Fee Highlight */}
                    <div className="flex items-center justify-between border-t-2 border-stone-200 pt-3 font-bold text-slate-900">
                      <span className="font-syne text-sm">Total delivery fee</span>
                      <span className="font-mono text-xl font-extrabold text-primary">
{safePricing.currencySymbol || '৳'}{safePricing.totalDeliveryFee}
                      </span>
                    </div>
                  </div>

                  {/* Merchant COD Net Payout Card (if COD) */}
                  {form.paymentMethod === 'COD' && (
                    <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs shadow-xs">
                      <div className="flex items-center justify-between text-emerald-950 font-bold">
                        <span>Cash to collect:</span>
                        <span className="font-mono font-extrabold text-sm">{safePricing.currencySymbol || '৳'}{safePricing.codAmount}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-emerald-800 text-[11px] font-medium">
                        <span>Delivery fee:</span>
                        <span className="font-mono">-{safePricing.currencySymbol || '৳'}{safePricing.totalDeliveryFee}</span>
                      </div>
                      <div className="mt-2.5 border-t border-emerald-300/80 pt-2 flex items-center justify-between font-extrabold text-emerald-950">
                        <span className="text-xs">You receive:</span>
                        <span className={`font-mono text-base ${safePricing.netPayableToMerchant < 0 ? 'text-rose-800' : 'text-emerald-900'}`}>{formatNetPayout(safePricing.netPayableToMerchant)}</span>
                      </div>
                      <p className="mt-1.5 text-[10px] text-emerald-700 font-medium">
                        Money collected is sent to your bank or wallet within 24 hours after delivery.
                      </p>
                    </div>
                  )}

                  {/* Quick Action Button inside Sidebar */}
                  <div className="mt-5 space-y-2">
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-4 py-3 font-syne text-sm font-bold text-white shadow-md hover:from-[#73400a] hover:to-primary transition cursor-pointer"
                      >
                        Continue to step {currentStep + 1} <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitBooking}
                        disabled={submitting}
                        className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-4 py-3 font-syne text-sm font-bold text-white shadow-md hover:from-[#73400a] hover:to-primary transition cursor-pointer disabled:opacity-60"
                      >
                        {submitting ? 'Booking parcel…' : 'Book delivery'}
                      </button>
                    )}

                    <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-700 pt-2">
                      {/* <button
                        type="button"
                        onClick={handleLoadSample}
                        className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Auto-Fill Demo
                      </button> */}
                      <span className="text-stone-300">•</span>
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="text-slate-500 hover:text-slate-900 transition cursor-pointer"
                      >
                        Clear form
                      </button>
                    </div>
                  </div>
                </div>
  );
}

function BookingMobileActionBar({ currentStep, handleNextStep, handlePrevStep, pricing, submitBooking, submitting }) {
  return (
<div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-300 bg-white/95 backdrop-blur-md px-4 py-3 shadow-2xl lg:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase text-slate-500">
                Step {currentStep} of 4 • Delivery fee
              </span>
              <p className="font-mono text-lg font-black text-primary">{pricing.currencySymbol || '৳'}{pricing.totalDeliveryFee}</p>
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-800"
                >
                  Back
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-primary to-primary-container px-4 py-2.5 font-syne text-xs font-bold text-white shadow-sm"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitBooking}
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-primary to-primary-container px-4 py-2.5 font-syne text-xs font-bold text-white shadow-sm disabled:opacity-60"
                >
                  {submitting ? 'Booking…' : 'Book Now'}
                </button>
              )}
            </div>
          </div>
        </div>
  );
}

function BookingWaybillModal({ corridor, form, pricing, setShowWaybillModal }) {
  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-syne text-lg font-bold text-slate-900">Parcel slip preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWaybillModal(false)}
                className="h-8 w-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-slate-600 hover:bg-stone-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 border-2 border-dashed border-stone-300 p-5 rounded-2xl bg-[#fffefc] font-sans text-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="font-syne text-xl font-black tracking-tight text-primary">MADISYNTHIA</span>
                  <p className="font-mono text-[9px] font-bold text-slate-500">Parcel delivery</p>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-xs text-slate-900">PREVIEW</span>
                  <p className="text-[10px] text-slate-500">Route: {corridor.label}</p>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="flex flex-col items-center justify-center py-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                <div className="h-10 w-48 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_8px,transparent_8px,transparent_10px)]" />
                <span className="mt-1 font-mono text-[10px] tracking-[0.2em] font-extrabold text-slate-900">
                  *MS-EXP-{form.pickupDistrict.slice(0, 3).toUpperCase()}-{form.deliveryDistrict.slice(0, 3).toUpperCase()}*
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y py-3.5">
                <div>
                  <span className="font-mono text-[9px] uppercase font-extrabold text-slate-400">SENDER</span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{form.senderName || 'Your name'}</p>
                  <p className="text-slate-700">{form.senderPhone || '01XXXXXXXXX'}</p>
                  <p className="text-slate-500 truncate">{form.pickupAddress || 'Pickup address'}</p>
                  <p className="font-bold text-primary">{form.pickupDistrict}</p>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase font-extrabold text-slate-400">RECIPIENT</span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{form.recipientName || 'Receiver name'}</p>
                  <p className="text-slate-700">{form.recipientPhone || '01XXXXXXXXX'}</p>
                  <p className="text-slate-500 truncate">{form.deliveryAddress || 'Delivery Address'}</p>
                  <p className="font-bold text-primary">{form.deliveryDistrict}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-b pb-3 text-center font-mono">
                <div className="bg-stone-50 border border-stone-200 p-2 rounded">
                  <span className="text-[9px] text-slate-500 block font-bold">SPEED</span>
                  <span className="font-extrabold text-slate-900">{availableSpeeds.find((speed) => speed.id === form.serviceSpeed)?.name || getDeliverySpeedLabel(form.serviceSpeed)}</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 p-2 rounded">
                  <span className="text-[9px] text-slate-500 block font-bold">WEIGHT</span>
                  <span className="font-extrabold text-slate-900">{pricing.billableWeight} KG</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 p-2 rounded">
                  <span className="text-[9px] text-slate-500 block font-bold">PAYMENT METHOD</span>
                  <span className="font-extrabold text-slate-900">{getPaymentMethodLabel(form.paymentMethod)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Cash to collect:</span>
                  <span className="font-mono text-lg font-black text-slate-900">
                    {form.paymentMethod === 'COD' ? `${pricing.currencySymbol || '৳'}${pricing.codAmount}` : 'Already paid'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Delivery fee:</span>
                  <span className="font-mono text-lg font-black text-primary">
                    {pricing.currencySymbol || '৳'}{pricing.totalDeliveryFee}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowWaybillModal(false)}
                className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-stone-50 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-primary to-primary-container px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:from-[#73400a] hover:to-primary transition"
              >
                <Printer className="h-3.5 w-3.5" /> Print parcel slip
              </button>
            </div>
          </div>
        </div>
  );
}

// --- Form Input Field Helper with Explicit High-Contrast Styling ---
// --- Post-Booking Success Confirmation Component ---
function BookingSuccess({ order, onBookAnother }) {
  const trackingId = order.trackingId || order._id;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl">
      {/* Banner */}
      <div className="bg-linear-to-br from-[#0f2821] via-[#183b31] to-[#122e26] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="flex items-center justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-[#f3d8ad] backdrop-blur-sm">
            <Check className="h-7 w-7" />
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] font-bold text-emerald-200">
            BOOKING CONFIRMED
          </span>
        </div>
        <h2 className="mt-1 font-syne text-2xl font-extrabold sm:text-3xl text-white">
          Your parcel is booked!
        </h2>
        <p className="mt-2 text-sm text-emerald-50/90 max-w-xl">
          A rider will pick up your parcel during the time you selected.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Tracking ID Callout */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-primary">
                Tracking number
              </span>
              <p className="mt-1 break-all font-mono text-xl font-black text-slate-900 sm:text-2xl">
                {trackingId}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400 bg-white px-4 py-2.5 text-xs font-bold text-primary shadow-sm hover:bg-amber-100 transition cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy tracking number'}
            </button>
          </div>
        </div>

        {/* Milestone Dispatch Timeline */}
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-xs">
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-3">
            Parcel progress
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-xl bg-white p-3 border border-emerald-300 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block mr-1.5" />
              <span className="font-bold text-slate-900">Booked</span>
              <p className="text-[10px] text-emerald-800 font-mono font-bold mt-0.5">Waiting for pickup</p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-stone-200">
              <span className="h-2 w-2 rounded-full bg-stone-300 inline-block mr-1.5" />
              <span className="font-bold text-slate-600">Picked up</span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Rider is on the way</p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-stone-200">
              <span className="h-2 w-2 rounded-full bg-stone-300 inline-block mr-1.5" />
              <span className="font-bold text-slate-600">On the way</span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Traveling to the delivery district</p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-stone-200">
              <span className="h-2 w-2 rounded-full bg-stone-300 inline-block mr-1.5" />
              <span className="font-bold text-slate-600">Delivered</span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Delivery code confirmed</p>
            </div>
          </div>
        </div>

        {/* Key Shipment Details Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
            <p className="font-mono text-[10px] uppercase font-bold text-slate-500">Pickup address</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">
              {order.pickupAddress?.district || order.pickupDetails?.address || 'Pickup center'}
            </p>
            <p className="text-xs text-slate-600 truncate">{order.pickupDetails?.name}</p>
          </div>
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
            <p className="font-mono text-[10px] uppercase font-bold text-slate-500">Delivery address</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">
              {order.deliveryAddress?.district || order.deliveryDetails?.address || 'Delivery center'}
            </p>
            <p className="text-xs text-slate-600 truncate">{order.deliveryDetails?.name}</p>
          </div>
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
            <p className="font-mono text-[10px] uppercase font-bold text-slate-500">Delivery fee</p>
            <p className="font-mono text-base font-extrabold text-primary mt-0.5">
              {typeof order.pricing?.deliveryFee === 'number' ? `${order.currencySymbol || '৳'}${order.pricing.deliveryFee}` : 'Not available'}
            </p>
            <p className="text-xs text-slate-600 font-medium">Payment: {getPaymentMethodLabel(order.pricing?.paymentMethod)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            to={`/tracking?id=${trackingId}`}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-5 py-3 font-syne text-sm font-bold text-white shadow-md hover:from-[#73400a] hover:to-primary transition"
          >
            Track parcel <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/orders"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-stone-50 transition"
          >
            View my bookings
          </Link>
          <button
            type="button"
            onClick={onBookAnother}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-stone-50 transition cursor-pointer"
          >
            Book another parcel
          </button>
        </div>
      </div>
    </section>
  );
}

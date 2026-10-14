import { Link } from 'react-router-dom';
import CompanyPage from '../components/CompanyPage';

const phone = '09612-404040';

export default function Contact() {
  return <CompanyPage
    title="Contact us"
    intro="Whether you are sending a parcel, waiting for a delivery, or comparing our services, contact our team for help. Sharing the right shipment details helps us find the information you need more quickly."
    highlights={[
      { icon: 'call', value: phone, label: 'Support hotline' },
      { icon: 'receipt_long', value: 'Tracking ID', label: 'Have it ready' },
      { icon: 'support_agent', value: 'Delivery help', label: 'Customer support' },
    ]}
    sections={[
      { icon: 'call', title: 'Call our support team', body: <>For delivery questions and general support, call <a className="font-semibold text-primary hover:underline" href={`tel:${phone}`}>{phone}</a>.</>, items: ['Keep the tracking or consignment number nearby for parcel-specific questions.', 'Tell us whether you are the sender, recipient, or merchant so we can direct your request.', 'For an address or delivery-instruction update, share the correct details clearly.'] },
      { icon: 'search', title: 'Check a parcel first', body: 'The tracking page can show the latest available shipment status. Use the number provided when the parcel was booked.', items: [<Link className="font-semibold text-primary hover:underline" key="track" to="/tracking">Track a parcel</Link>, <Link className="font-semibold text-primary hover:underline" key="orders" to="/orders">View your orders</Link>] },
      { icon: 'calculate', title: 'Planning a shipment?', body: 'Review service options and estimate delivery charges before arranging a parcel.', items: [<Link className="font-semibold text-primary hover:underline" key="services" to="/services">Explore courier services</Link>, <Link className="font-semibold text-primary hover:underline" key="rates" to="/zone-rates">Review zone rates</Link>, <Link className="font-semibold text-primary hover:underline" key="calculator" to="/calculate-shipping">Calculate shipping</Link>] },
      { icon: 'privacy_tip', title: 'Protect your information', body: 'Only share personal and shipment details that are needed to resolve your request. Please do not send passwords or payment card details in a support message.' },
    ]}
  />;
}

import { Link } from 'react-router-dom';
import CompanyPage from '../components/CompanyPage';

const phone = '09612-404040';

export default function Terms() {
  return <CompanyPage
    title="Terms and conditions"
    intro="These terms describe the basic conditions for using the MadiSynthia website and courier services. By using the website or requesting a shipment, you agree to provide accurate information and follow the requirements below. If you are arranging a shipment for someone else, make sure you are authorized to share their delivery details."
    sections={[
      { icon: 'assignment', title: '1. Shipment information', body: 'You are responsible for providing complete and accurate sender, recipient, address, and contact details. Incomplete or incorrect details may delay delivery, result in additional coordination, or prevent a successful handover. Update us promptly if key shipment details change.' },
      { icon: 'inventory_2', title: '2. Parcel preparation and contents', body: 'Pack items securely for ordinary handling, use suitable outer packaging, and label the parcel clearly. Disclose information needed to handle a parcel safely. Do not send items prohibited by applicable law or items that cannot be safely transported.' },
      { icon: 'payments', title: '3. Rates and payment', body: 'Rates shown by the calculator are estimates based on the details entered. The final charge may depend on verified weight, dimensions, destination, and selected service. Confirm any applicable collection or cash-on-delivery amount when arranging the shipment.' },
      { icon: 'schedule', title: '4. Delivery and tracking', body: 'Delivery timelines are estimates and may be affected by weather, access restrictions, service disruptions, incomplete address details, or other circumstances outside the delivery team’s control. Tracking information is provided to help follow shipment progress and may not update at every handoff.' },
      { icon: 'how_to_reg', title: '5. Recipient handover and delivery attempts', body: 'The recipient should be available at the delivery address and provide any required delivery confirmation. If a delivery cannot be completed, the sender or recipient may need to coordinate another attempt or collection. Additional charges, where applicable, should be confirmed with support.' },
      { icon: 'block', title: '6. Delays, restrictions, and service availability', body: 'Service availability depends on the destination, parcel type, and operating conditions. MadiSynthia may need to pause, reroute, or decline a shipment when safety, legal requirements, incomplete information, or operational limits require it.' },
      { icon: 'language', title: '7. Website information', body: 'Website content, rates, and service details are provided to help customers plan. They may change as services are updated. Please confirm shipment-specific details with our team when a decision depends on them.' },
      { icon: 'support_agent', title: '8. Questions or concerns', body: <>For help with a shipment or these terms, contact us at <a className="font-semibold text-primary hover:underline" href={`tel:${phone}`}>{phone}</a>. You can also read the <Link className="font-semibold text-primary hover:underline" to="/terms-and-condition-bn">Bangla version</Link>.</> },
    ]}
  />;
}

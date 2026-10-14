import CompanyPage from '../components/CompanyPage';

const phone = '09612-404040';

export default function PrivacyPolicy() {
  return <CompanyPage
    title="Privacy policy"
    intro="This policy explains what information may be handled when you use the MadiSynthia website or courier services, why it is used, and how you can ask questions about it. Shipment details often need to be shared with the people involved in completing a delivery."
    sections={[
      { icon: 'person', title: '1. Information you provide', body: 'Depending on the service, this may include your name, phone number, email address, pickup and delivery addresses, parcel details, payment or collection instructions, and information you provide when contacting support.' },
      { icon: 'devices', title: '2. Service and usage information', body: 'When you use online tools, information such as the page or feature requested, tracking or booking references, and basic technical data may be processed to operate the site, display requested shipment details, and help diagnose service issues.' },
      { icon: 'task_alt', title: '3. How information is used', items: ['To arrange, transport, deliver, and track shipments.', 'To contact senders or recipients about delivery coordination and service updates.', 'To calculate or confirm charges and handle collection instructions.', 'To respond to questions, investigate issues, and maintain support records.', 'To protect the security and reliable operation of the website and courier services.'] },
      { icon: 'share', title: '4. When information may be shared', body: 'Shipment details may be shared with the sender, recipient, and staff or service providers who need them to arrange, transport, deliver, or support a shipment. Information may also be disclosed when required by law or needed to protect the safety and security of the service.' },
      { icon: 'schedule', title: '5. Keeping information', body: 'Shipment and support records may be kept as needed to coordinate services, answer questions, and maintain operational records. Retention may also be affected by legal or business requirements. Access to personal information should be limited to people who need it for these purposes.' },
      { icon: 'lock', title: '6. Protecting information', body: 'We take reasonable steps to protect information handled through our services. No online system or method of transmission can be guaranteed to be completely secure, so avoid sending passwords or unrelated sensitive information through support channels.' },
      { icon: 'manage_accounts', title: '7. Your choices and requests', body: 'You may contact support with questions about information associated with a shipment or request a correction to inaccurate contact details. We may need to verify your identity or your connection to the shipment before discussing or changing its information.' },
      { icon: 'support_agent', title: '8. Contact about privacy', body: <>For questions about this policy or information linked to a shipment, call <a className="font-semibold text-primary hover:underline" href={`tel:${phone}`}>{phone}</a>. Please provide a tracking reference where relevant, but never share your account password.</> },
    ]}
  />;
}

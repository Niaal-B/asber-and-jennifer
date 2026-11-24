import { wedding } from '../config/wedding';
import { Reveal } from '../components/Reveal';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import './Contact.css';

/** S6 (middle): family contacts on WhatsApp. Hidden until contacts are configured. */
export function Contact() {
  const { contacts } = wedding;
  if (contacts.length === 0) return null;
  return (
    <Reveal className="contact">
      <h2 className="script contact__title">Contact</h2>
      <ul className="contact__list">
        {contacts.map((c) => (
          <li key={c.whatsapp}>
            <a
              className="contact__item"
              href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${c.role}, ${c.name}`}
            >
              <span className="contact__role">{c.role}</span>
              <span className="contact__name">{c.name}</span>
              {c.phone && <span className="contact__phone">{c.phone}</span>}
              <WhatsAppIcon size={44} />
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

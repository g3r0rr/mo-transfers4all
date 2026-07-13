import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useState, useEffect } from 'react'

const en = {
  tag: 'Legal', title: 'Terms of', titleEm: 'Service',
  updated: 'Last updated: June 2026',
  keyLabel: 'Service Summary',
  keyText: 'By making a booking with MO Transfers4all Athens, you agree to these Terms of Service in full. All fares are fixed, inclusive of tolls, and confirmed at time of booking.',
  sections: [
    {
      num: '01', title: 'Service Provider',
      content: 'These Terms of Service govern the use of private transfer services provided by Marjus Oruci, a licensed professional taxi driver operating as MO Transfers4all Athens. By making a booking, you agree to these terms in full.',
      highlight: 'Marjus Oruci · MO Transfers4all Athens\nΑΦΜ: 122559412\nmo.transfers4all@gmail.com · +30 693 647 5451\nAthens, Greece',
    },
    {
      num: '02', title: 'Booking & Confirmation',
      content: 'A booking request submitted via our website or by phone is not confirmed until you receive an explicit confirmation from MO Transfers4all Athens.',
      items: ['Bookings must be made at least 2 hours before the requested transfer time', 'Confirmation will be sent via phone, email, or WhatsApp', 'Please ensure all booking details (date, time, pickup point) are accurate', 'MO Transfers4all Athens reserves the right to decline bookings at its discretion'],
    },
    {
      num: '03', title: 'Fares & Payment',
      content: 'All fares are agreed upon at the time of booking confirmation. Prices are inclusive of all applicable taxes and tolls unless otherwise stated.',
      items: ['Payment is accepted in cash (EUR), POS (card), or IRIS', 'Waiting time beyond 15 minutes (non-airport) may incur additional charges', 'Airport transfers include 45-minute free waiting time after landing', 'Additional stops or route changes may be subject to revised fares'],
    },
    {
      num: '04', title: 'Cancellation Policy',
      highlight: '✅ Free cancellation is available up to 2 hours before the scheduled pickup time. Cancellations with less than 2 hours\' notice may be subject to a cancellation fee.',
      items: ['Cancellations must be communicated by phone or WhatsApp', 'No-shows (passenger not present at agreed time and location) will be charged the full fare', 'MO Transfers4all Athens reserves the right to cancel in cases of force majeure'],
    },
    {
      num: '05', title: 'Passenger Conduct',
      content: 'Passengers are expected to behave respectfully toward the driver and maintain the cleanliness of the vehicle.',
      items: ['Smoking is strictly prohibited inside all vehicles', 'Consumption of food or beverages (other than provided water) requires prior agreement', 'Damage to the vehicle caused by a passenger will be charged to the passenger', 'The driver may refuse service to passengers behaving aggressively or dangerously', 'All passengers must wear seat belts at all times'],
    },
    {
      num: '06', title: 'Liability',
      content: 'MO Transfers4all Athens operates with full passenger insurance as required by Greek law. Our liability is limited as follows:',
      items: ['We are not responsible for delays caused by traffic, road closures, or circumstances beyond our control', 'We are not liable for missed flights or connections due to external factors', 'Liability for lost or damaged luggage is limited to incidents directly caused by our negligence', 'Maximum liability shall not exceed the value of the fare paid for the relevant transfer'],
    },
    {
      num: '07', title: 'Data Protection',
      highlight: '🔒 All customer personal data is strictly used for the booking process and is permanently deleted immediately after the completion of the transfer.',
      content: 'We comply fully with Regulation (EU) 2016/679 (GDPR). Your booking data is never sold, shared with third parties, or used for any marketing purpose. See our full Privacy Policy for details.',
    },
    {
      num: '08', title: 'Governing Law',
      content: 'These Terms of Service are governed by and construed in accordance with Greek law. Any disputes arising from the use of our services shall be subject to the exclusive jurisdiction of the courts of Athens, Greece.',
    },
    {
      num: '09', title: 'Contact',
      content: 'For any questions regarding these terms or our services, please contact us:',
      highlight: 'mo.transfers4all@gmail.com\n+30 693 647 5451',
    },
  ]
}

const gr = {
  tag: 'Νομικά', title: 'Όροι', titleEm: 'Υπηρεσίας',
  updated: 'Τελευταία ενημέρωση: Ιούνιος 2026',
  keyLabel: 'Σύνοψη Υπηρεσίας',
  keyText: 'Κάνοντας κράτηση με την MO Transfers4all Athens, αποδέχεστε πλήρως αυτούς τους Όρους Υπηρεσίας. Όλες οι τιμές είναι σταθερές, περιλαμβάνουν διόδια και επιβεβαιώνονται κατά την κράτηση.',
  sections: [
    {
      num: '01', title: 'Πάροχος Υπηρεσιών',
      content: 'Οι παρόντες Όροι διέπουν τη χρήση των υπηρεσιών ιδιωτικής μεταφοράς που παρέχονται από τον Marjus Oruci, αδειοδοτημένο επαγγελματία οδηγό ταξί που δραστηριοποιείται ως MO Transfers4all Athens.',
      highlight: 'Marjus Oruci · MO Transfers4all Athens\nΑΦΜ: 122559412\nmo.transfers4all@gmail.com · +30 693 647 5451\nΑθήνα, Ελλάδα',
    },
    {
      num: '02', title: 'Κράτηση & Επιβεβαίωση',
      content: 'Ένα αίτημα κράτησης δεν επιβεβαιώνεται έως ότου λάβετε ρητή επιβεβαίωση από την MO Transfers4all Athens.',
      items: ['Οι κρατήσεις πρέπει να γίνονται τουλάχιστον 2 ώρες πριν από την ώρα της μεταφοράς', 'Η επιβεβαίωση θα αποσταλεί μέσω τηλεφώνου, email ή WhatsApp', 'Βεβαιωθείτε ότι όλες οι λεπτομέρειες της κράτησης είναι ακριβείς', 'Η MO Transfers4all Athens διατηρεί το δικαίωμα να αρνηθεί κρατήσεις'],
    },
    {
      num: '03', title: 'Τιμές & Πληρωμή',
      content: 'Όλες οι τιμές συμφωνούνται κατά την επιβεβαίωση της κράτησης. Οι τιμές περιλαμβάνουν όλους τους ισχύοντες φόρους και διόδια.',
      items: ['Η πληρωμή γίνεται δεκτή σε μετρητά (EUR), μέσω POS (κάρτα) ή IRIS', 'Χρόνος αναμονής πέρα των 15 λεπτών (εκτός αεροδρομίου) ενδέχεται να επιφέρει πρόσθετες χρεώσεις', 'Οι μεταφορές αεροδρομίου περιλαμβάνουν 45 λεπτά δωρεάν αναμονή μετά την προσγείωση', 'Επιπλέον στάσεις ή αλλαγές διαδρομής ενδέχεται να υπόκεινται σε αναθεωρημένες τιμές'],
    },
    {
      num: '04', title: 'Πολιτική Ακύρωσης',
      highlight: '✅ Δωρεάν ακύρωση διατίθεται έως 2 ώρες πριν από την προγραμματισμένη ώρα παραλαβής. Ακυρώσεις με λιγότερο από 2 ώρες προειδοποίηση ενδέχεται να υπόκεινται σε χρέωση.',
      items: ['Οι ακυρώσεις πρέπει να κοινοποιούνται τηλεφωνικά ή μέσω WhatsApp', 'Μη εμφάνιση θα χρεωθεί το πλήρες κόμιστρο', 'Η MO Transfers4all Athens διατηρεί το δικαίωμα ακύρωσης σε περιπτώσεις ανωτέρας βίας'],
    },
    {
      num: '05', title: 'Συμπεριφορά Επιβατών',
      content: 'Οι επιβάτες αναμένεται να συμπεριφέρονται με σεβασμό προς τον οδηγό και να διατηρούν την καθαριότητα του οχήματος.',
      items: ['Το κάπνισμα απαγορεύεται αυστηρά εντός όλων των οχημάτων', 'Η κατανάλωση τροφής ή ποτών απαιτεί προηγούμενη συμφωνία', 'Ζημιές στο όχημα θα χρεωθούν στον επιβάτη', 'Ο οδηγός μπορεί να αρνηθεί εξυπηρέτηση σε επιβάτες που συμπεριφέρονται επιθετικά', 'Όλοι οι επιβάτες πρέπει να φορούν ζώνη ασφαλείας'],
    },
    {
      num: '06', title: 'Ευθύνη',
      content: 'Η MO Transfers4all Athens λειτουργεί με πλήρη ασφάλεια επιβατών όπως απαιτείται από την ελληνική νομοθεσία.',
      items: ['Δεν είμαστε υπεύθυνοι για καθυστερήσεις λόγω κυκλοφορίας ή άλλων εξωτερικών παραγόντων', 'Δεν ευθυνόμαστε για χαμένες πτήσεις λόγω εξωτερικών παραγόντων', 'Η ευθύνη για αποσκευές περιορίζεται σε περιστατικά από άμεση αμέλειά μας', 'Η μέγιστη ευθύνη δεν υπερβαίνει την αξία του κομίστρου που καταβλήθηκε'],
    },
    {
      num: '07', title: 'Προστασία Δεδομένων',
      highlight: '🔒 Όλα τα προσωπικά δεδομένα των πελατών χρησιμοποιούνται αποκλειστικά για τη διαδικασία κράτησης και διαγράφονται οριστικά μετά την ολοκλήρωση της μεταφοράς.',
      content: 'Συμμορφωνόμαστε πλήρως με τον ΓΚΠΔ (ΕΕ) 2016/679. Τα δεδομένα κράτησής σας δεν πωλούνται ποτέ ούτε κοινοποιούνται σε τρίτους.',
    },
    {
      num: '08', title: 'Εφαρμοστέο Δίκαιο',
      content: 'Οι παρόντες Όροι διέπονται από την ελληνική νομοθεσία. Οποιεσδήποτε διαφορές υπάγονται στην αποκλειστική δικαιοδοσία των δικαστηρίων Αθηνών.',
    },
    {
      num: '09', title: 'Επικοινωνία',
      content: 'Για οποιεσδήποτε ερωτήσεις σχετικά με αυτούς τους όρους ή τις υπηρεσίες μας:',
      highlight: 'mo.transfers4all@gmail.com\n+30 693 647 5451',
    },
  ]
}

export default function Terms() {
  const [lang, setLang] = useState(() => localStorage.getItem('mo-lang') || 'en')
  const t = lang === 'gr' ? gr : en

  useEffect(() => {
    document.title = 'Terms & Conditions | MO Transfers4all Athens'
  }, [])

  return (
    <>
      <Navbar lang={lang} setLang={l => { setLang(l); localStorage.setItem('mo-lang', l) }}/>
      <style>{`
        .legal-section h2 { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 600; color: var(--blue-deep); margin-bottom: 0.85rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.6rem; }
        .legal-section p { font-size: 0.85rem; color: var(--text-mid); line-height: 1.8; margin-bottom: 0.75rem; }
        .legal-section ul { list-style: none; padding: 0; margin: 0.5rem 0 0.75rem; display: flex; flex-direction: column; gap: 0.45rem; }
        .legal-section ul li { font-size: 0.83rem; color: var(--text-mid); padding-left: 1.4rem; position: relative; line-height: 1.7; }
        .legal-section ul li::before { content: '→'; position: absolute; left: 0; color: var(--blue-bright); font-size: 0.75rem; top: 0.18rem; }
      `}</style>

      <div style={{ background: 'var(--blue-deep)', padding: '5rem 1.5rem 3.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '0.75rem' }}>{t.tag}</span>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.5rem' }}>
          {t.title} <em style={{ color: '#7ec8f0' }}>{t.titleEm}</em>
        </h1>
        <div style={{ width: '50px', height: '2px', background: 'linear-gradient(90deg,#7ec8f0,transparent)', margin: '1rem auto 0' }}/>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem' }}>{t.updated}</p>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        <div style={{ background: 'var(--blue-mist)', border: '1px solid var(--border)', borderLeft: '3px solid var(--blue-bright)', borderRadius: '0 10px 10px 0', padding: '1.5rem 1.75rem', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--blue-bright)', fontWeight: 600, marginBottom: '0.5rem' }}>📋 {t.keyLabel}</div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: 'var(--blue-deep)', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>{t.keyText}</p>
        </div>

        {t.sections.map(s => (
          <div key={s.num} className="legal-section" style={{ marginBottom: '2.5rem' }}>
            <h2>
              <span style={{ fontSize: '0.6rem', background: 'var(--blue-mist)', color: 'var(--blue-bright)', border: '1px solid var(--border)', padding: '0.2rem 0.55rem', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', fontWeight: 700, flexShrink: 0 }}>{s.num}</span>
              {s.title}
            </h2>
            {s.highlight && (
              <div style={{ background: 'var(--blue-mist)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem 1.2rem', marginBottom: '0.75rem', fontSize: '0.83rem', color: 'var(--blue-deep)', lineHeight: 1.7, whiteSpace: 'pre-line', fontWeight: 500 }}>{s.highlight}</div>
            )}
            {s.content && <p>{s.content}</p>}
            {s.items && <ul>{s.items.map((item, i) => <li key={i}>{item}</li>)}</ul>}
            {s.after && <p style={{ marginTop: '0.5rem' }}>{s.after}</p>}
          </div>
        ))}
      </div>

      <Footer lang={lang}/>
    </>
  )
}

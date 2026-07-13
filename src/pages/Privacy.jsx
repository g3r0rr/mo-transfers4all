import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useState, useEffect } from 'react'

const en = {
  tag: 'Legal', title: 'Privacy', titleEm: 'Policy',
  updated: 'Last updated: June 2026 · GDPR Compliant',
  keyLabel: 'Core Privacy Commitment',
  keyText: 'All customer personal data is strictly used for the booking process and is permanently deleted immediately after the completion of the transfer.',
  sections: [
    {
      num: '01', title: 'Data Controller',
      content: 'Marjus Oruci (operating as MO Transfers4all Athens) is the data controller responsible for your personal information under the General Data Protection Regulation (GDPR) (EU) 2016/679.',
      highlight: 'Marjus Oruci · MO Transfers4all Athens\nΑΦΜ: 122559412\nmo.transfers4all@gmail.com · +30 693 647 5451\nAthens, Greece',
    },
    {
      num: '02', title: 'Data We Collect',
      content: 'We collect only the minimum data necessary to process your transfer booking:',
      items: ['Full name', 'Phone number and/or WhatsApp', 'Email address', 'Pickup and drop-off locations', 'Date and time of transfer', 'Flight number (if applicable)', 'Special requests or notes you voluntarily provide'],
    },
    {
      num: '03', title: 'Purpose & Legal Basis',
      content: 'Your data is processed exclusively to fulfill your transfer booking. The legal basis is the performance of a contract (Article 6(1)(b) GDPR). We do not use your data for marketing, advertising, profiling, resale to third parties, or any purpose other than your requested transfer.',
    },
    {
      num: '04', title: 'Immediate Deletion Policy',
      highlight: '🗑️ Your data is permanently deleted immediately upon completion of your transfer.',
      content: 'This means:',
      items: ['No booking records are retained after your journey ends', 'No customer database or passenger history is maintained', 'Your contact details are removed from all systems once the service is completed', 'There is no long-term storage of personal data whatsoever'],
    },
    {
      num: '05', title: 'Data Sharing',
      content: 'We do not sell, share, or transfer your personal data to any third parties. Your booking information is used solely by MO Transfers4all Athens to coordinate your journey. Booking submissions are transmitted via secure encrypted channels. No third-party CRM or marketing platform stores your personal data. The only third-party tool used is Google Analytics, and only with your consent — see the Cookies section below for details.',
    },
    {
      num: '06', title: 'Cookies',
      content: 'Our website uses essential technical cookies necessary for the website to function (storing only your language preference and cookie consent choice — these contain no personal identifying information). With your consent, we also use Google Analytics (GA4) to understand how visitors use our site, such as which pages are viewed and how visitors arrived at the site. Analytics cookies are not set, and no data is sent to Google, unless you click "Accept" on our cookie banner. You can withdraw this consent at any time by clearing your cookies or contacting us. Google may process this data on servers outside the EU/EEA under its own privacy safeguards; see Google\u2019s Privacy Policy for details. We do not use advertising cookies, social media cookies, or pixels.',
    },
    {
      num: '07', title: 'Your GDPR Rights',
      content: 'Under the GDPR, you have the following rights regarding your personal data:',
      items: ['Right of access — Request a copy of your data', 'Right to rectification — Correct inaccurate data', 'Right to erasure — Request immediate deletion (data is already deleted after transfer)', 'Right to object — Object to processing', 'Right to data portability — Receive your data in a structured format'],
      after: 'To exercise any of these rights, contact us at: mo.transfers4all@gmail.com',
    },
    {
      num: '08', title: 'Complaints',
      content: 'If you believe your data rights have been violated, you have the right to lodge a complaint with the Hellenic Data Protection Authority (HDPA):',
      highlight: 'Hellenic Data Protection Authority (HDPA)\nwww.dpa.gr · +30 210 647 5600',
    },
    {
      num: '09', title: 'Policy Updates',
      content: 'We may update this Privacy Policy occasionally. Any changes will be published on this page with an updated date. We encourage you to review this page periodically.',
    },
  ]
}

const gr = {
  tag: 'Νομικά', title: 'Πολιτική', titleEm: 'Απορρήτου',
  updated: 'Τελευταία ενημέρωση: Ιούνιος 2026 · Συμμόρφωση GDPR',
  keyLabel: 'Βασική Δέσμευση Απορρήτου',
  keyText: 'Όλα τα προσωπικά δεδομένα των πελατών χρησιμοποιούνται αποκλειστικά για τη διαδικασία της κράτησης και διαγράφονται οριστικά αμέσως μετά την ολοκλήρωση της μεταφοράς.',
  sections: [
    {
      num: '01', title: 'Υπεύθυνος Επεξεργασίας',
      content: 'Ο Marjus Oruci (δραστηριοποιούμενος ως MO Transfers4all Athens) είναι ο υπεύθυνος επεξεργασίας των προσωπικών σας δεδομένων βάσει του Γενικού Κανονισμού Προστασίας Δεδομένων (ΓΚΠΔ) (ΕΕ) 2016/679.',
      highlight: 'Marjus Oruci · MO Transfers4all Athens\nΑΦΜ: 122559412\nmo.transfers4all@gmail.com · +30 693 647 5451\nΑθήνα, Ελλάδα',
    },
    {
      num: '02', title: 'Δεδομένα που Συλλέγουμε',
      content: 'Συλλέγουμε μόνο τα ελάχιστα απαραίτητα δεδομένα για την επεξεργασία της κράτησής σας:',
      items: ['Ονοματεπώνυμο', 'Αριθμός τηλεφώνου και/ή WhatsApp', 'Διεύθυνση email', 'Σημεία παραλαβής και αποβίβασης', 'Ημερομηνία και ώρα μεταφοράς', 'Αριθμός πτήσης (εφόσον ισχύει)', 'Ειδικές απαιτήσεις ή σημειώσεις που παρέχετε εθελοντικά'],
    },
    {
      num: '03', title: 'Σκοπός & Νομική Βάση',
      content: 'Τα δεδομένα σας υποβάλλονται σε επεξεργασία αποκλειστικά για την εκτέλεση της κράτησής σας. Η νομική βάση είναι η εκτέλεση σύμβασης (Άρθρο 6(1)(β) ΓΚΠΔ). Δεν χρησιμοποιούμε τα δεδομένα σας για μάρκετινγκ, διαφήμιση, προφίλ, μεταπώληση σε τρίτους ή οποιοδήποτε άλλο σκοπό.',
    },
    {
      num: '04', title: 'Πολιτική Άμεσης Διαγραφής',
      highlight: '🗑️ Τα δεδομένα σας διαγράφονται οριστικά αμέσως μετά την ολοκλήρωση της μεταφοράς σας.',
      content: 'Αυτό σημαίνει:',
      items: ['Δεν διατηρούνται αρχεία κράτησης μετά το τέλος του ταξιδιού σας', 'Δεν τηρείται βάση δεδομένων πελατών ή ιστορικό επιβατών', 'Τα στοιχεία επικοινωνίας σας αφαιρούνται από όλα τα συστήματα μόλις ολοκληρωθεί η υπηρεσία', 'Δεν υπάρχει μακροπρόθεσμη αποθήκευση προσωπικών δεδομένων'],
    },
    {
      num: '05', title: 'Κοινοποίηση Δεδομένων',
      content: 'Δεν πουλάμε, κοινοποιούμε ή μεταφέρουμε τα προσωπικά σας δεδομένα σε τρίτους. Οι πληροφορίες κράτησής σας χρησιμοποιούνται αποκλειστικά από την MO Transfers4all Athens. Κανένα τρίτο μέρος CRM ή πλατφόρμα μάρκετινγκ δεν αποθηκεύει τα προσωπικά σας δεδομένα. Το μόνο εργαλείο τρίτου μέρους που χρησιμοποιείται είναι το Google Analytics, και μόνο με τη συγκατάθεσή σας — δείτε την ενότητα Cookies παρακάτω.',
    },
    {
      num: '06', title: 'Cookies',
      content: 'Ο ιστότοπός μας χρησιμοποιεί απαραίτητα τεχνικά cookies για τη λειτουργία του (αποθηκεύουν μόνο τη γλωσσική σας προτίμηση και την επιλογή συγκατάθεσης cookies, χωρίς προσωπικά αναγνωριστικά δεδομένα). Με τη συγκατάθεσή σας, χρησιμοποιούμε επίσης το Google Analytics (GA4) για να κατανοούμε πώς οι επισκέπτες χρησιμοποιούν τον ιστότοπό μας, όπως ποιες σελίδες προβάλλονται. Τα cookies ανάλυσης δεν ενεργοποιούνται, και δεν αποστέλλονται δεδομένα στην Google, εκτός εάν επιλέξετε "Αποδοχή" στο banner cookies μας. Μπορείτε να ανακαλέσετε αυτή τη συγκατάθεση ανά πάσα στιγμή διαγράφοντας τα cookies σας ή επικοινωνώντας μαζί μας. Η Google ενδέχεται να επεξεργάζεται αυτά τα δεδομένα σε servers εκτός ΕΕ/ΕΟΧ σύμφωνα με τις δικές της εγγυήσεις απορρήτου. Δεν χρησιμοποιούμε cookies διαφήμισης ή κοινωνικών δικτύων.',
    },
    {
      num: '07', title: 'Τα Δικαιώματά σας ΓΚΠΔ',
      content: 'Βάσει του ΓΚΠΔ, έχετε τα ακόλουθα δικαιώματα:',
      items: ['Δικαίωμα πρόσβασης — Αίτηση αντιγράφου των δεδομένων σας', 'Δικαίωμα διόρθωσης — Διόρθωση ανακριβών δεδομένων', 'Δικαίωμα διαγραφής — Αίτηση άμεσης διαγραφής', 'Δικαίωμα εναντίωσης — Εναντίωση στην επεξεργασία', 'Δικαίωμα φορητότητας — Λήψη δεδομένων σε δομημένη μορφή'],
      after: 'Για να ασκήσετε οποιοδήποτε δικαίωμα: mo.transfers4all@gmail.com',
    },
    {
      num: '08', title: 'Παράπονα',
      content: 'Εάν πιστεύετε ότι τα δικαιώματά σας έχουν παραβιαστεί, μπορείτε να υποβάλετε καταγγελία στην ΑΠΔΠΧ:',
      highlight: 'Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (ΑΠΔΠΧ)\nwww.dpa.gr · +30 210 647 5600',
    },
    {
      num: '09', title: 'Ενημερώσεις Πολιτικής',
      content: 'Ενδέχεται να ενημερώνουμε αυτή την Πολιτική Απορρήτου περιστασιακά. Οποιεσδήποτε αλλαγές θα δημοσιεύονται σε αυτή τη σελίδα με ενημερωμένη ημερομηνία.',
    },
  ]
}

export default function Privacy() {
  const [lang, setLang] = useState(() => localStorage.getItem('mo-lang') || 'en')
  const t = lang === 'gr' ? gr : en

  useEffect(() => {
    document.title = 'Privacy Policy | MO Transfers4all Athens'
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

      {/* Hero */}
      <div style={{ background: 'var(--blue-deep)', padding: '5rem 1.5rem 3.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '0.75rem' }}>{t.tag}</span>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.5rem' }}>
          {t.title} <em style={{ color: '#7ec8f0' }}>{t.titleEm}</em>
        </h1>
        <div style={{ width: '50px', height: '2px', background: 'linear-gradient(90deg,#7ec8f0,transparent)', margin: '1rem auto 0' }}/>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem' }}>{t.updated}</p>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Key clause */}
        <div style={{ background: 'var(--blue-mist)', border: '1px solid var(--border)', borderLeft: '3px solid var(--blue-bright)', borderRadius: '0 10px 10px 0', padding: '1.5rem 1.75rem', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--blue-bright)', fontWeight: 600, marginBottom: '0.5rem' }}>🔒 {t.keyLabel}</div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: 'var(--blue-deep)', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>{t.keyText}</p>
        </div>

        {/* Sections */}
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

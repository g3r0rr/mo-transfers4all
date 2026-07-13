// Small wrapper around gtag so components don't each need to repeat the
// "is gtag loaded" check, and so event names/shapes stay consistent.
// Events fired here are safe to call unconditionally — gtag's consent
// mode (configured in index.html) silently drops data for visitors who
// haven't accepted cookies yet, it doesn't error.

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

// Common events used across the site, named consistently so GA4 reports
// stay clean instead of accumulating slightly-different ad-hoc event names.
export const trackBookingSubmitted = (vehicle, source = 'website') => {
  trackEvent('generate_lead', {
    event_category: 'booking',
    event_label: vehicle,
    source,
    value: 1
  })
}

export const trackWhatsAppContact = (contactName, method = 'whatsapp_widget') => {
  trackEvent('contact_whatsapp', {
    method,
    contact_name: contactName
  })
}

export const trackPhoneCall = (contactName, method = 'website') => {
  trackEvent('contact_phone_call', {
    method,
    contact_name: contactName
  })
}

export const trackEmailContact = (method = 'website') => {
  trackEvent('contact_email', { method })
}

import { useRef } from 'react'

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY
let loadPromise = null

function loadSDK() {
  if (loadPromise) return loadPromise
  if (window.google?.maps?.places) {
    loadPromise = Promise.resolve()
    return loadPromise
  }
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  return loadPromise
}

export function useGoogleAutocomplete(onChange) {
  const serviceRef = useRef(null)

  const getService = async () => {
    await loadSDK()
    if (!serviceRef.current) {
      serviceRef.current = new window.google.maps.places.AutocompleteService()
    }
    return serviceRef.current
  }

  const getPredictions = async (input, callback) => {
    if (input.length < 2) { callback([]); return }
    try {
      const svc = await getService()
      svc.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'gr' },
          location: new window.google.maps.LatLng(37.9838, 23.7275),
          radius: 50000,
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            callback(predictions)
          } else {
            callback([])
          }
        }
      )
    } catch {
      callback([])
    }
  }

  return { getPredictions }
}

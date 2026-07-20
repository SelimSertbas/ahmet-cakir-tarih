import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

// Analytics instance'ını oluştur
const analyticsInstance = Analytics({
  app: 'ahmet-cakir-website',
  plugins: [
    googleAnalytics({
      measurementIds: [import.meta.env.VITE_GA_MEASUREMENT_ID]
    })
  ]
})

// Sayfa görüntüleme takibi için yardımcı fonksiyon
export const trackPageView = (url: string) => {
  analyticsInstance.page({
    url,
    title: document.title
  })
}

// Özel olay takibi için yardımcı fonksiyon
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  analyticsInstance.track(eventName, properties)
}

// Tıklama takibi için yardımcı fonksiyon
export const trackClick = (elementName: string, properties?: Record<string, any>) => {
  analyticsInstance.track('click', {
    element: elementName,
    ...properties
  })
}

// Analytics instance'ını export et
export const analytics = analyticsInstance 
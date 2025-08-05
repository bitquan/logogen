import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import app from './firebase';

// Initialize Firebase Analytics
let analytics: Analytics | null = null;

// Only initialize analytics on client side and in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

// Define event names as constants
export const ANALYTICS_EVENTS = {
  TEMPLATE_SELECTED: 'template_selected',
  LOGO_EXPORTED: 'logo_exported',
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',
  FEATURE_USED: 'feature_used',
  ERROR_OCCURRED: 'error_occurred',
  USER_ONBOARDING: 'user_onboarding',
};

// Helper functions for common events
export const trackTemplateSelection = (templateId: string, templateName: string) => {
  trackEvent(ANALYTICS_EVENTS.TEMPLATE_SELECTED, {
    template_id: templateId,
    template_name: templateName,
  });
};

export const trackLogoExport = (format: string, quality: string, isPremium: boolean) => {
  trackEvent(ANALYTICS_EVENTS.LOGO_EXPORTED, {
    format,
    quality,
    is_premium: isPremium,
  });
};

export const trackPaymentFlow = (step: string, amount: number, plan: string) => {
  trackEvent(ANALYTICS_EVENTS.PAYMENT_STARTED, {
    step,
    amount,
    plan,
  });
};

export const trackFeatureUsage = (featureName: string, featureCategory: string) => {
  trackEvent(ANALYTICS_EVENTS.FEATURE_USED, {
    feature_name: featureName,
    feature_category: featureCategory,
  });
};

export const trackError = (errorType: string, errorMessage: string, errorContext?: string) => {
  trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
    error_type: errorType,
    error_message: errorMessage,
    error_context: errorContext,
  });
};

export const trackOnboarding = (step: number, completed: boolean) => {
  trackEvent(ANALYTICS_EVENTS.USER_ONBOARDING, {
    step,
    completed,
  });
};

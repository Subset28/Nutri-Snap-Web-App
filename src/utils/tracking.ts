const TRACKING_PREFERENCE_KEY = 'hasRequestedTracking';

export async function initializeTracking() {
  console.log('Initializing tracking for web...');
  
  // For web, we'll just log the tracking initialization
  // and set a flag in localStorage to prevent repeated prompts
  if (typeof window !== 'undefined') {
    const hasRequested = localStorage.getItem(TRACKING_PREFERENCE_KEY);
    
    if (hasRequested !== 'true') {
      console.log('Web tracking initialized');
      localStorage.setItem(TRACKING_PREFERENCE_KEY, 'true');
    } else {
      console.log('Web tracking already initialized');
    }
  }
// No app state tracking for web
}

export default initializeTracking;

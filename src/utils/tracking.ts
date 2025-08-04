import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';

const TRACKING_PREFERENCE_KEY = 'hasRequestedTracking';

export async function initializeTracking() {
  console.log('Initializing tracking...');
  // Only ask for tracking permission once per app install
  const { value } = await Preferences.get({ key: TRACKING_PREFERENCE_KEY });
  console.log('Tracking preference from storage:', value);
  
  if (value !== 'true') {
    try {
      console.log('Requesting tracking permission...');
      // On iOS, this will show the App Tracking Transparency dialog
      // On other platforms, it will resolve without doing anything
      const tracking = await (window as any).plugins.appTrackingTransparency;
      
      if (tracking) {
        console.log('Tracking plugin found, checking status...');
        const status = await tracking.getStatus();
        console.log('Current tracking status:', status);
        
        if (status === 'notDetermined') {
          console.log('Requesting tracking permission...');
          const permissionStatus = await tracking.requestPermission();
          console.log('User responded with status:', permissionStatus);
        } else {
          console.log('Tracking already determined, status:', status);
        }
        
        // Mark that we've requested tracking permission
        await Preferences.set({
          key: TRACKING_PREFERENCE_KEY,
          value: 'true'
        });
        console.log('Tracking preference saved');
      } else {
        console.log('No tracking plugin available (expected on non-iOS platforms)');
      }
    } catch (error) {
      console.error('Error initializing tracking:', error);
    }
  } else {
    console.log('Tracking already requested previously');
  }
}

// Listen for app state changes to handle tracking when the app becomes active
App.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    initializeTracking();
  }
});

export default initializeTracking;

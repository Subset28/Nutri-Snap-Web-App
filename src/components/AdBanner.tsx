import { useEffect } from "react";
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from "@capacitor-community/admob";

export function AdBanner() {
  useEffect(() => {
    let loadedHandle: any;
    let failedHandle: any;
    (async () => {
      loadedHandle = await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        console.log("AdMob banner loaded!");
      });
      failedHandle = await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
        console.log("AdMob banner failed to load:", error);
      });
      AdMob.showBanner({
        adId: "ca-app-pub-8981618797106308/3560785063", // Your real Ad Unit ID
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false,
      });
    })();
    return () => {
      AdMob.hideBanner();
      if (loadedHandle) loadedHandle.remove();
      if (failedHandle) failedHandle.remove();
    };
  }, []);
  return null;
} 
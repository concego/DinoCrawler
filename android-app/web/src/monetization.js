import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus } from '@capacitor-community/admob';
import { InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

const REMOVE_ADS_PRODUCT_ID = 'remove_ads';
const USE_TEST_ADS = import.meta.env.VITE_USE_TEST_ADS !== 'false'; // Production stays off until explicitly configured.
const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
const PRODUCTION_INTERSTITIAL_ID = import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || '';
const INTERSTITIAL_ID = USE_TEST_ADS ? TEST_INTERSTITIAL_ID : PRODUCTION_INTERSTITIAL_ID;
const CACHE_KEY = 'dinoCrawler.removeAds';
const isAndroid = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
let removedAds = false;
try { removedAds = localStorage.getItem(CACHE_KEY) === 'true'; } catch {}
let adsConsentReady = false;
let privacyOptionsRequired = false;
let interstitialReady = false;
let adsInitialization;
const observers = new Set();

function notify() {
  const state = { removedAds, adsConsentReady, privacyOptionsRequired };
  for (const observer of observers) { try { observer(state); } catch {} }
}
function cacheEntitlement(value) {
  removedAds = value;
  try { localStorage.setItem(CACHE_KEY, String(value)); } catch {}
  if (value) interstitialReady = false;
  notify();
}

export function onMonetizationChange(observer) {
  observers.add(observer);
  observer({ removedAds, adsConsentReady, privacyOptionsRequired });
  return () => observers.delete(observer);
}
export function isNativeAndroid() { return isAndroid(); }

async function initializeAds() {
  if (!isAndroid() || removedAds) return false;
  if (!adsInitialization) {
    adsInitialization = (async () => {
      try {
        let consent = await AdMob.requestConsentInfo();
        if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
          consent = await AdMob.showConsentForm();
        }
        privacyOptionsRequired = consent.privacyOptionsRequirementStatus === 'REQUIRED';
        notify();
        if (!consent.canRequestAds) { adsInitialization = undefined; return false; }
        await AdMob.initialize();
        adsConsentReady = true;
        await prepareInterstitial();
        return true;
      } catch (error) {
        adsInitialization = undefined;
        console.info('Ad setup unavailable; continue without ads.', error);
        return false;
      }
    })();
  }
  return adsInitialization;
}

async function prepareInterstitial() {
  if (!isAndroid() || !adsConsentReady || removedAds || !INTERSTITIAL_ID) return false;
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID, isTesting: USE_TEST_ADS, immersiveMode: true });
    interstitialReady = true;
    return true;
  } catch (error) {
    interstitialReady = false;
    console.info('Interstitial unavailable; continue without ad.', error);
    return false;
  }
}

export async function restoreRemoveAds() {
  if (!isAndroid()) return false;
  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    if (!isBillingSupported) return removedAds;
    await NativePurchases.restorePurchases();
    const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP });
    const owned = (purchases || []).some(purchase =>
      purchase.productIdentifier === REMOVE_ADS_PRODUCT_ID &&
      (purchase.purchaseState === 'PURCHASED' || purchase.purchaseState === '1') &&
      purchase.isAcknowledged === true
    );
    cacheEntitlement(owned);
    return owned;
  } catch (error) {
    // Preserve a previously verified local entitlement if the store is temporarily unreachable.
    console.info('Purchase restore unavailable; preserving prior entitlement cache.', error);
    return removedAds;
  }
}

export async function initializeMonetization() {
  if (!isAndroid()) return { native: false, removedAds: false };
  await restoreRemoveAds();
  if (!removedAds) await initializeAds();
  return { native: true, removedAds };
}

export async function getRemoveAdsPrice() {
  if (!isAndroid()) return null;
  try {
    const { products } = await NativePurchases.getProducts({
      productIdentifiers: [REMOVE_ADS_PRODUCT_ID], productType: PURCHASE_TYPE.INAPP
    });
    return products?.find(product => product.identifier === REMOVE_ADS_PRODUCT_ID)?.priceString || null;
  } catch (error) {
    console.info('Store price unavailable until the product is configured.', error);
    return null;
  }
}

export async function buyRemoveAds() {
  if (!isAndroid()) throw new Error('Google Play Billing is available in the Android app only.');
  const { isBillingSupported } = await NativePurchases.isBillingSupported();
  if (!isBillingSupported) throw new Error('Google Play Billing is unavailable on this device.');
  const { products } = await NativePurchases.getProducts({
    productIdentifiers: [REMOVE_ADS_PRODUCT_ID], productType: PURCHASE_TYPE.INAPP
  });
  const product = products?.find(item => item.identifier === REMOVE_ADS_PRODUCT_ID);
  if (!product) throw new Error('The remove-ads product is not available in Google Play yet.');
  const transaction = await NativePurchases.purchaseProduct({
    productIdentifier: REMOVE_ADS_PRODUCT_ID,
    productType: PURCHASE_TYPE.INAPP,
    autoAcknowledgePurchases: true
  });
  const completed = transaction.productIdentifier === REMOVE_ADS_PRODUCT_ID &&
    (transaction.purchaseState === 'PURCHASED' || transaction.purchaseState === '1') &&
    transaction.isAcknowledged === true;
  if (completed) cacheEntitlement(true);
  return completed;
}

export async function showPrivacyOptions() {
  if (!isAndroid() || !privacyOptionsRequired) return;
  await AdMob.showPrivacyOptionsForm();
}

export async function showInterstitialAfterResultsExit() {
  if (!isAndroid() || removedAds) return false;
  await initializeAds();
  if (!adsConsentReady) return false;
  if (!interstitialReady && !(await prepareInterstitial())) return false;
  interstitialReady = false;
  let resolveClosed;
  let rejectClosed;
  const closed = new Promise((resolve, reject) => { resolveClosed = resolve; rejectClosed = reject; });
  let dismissedListener;
  let failedListener;
  try {
    dismissedListener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, resolveClosed);
    failedListener = await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, rejectClosed);
    await AdMob.showInterstitial();
    // Native show resolves when the ad opens, not when it closes. Wait for close before preloading again.
    await closed;
    return true;
  } catch (error) {
    console.info('Interstitial skipped; gameplay continues.', error);
    return false;
  } finally {
    await dismissedListener?.remove().catch(() => {});
    await failedListener?.remove().catch(() => {});
    await prepareInterstitial();
  }
}

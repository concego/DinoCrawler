import {
  initializeMonetization, buyRemoveAds, restoreRemoveAds, getRemoveAdsPrice,
  showPrivacyOptions, isNativeAndroid, onMonetizationChange,
  showInterstitialAfterResultsExit
} from './monetization.js';

const buy = document.getElementById('btn-remove-ads');
const restore = document.getElementById('btn-restore-purchases');
const privacy = document.getElementById('btn-privacy-options');
const status = document.getElementById('purchase-status');
const currentLanguage = () => document.documentElement.lang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
let localizedPrice = '';

function setLabels() {
  const pt = currentLanguage() === 'pt';
  buy.textContent = (pt ? 'Remover anúncios' : 'Remove ads') + (localizedPrice ? ` — ${localizedPrice}` : '');
  restore.textContent = pt ? 'Restaurar compra' : 'Restore purchase';
  privacy.textContent = pt ? 'Opções de privacidade' : 'Privacy options';
}
function report(pt, en) { status.textContent = currentLanguage() === 'pt' ? pt : en; }
function renderState(state) {
  buy.hidden = !isNativeAndroid() || state.removedAds;
  restore.hidden = !isNativeAndroid();
  privacy.hidden = !isNativeAndroid() || !state.privacyOptionsRequired;
  if (state.removedAds) report('Anúncios removidos.', 'Ads removed.');
  setLabels();
}

onMonetizationChange(renderState);
new MutationObserver(setLabels).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
buy.addEventListener('click', async () => {
  buy.disabled = true;
  try {
    const completed = await buyRemoveAds();
    report(completed ? 'Compra concluída. Anúncios removidos.' : 'A compra ainda não foi concluída.', completed ? 'Purchase complete. Ads removed.' : 'Purchase is not complete yet.');
  } catch (error) {
    report('Não foi possível concluir a compra. Tente novamente mais tarde.', 'Could not complete the purchase. Try again later.');
    console.warn(error);
  } finally { buy.disabled = false; }
});
restore.addEventListener('click', async () => {
  restore.disabled = true;
  try {
    const owned = await restoreRemoveAds();
    report(owned ? 'Compra restaurada. Anúncios removidos.' : 'Nenhuma compra de remoção de anúncios encontrada.', owned ? 'Purchase restored. Ads removed.' : 'No remove-ads purchase found.');
  } catch (error) {
    report('Não foi possível verificar a compra.', 'Could not verify the purchase.');
    console.warn(error);
  } finally { restore.disabled = false; }
});
privacy.addEventListener('click', async () => {
  try { await showPrivacyOptions(); }
  catch (error) { report('Não foi possível abrir as opções de privacidade.', 'Could not open privacy options.'); console.warn(error); }
});
let initialization;
async function initializeAtMenu() {
  if (!initialization) initialization = initializeMonetization().then(async () => {
    localizedPrice = await getRemoveAdsPrice() || '';
    setLabels();
  }).catch(error => console.warn('Monetization initialization skipped.', error));
  return initialization;
}
window.DinoMonetization = { showInterstitialAfterResultsExit, initialize: initializeAtMenu };

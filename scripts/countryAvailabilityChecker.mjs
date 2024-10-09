// Step 1: Create a new utility module (countryAvailabilityChecker.mjs)

// File: scripts/countryAvailabilityChecker.mjs

// Import necessary dependencies
import axios from 'axios';
import { JSDOM } from 'jsdom';

// Configuration constants
const maxRetries = 5;
const baseDelay = 2000;

// Country codes for availability checks
export const countryCodes = 'US,CN,JP,IN,GB,CA,BR,AR,DE,ZA,AU,NZ,KR,FR,RU'.split(',');
export const allCountryCodes = 'AE,AF,AG,AI,AL,AM,AO,AR,AT,AU,AZ,BB,BD,BE,BF,BG,BH,BJ,BM,BN,BO,BR,BS,BT,BW,BY,BZ,CA,CD,CG,CH,CI,CL,CM,CN,CO,CR,CV,CY,CZ,DE,DK,DM,DO,DZ,EC,EE,EG,ES,FI,FJ,FM,FR,GB,GD,GH,GM,GR,GT,GW,GY,HK,HN,HR,HU,ID,IE,IL,IN,IS,IT,JM,JO,JP,KE,KG,KH,KN,KR,KW,KY,KZ,LA,LB,LC,LK,LR,LT,LU,LV,MD,MG,MK,ML,MM,MN,MO,MR,MS,MT,MU,MW,MX,MY,MZ,NA,NE,NG,NI,NL,NO,NP,NZ,OM,PA,PE,PG,PH,PK,PL,PT,PW,PY,QA,RO,RU,SA,SB,SC,SE,SG,SI,SK,SL,SN,SR,ST,SV,SZ,TC,TD,TH,TJ,TM,TN,TR,TT,TW,TZ,UA,UG,US,UY,UZ,VC,VE,VG,VN,YE,ZA,ZW'.split(',');

/**
 * Check if an app is available in a specific country
 * @param {string} appId - The app ID or package name to check
 * @param {string} countryCode - The country code to check availability
 * @param {string} platform - The platform ('ios' or 'android')
 * @param {number} retryCount - The current retry count
 * @param {number} delayBetweenRequests - Delay between requests in milliseconds (default: 1000)
 * @returns {Promise<boolean>} - True if the app is available, false otherwise
 */
export async function isAppAvailable(appId, countryCode, platform, retryCount = 0, delayBetweenRequests = 1000) {
  let url;
  if (platform === 'ios') {
    url = `https://itunes.apple.com/lookup?id=${appId}&country=${countryCode}`;
  } else if (platform === 'android') {
    url = `https://play.google.com/store/apps/details?id=${appId}&gl=${countryCode}`;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests)); // Delay between API calls
    const response = await axios.get(url, {
      headers: platform === 'android' ? {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      } : {}
    });

    if (platform === 'ios') {
      return response.data.resultCount > 0;
    } else if (platform === 'android') {
      const dom = new JSDOM(response.data);
      const document = dom.window.document;
      const notFoundElement = document.querySelector('div[jscontroller="WYvdzc"]');
      if (notFoundElement) {
        const notFoundText = notFoundElement.textContent;
        if (notFoundText.includes("isn't available in your country") || notFoundText.includes("not found")) {
          return false;
        }
      }
      return true;
    }
  } catch (error) {
    if (error.response && (error.response.status === 403 || error.response.status === 429) && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return isAppAvailable(appId, countryCode, platform, retryCount + 1, delayBetweenRequests);
    }
    return false;
  }
}

/**
 * Perform a cooldown period with progress messages
 * @param {number} cooldownPeriod - The duration of the cooldown in milliseconds
 * @returns {Promise<void>}
 */
export async function cooldown(cooldownPeriod) {
  console.log(
    "\n🚨 Whoa there, speed racer! We've processed a batch of files. Time to give the API a breather. 💨"
  );

  const cooldownMessages = [
    'API is doing yoga to destress.',
    'API is sipping on a digital smoothie.',
    'API is practicing its deep breathing exercises.',
    'API is power napping.',
    'API is almost done with its meditation session.',
    'API is stretching its digital muscles.'
  ];

  const totalSteps = 6;
  const stepDuration = cooldownPeriod / totalSteps;

  for (let i = 0; i < totalSteps; i++) {
    await new Promise((resolve) => setTimeout(resolve, stepDuration));
    const emoji = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕'][i];
    console.log(`${emoji} Cooling down... (${(i + 1) * 10}s) ${cooldownMessages[i]}`);
  }

  console.log(
    "✨ Cooldown complete! The API is refreshed and ready to rock 'n' roll again! 🎸\n"
  );
}

/**
 * Log country availability check progress
 * @param {string} countryCode - The country code being checked
 */
export function logCountryProgress(countryCode, isSingleFile) {
    if (isSingleFile) {
      process.stdout.write(`${countryCode}, `);
  }
}
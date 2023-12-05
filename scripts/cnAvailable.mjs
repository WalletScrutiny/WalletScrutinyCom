import gplay from 'google-play-scraper';

const countryCodes = [
    "AL", "DZ", "AM", "AW", "AT", "AZ", "BY", "BE", "BZ", "BA", "BW", "BG", "BF", "BI", "CA", 
    "CF", "TD", "KM", "CR", "CL", "CI", "HR", "CU", "CY", "CZ", "DK", "DJ", "DO", "EG", "SV",  
    "EE", "ET", "FI", "FR", "GF", "GE", "DE", "GH", "GR", "GT", "GY", "HT", "HN", "HU", "IE", 
    "IL", "IT", "JM", "JO", "KZ", "KE", "XK", "KG", "LV", "LB", "LS", "LR", "LY", "LT", "LU", 
    "MK", "MG", "MW", "ML", "MT", "MU", "YT", "MX", "MD", "ME", "MA", "MZ", "NA", "NL", "AN", 
    "NI", "NE", "NG", "NO", "PS", "PA", "PL", "PT", "PR", "RE", "RO", "RU", "RW", "RS", "SC", 
    "SL", "SK", "SI", "SO", "ZA", "SS", "ES", "SD", "SR", "SZ", "SE", "CH", "TJ", "TZ", "TT", 
    "TN", "TR", "TM", "UG", "UA", "GB", "US", "UZ", "ZM", "ZW", "ER"
];

// Delay function to act as a simple semaphore
const delay = ms => new Promise(res => setTimeout(res, ms));

const checkAvailability = async (appId, countryCode) => {
    try {
        await gplay.app({ appId: appId, country: countryCode });
        return true;
    } catch (error) {
        console.error(`Error for ${countryCode}:`, error.message);
        return false;
    }
};

const checkAppAvailability = async (appId) => {
    for (const countryCode of countryCodes) {
        const isAvailable = await checkAvailability(appId, countryCode);
        const availabilityText = isAvailable ? "\x1b[32mavailable\x1b[0m" : "\x1b[31mnot available\x1b[0m";
        console.log(`${countryCode} - ${availabilityText}`);
        await delay(1000); // Wait for 1 second (1000 milliseconds) between each request
    }
};

const appId = process.argv[2];
if (!appId) {
    console.error("Please provide an app ID.");
    process.exit(1);
}

checkAppAvailability(appId);

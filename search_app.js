const fs = require('fs');

// Function to load JSON data
function loadAppData() {
    let rawdata = fs.readFileSync('output.json');
    return JSON.parse(rawdata);
}

// Function to find app data based on appHash
function findAppDataByAppHash(appData, appHash) {
    return appData.filter(app => app.appHash === appHash);
}

// Main function
function main() {
    const appHash = process.argv[2];
    if (!appHash) {
        console.log('Please provide an appHash as a parameter.');
        process.exit(1);
    }

    const appData = loadAppData();
    const results = findAppDataByAppHash(appData, appHash);

    if (results.length > 0) {
        console.log(results);
    } else {
        console.log('App data not found');
    }
}

// Execute the main function
main();
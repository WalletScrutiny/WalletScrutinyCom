const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function parseYamlFile(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
        data = yaml.load(fileContents);
    } catch (e) {
        console.error(`Failed to parse YAML file: ${e.message}. \n\nFind the problematic dates and try remove them first`);
        process.exit(1)
    }
    
    const parsedData = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (parsedData.hasOwnProperty(key)) {
                console.warn(`Duplicate key found: ${key}. Merging entries.`);
                parsedData[key] = [...new Set([...parsedData[key], ...data[key]])];
            } else {
                parsedData[key] = data[key];
            }
        }
    }
    return parsedData;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getOldAppIds(yamlData, daysThreshold = 15) {
    const oldAppIds = [];
    const currentDate = new Date();
    const dateThreshold = new Date(currentDate - daysThreshold * 24 * 60 * 60 * 1000);
    for (const dateStr in yamlData) {
        if (yamlData.hasOwnProperty(dateStr) && yamlData[dateStr] !== null && yamlData[dateStr].length > 0) {
            const dateAdded = new Date(dateStr);
            if ((currentDate - dateAdded) / (1000 * 60 * 60 * 24) >= daysThreshold) {
                const cleanedAppIds = yamlData[dateStr].map(appId => appId.replace('_', ''));
                oldAppIds.push(...cleanedAppIds);
                delete yamlData[dateStr];
            }
        }
    }
    return { oldAppIds, dateThreshold: formatDate(dateThreshold), updatedYamlData: yamlData };
}

function formatAppIds(appIds) {
    return appIds.join(',');
}

function writeYamlFile(filePath, data) {
    const formattedData = {};
    for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== null && data[key].length > 0) {
            formattedData[formatDate(new Date(key))] = data[key];
        }
    }

    let yamlStr = yaml.dump(formattedData, { lineWidth: -1, quotingType: '"', forceQuotes: false, indent: 2 });
    yamlStr = yamlStr.replace(/"(\d{4}-\d{2}-\d{2})"/g, '$1');

    yamlStr = yamlStr.replace(/^(\s*)-\s/gm, '- ');

    fs.writeFileSync(filePath, yamlStr, 'utf8');
}

const yamlFilePath = path.join(__dirname, '../_data/defunct.yaml');
const data = parseYamlFile(yamlFilePath);

const { oldAppIds, dateThreshold, updatedYamlData } = getOldAppIds(data);
const formattedAppIds = formatAppIds(oldAppIds);

console.log(formattedAppIds);

writeYamlFile(yamlFilePath, updatedYamlData);

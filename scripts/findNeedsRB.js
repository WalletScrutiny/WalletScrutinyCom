const fs = require("fs");
const path = require("path");

const foldersToAnalyze = ["_android", "_hardware"];
const needsRB = [];

const searchForVerificationText = () => {
    console.log('')
    console.log('----------------------------')
    console.log('🚀 \x1b[37m\x1b[1mNow processing files with "for verification" text\x1b[0m')
    console.log('----------------------------')
    console.log('')
  
    for (const folder of foldersToAnalyze) {
      const folderPath = path.join("/home/dannybuntu/Work/walletScrutinyCom", folder);
      const files = fs.readdirSync(folderPath);
  
      for (const file of files) {
        if (path.extname(file) === ".md") {
          const filePath = path.join(folderPath, file);
          const content = fs.readFileSync(filePath, "utf-8");
  
          const metaMatch = content.match(/^meta:\s*(.*)$/m);
          const verdictMatch = content.match(/^verdict:\s*(.*)$/m);
  
          if (content.includes("for verification") && 
              metaMatch && metaMatch[1].trim() === 'ok' && 
              verdictMatch && verdictMatch[1].trim() === 'wip') {
  
            console.log(`\x1b[1m\x1b[36m${file} needs verification\x1b[0m`);
            console.log(`\x1b[1m\x1b[33mfile name: ${file}\x1b[0m`);
  
            const repositoryMatch = content.match(/^repository:\s*((https?:\/\/[^\s]+)?)(?=\s*$|\s*[^:]*:)/m);
            const issueMatch = content.match(/^issue:\s*((https?:\/\/[^\s]+)?)(?=\s*$|\s*[^:]*:)/m);  // Updated regex
            const versionMatch = content.match(/^version:\s*(.*)$/m);
            const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
  
            console.log(`- repository: ${repositoryMatch ? repositoryMatch[1].trim() : "N/A"}`);
            console.log(`- issue: ${issueMatch && issueMatch[1].trim() ? issueMatch[1].trim() : "N/A"}`);
            console.log(`- version: ${versionMatch ? versionMatch[1].trim() : "N/A"}`);
            console.log(`- date: ${dateMatch ? dateMatch[1].trim() : "N/A"}`);
          }
        }
      }
    }
  };
  
// Call the function at the beginning
searchForVerificationText();

console.log('')
console.log('----------------------------')
console.log('🚀 \x1b[37m\x1b[1mNow analyzing files which may need updating\x1b[0m')
console.log('----------------------------')
console.log('')

const writeToNeedsRBFile = () => {
  fs.writeFileSync("needsRB.txt", needsRB.join("\n"), "utf-8");
};

const analyzeFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const verdictMatch = content.match(/^verdict:\s*(.*)$/m);
  const metaMatch = content.match(/^meta:\s*(.*)$/m);
  const standaloneDateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);

  let standaloneDate = null;
  if (standaloneDateMatch) {
    standaloneDate = new Date(standaloneDateMatch[1]);
  }

  if (verdictMatch && metaMatch) {
    const verdict = verdictMatch[1].trim();
    const meta = metaMatch[1].trim();

    if (["reproducible", "nonverifiable", "ftbfs", "wip"].includes(verdict) && meta === "ok") {
      const reviewArchiveMatch = content.match(/reviewArchive:\s*\n((?:\s*- date:.*\n)+)/);
      const updatedMatch = content.match(/updated:\s*(\d{4}-\d{2}-\d{2})/);

      if (reviewArchiveMatch && updatedMatch) {
        const updated = new Date(updatedMatch[1]);
        const dates = reviewArchiveMatch[1].match(/\d{4}-\d{2}-\d{2}/g).map((date) => new Date(date));
        let latestDate = new Date(Math.max(...dates));

        if (standaloneDate && standaloneDate > latestDate) {
          latestDate = standaloneDate;
        }

        console.log(`\x1b[33m\x1b[1m${path.basename(filePath)}\x1b[0m`);
        console.log(`- the software was last updated on: ${updated.toISOString().split("T")[0]}`);
        console.log(`- the last review was performed on: ${latestDate.toISOString().split("T")[0]}`);
        console.log(`- the latest verdict was: ${verdict}`);

        if (latestDate < updated) {
          console.log(`\x1b[1m\x1b[36m${path.basename(filePath)} might need reproducibility testing.\x1b[0m`);
          needsRB.push(path.basename(filePath));
        }
      }
    }
  }
};

for (const folder of foldersToAnalyze) {
  const folderPath = path.join("/home/dannybuntu/Work/walletScrutinyCom", folder);
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (path.extname(file) === ".md") {
      analyzeFile(path.join(folderPath, file));
    }
  }
}

writeToNeedsRBFile();

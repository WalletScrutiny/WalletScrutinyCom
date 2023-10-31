const fs = require("fs");
const path = require("path");
const foldersToAnalyze = ["_android", "_hardware"];

const searchForVerificationText = () => {
  console.log(`
----------------------------
🚀 \x1b[37m\x1b[1mProcessing files with "for verification" text\x1b[0m
----------------------------
`);
  const needVerification = [];
  for (const folder of foldersToAnalyze) {
    const files = fs.readdirSync(folder);
    for (const file of files) {
      if (path.extname(file) === ".md") {
        const filePath = path.join(folder, file);
        const content = fs.readFileSync(filePath, "utf-8");

        const meta = content.match(/^meta:\s*(.*)$/m)[1].trim();
        const verdict = content.match(/^verdict:\s*(.*)$/m)[1].trim();

        if (content.includes("for verification") && 
            meta === 'ok' && 
            verdict === 'wip') {
          const date = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)[1].trim();
          needVerification.push({
            date: date,
            file: filePath
          });
        }
      }
    }
  }
  needVerification.sort((a, b) => new Date(a.date) - new Date(b.date));
  for (const n of needVerification) {
    console.log(`${n.date}: \x1b[1m\x1b[36m${n.file}\x1b[0m`);
  }
};

const analyzeFiles = () => {
  console.log(`
----------------------------
🚀 \x1b[37m\x1b[1mAnalyzing files which may need updating\x1b[0m
----------------------------
`);
  const needVerification = [];
  for (const folder of foldersToAnalyze) {
    const files = fs.readdirSync(folder);

    for (const file of files) {
      if (path.extname(file) === ".md") {
        analyzeFile(path.join(folder, file), needVerification);
      }
    }
  }
  needVerification.sort((a, b) => a.dtDays - b.dtDays);
  for (const n of needVerification) {
    console.log(`${n.updated.toISOString().split("T")[0]}: \x1b[1m\x1b[36m${n.file}\x1b[0m (${n.verdict}) last reviewed ${n.dtDays}d prior`);
  }
};

const analyzeFile = (filePath, needVerification) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const verdictMatch = content.match(/^verdict:\s*(.*)$/m);
  const metaMatch = content.match(/^meta:\s*(.*)$/m);
  const standaloneDateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);

  let standaloneDate = standaloneDateMatch ? new Date(standaloneDateMatch[1]) : null;

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
        const dtDays = Math.round((updated - latestDate) / 1000 / 60 / 60 / 24);

        if (0 < dtDays) {
          needVerification.push({
            updated: updated,
            file: filePath,
            verdict: verdict,
            dtDays: dtDays
          });
        }
      }
    }
  }
};

searchForVerificationText();
analyzeFiles();

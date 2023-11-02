const fs = require("fs");
const path = require("path");
const {loadFromFile, dateOrEmpty} = require("./helper");
const foldersToAnalyze = ["_android", "_hardware"];
const fNormal = '\x1b[0m';
const fBold = '\x1b[37m\x1b[1m';
const fHighlight = '\x1b[1m\x1b[36m';
const fWarn = '\x1b[1m\x1b[31m';

const toLength = (string, length) => {
  if (string.length < length) {
    return string.padEnd(length);
  } else if (string.length > length) {
    return string.substring(0, length);
  } else {
    return string;
  }
};

const searchForVerificationText = () => {
  console.log(`
----------------------------
🚀 ${fBold}Processing files with "for verification" text${fNormal}
----------------------------
`);
  const needVerification = [];
  for (const folder of foldersToAnalyze) {
    const files = fs.readdirSync(folder);
    for (const file of files) {
      const filePath = path.join(folder, file);
      const {header, body} = loadFromFile(filePath);
      const {meta, verdict} = header;

      if (body.includes("for verification") && 
          meta === 'ok' && 
          verdict === 'wip') {
        needVerification.push({
          date: header.date,
          file: filePath,
          users: header.users,
          ratings: header.ratings,
          title: header.altTitle || header.title,
        });
      }
    }
  }
  needVerification.sort((a, b) => a.date - b.date);
  for (const n of needVerification) {
    console.log(`%s ${fHighlight}%s${fNormal} %s ${fBold} %s`,
      toLength(dateOrEmpty(n.date), 10),
      toLength(n.file, 50),
      toLength(n.users ? `${n.users / 1000}k users` : '', 10),
      n.title);
  }
};

const analyzeFiles = () => {
  console.log(`
----------------------------
🚀 ${fBold}Analyzing files which may need updating${fNormal}
----------------------------
`);
  const needVerification = [];
  for (const folder of foldersToAnalyze) {
    const files = fs.readdirSync(folder);

    for (const file of files) {
      analyzeFile(path.join(folder, file), needVerification);
    }
  }
  needVerification.sort((a, b) => a.dtDays - b.dtDays);
  for (const n of needVerification) {
    console.log(`%s: ${fHighlight}%s${fNormal} %s lacking review since %s days`,
      toLength(dateOrEmpty(n.updated), 10),
      toLength(n.file, 50),
      toLength(n.verdict === 'reproducible' ? `REPRODUCIBLE` : n.verdict, 15),
      toLength('' + n.dtDays, 3),
      n.title);
  }
};

const analyzeFile = (filePath, needVerification) => {
  const {header, body} = loadFromFile(filePath);
  const {meta, date, verdict, updated} = header;

  if (meta === "ok") {
    const wasReproducible = verdict === 'reproducible' || (
        header.reviewArchive && 
        header.reviewArchive.some(it => it.verdict === 'reproducible')
      );
    if (updated && wasReproducible) {
      if (date < updated) {
        const dtDays = Math.round((new Date() - updated) / 1000 / 60 / 60 / 24);
        needVerification.push({
          updated: updated,
          file: filePath,
          verdict: verdict,
          dtDays: dtDays,
          title: header.altTitle || header.title,
        });
      }
    }
  }
};

searchForVerificationText();
analyzeFiles();

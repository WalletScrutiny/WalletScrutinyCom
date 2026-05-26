import fs from "fs";
import path from "path";
import helper from "./helper.mjs";

const { loadFromFile, dateOrEmpty } = helper;
const foldersToAnalyze = ["_mobile", "_hardware"];

function getUsers (header) {
  const users = [header.users, header.android?.users, header.iphone?.users]
    .filter((u) => u != null && !Number.isNaN(Number(u)));
  return users.length ? Math.max(...users.map(Number)) : null;
}

function getUpdated (header) {
  const dates = [header.updated, header.android?.updated, header.iphone?.updated]
    .filter(Boolean)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

function getTitle (header) {
  return header.altTitle || header.title ||
    header.android?.altTitle || header.iphone?.altTitle;
}
const fNormal = '\x1b[0m';
const fBold = '\x1b[37m\x1b[1m';
const fHighlight = '\x1b[1m\x1b[36m';
const fWarn = '\x1b[1m\x1b[33m'; // Yellow text

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
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(folder, file);
      const { header, body } = loadFromFile(filePath);
      const { meta, verdict } = header;

      if (body.includes("for verification") &&
          meta === 'ok' &&
          verdict === 'wip') {
        needVerification.push({
          date: header.date,
          file: filePath,
          users: getUsers(header),
          title: getTitle(header)
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
  const needOtherVerdicts = [];

  for (const folder of foldersToAnalyze) {
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      analyzeFile(path.join(folder, file), needVerification, needOtherVerdicts);
    }
  }

  needVerification.sort((a, b) => a.dtDays - b.dtDays);
  needOtherVerdicts.sort((a, b) => a.dtDays - b.dtDays);

  if (needVerification.length > 0) {
    console.log(`
----------------------------
🚀 ${fBold}May need updating verdict: reproducible or nonverifiable${fNormal}
----------------------------
`);
    for (const n of needVerification) {
      console.log(`%s: ${fHighlight}%s${fNormal} %s lacking review since %s days`,
        toLength(dateOrEmpty(n.updated), 10),
        toLength(n.file, 50),
        toLength(n.verdict === 'sourceavailable' ? 'SOURCEAVAILABLE' : n.verdict, 15),
        toLength('' + n.dtDays, 4),
        n.title);
    }
  }

  if (needOtherVerdicts.length > 0) {
    console.log(`
----------------------------
🚀 ${fBold}May need updating former verdict: nosource or obfuscated${fNormal}
----------------------------
`);
    for (const n of needOtherVerdicts) {
      console.log(`%s: ${fHighlight}%s${fNormal} %s lacking review since %s days`,
        toLength(dateOrEmpty(n.updated), 10),
        toLength(n.file, 50),
        toLength(n.verdict, 15),
        toLength('' + n.dtDays, 4),
        n.title);
    }
  }
};

const analyzeFile = (filePath, needVerification, needOtherVerdicts) => {
  const { header } = loadFromFile(filePath);
  const { meta, date, verdict } = header;
  const updated = getUpdated(header);

  if (meta !== "ok") {
    return;
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if ((verdict === 'sourceavailable') && updated && date < updated) {
    const dtDays = Math.round((new Date() - updated) / 1000 / 60 / 60 / 24);
    needVerification.push({
      updated: updated,
      file: filePath,
      verdict: verdict,
      dtDays: dtDays,
      title: getTitle(header)
    });
  } else if ((verdict === 'nosource' || verdict === 'obfuscated') && new Date(date) < sixMonthsAgo) {
    const dtDays = Math.round((new Date() - new Date(date)) / 1000 / 60 / 60 / 24);
    needOtherVerdicts.push({
      updated: date,
      file: filePath,
      verdict: verdict,
      dtDays: dtDays,
      title: getTitle(header)
    });
  }
};

searchForVerificationText();
analyzeFiles();

const fs = require("fs");
const path = require("path");

const foldersToAnalyze = ["_android", "_hardware"];
const needsRB = [];

const writeToNeedsRBFile = () => {
  fs.writeFileSync("needsRB.txt", needsRB.join("\n"), "utf-8");
};

const analyzeFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const verdictMatch = content.match(/^verdict:\s*(.*)$/m);
  const metaMatch = content.match(/^meta:\s*(.*)$/m);

  // Only proceed if verdict is one of the required values
  if (verdictMatch && metaMatch) {
    const verdict = verdictMatch[1].trim();
    const meta = metaMatch[1].trim();

    if (["reproducible", "nonverifiable", "ftbfs"].includes(verdict) &&
        meta === "ok"
      )  {
      const reviewArchiveMatch = content.match(
        /reviewArchive:\s*\n((?:\s*- date:.*\n)+)/
      );
      const updatedMatch = content.match(/updated:\s*(\d{4}-\d{2}-\d{2})/);

      if (reviewArchiveMatch && updatedMatch) {
        const updated = new Date(updatedMatch[1]);
        const dates = reviewArchiveMatch[1]
          .match(/\d{4}-\d{2}-\d{2}/g)
          .map((date) => new Date(date));
        const latestDate = new Date(Math.max.apply(null, dates));

        console.log(`\x1b[33m\x1b[1m${path.basename(filePath)}\x1b[0m`);
        console.log(
          `- the software was last updated on: ${
            updated.toISOString().split("T")[0]
          }`
        );
        console.log(
          `- the last review was performed on: ${
            latestDate.toISOString().split("T")[0]
          }`
        );
        console.log(`- the verdict was: ${verdict}`);

        if (latestDate < updated) {
          console.log(
            `${path.basename(filePath)} needs reproducibility testing.`
          );
          needsRB.push(path.basename(filePath));
        }
      }
    }
  }
};

for (const folder of foldersToAnalyze) {
  const folderPath = path.join(
    "/home/dannybuntu/Work/walletScrutinyCom",
    folder
  );
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (path.extname(file) === ".md") {
      analyzeFile(path.join(folderPath, file));
    }
  }
}

writeToNeedsRBFile();

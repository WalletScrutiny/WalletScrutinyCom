import fs from 'fs';
import { Worker } from 'worker_threads';
import os from 'os';

const fsp = fs.promises;
const mdFolders = ['_android', '_bearer', '_hardware', '_iphone', '_desktop'];

// Worker thread management
const numWorkers = Math.max(8, os.cpus().length * 2); // At least 8 workers, or 2x CPU cores
const workers = [];
const workerQueue = [];

// Stats tracking
let totalFiles = 0, processedCount = 0, errorCount = 0;
const startTime = Date.now();
const platformStats = {};

function createWorker() {
  const worker = new Worker('./scripts/twitterCardWorker.mjs');
  let isReady = false, currentJob = null;
  
  worker.on('message', (result) => {
    if (result.type === 'ready') {
      isReady = true;
      processNextJob(worker);
    } else if (result.type === 'error') {
      console.error(`Worker initialization error: ${result.error}`);
    } else {
      // Job completed
      if (result.success) {
        processedCount++;
        platformStats[result.platform] = (platformStats[result.platform] || 0) + 1;
        if (processedCount % 10 === 0) process.stdout.write('*');
      } else {
        errorCount++;
      }
      
      totalFiles--;
      currentJob = null;
      totalFiles === 0 ? showFinalSummary() : processNextJob(worker);
    }
  });
  
  worker.on('error', (error) => {
    console.error(`Worker error: ${error.message}`);
    errorCount++;
    if (currentJob) { totalFiles--; currentJob = null; }
    if (totalFiles === 0) showFinalSummary();
  });
  
  return { worker, isReady: () => isReady, setJob: (job) => { currentJob = job; } };
}

function processNextJob(worker) {
  if (workerQueue.length > 0) {
    const job = workerQueue.shift();
    const workerInfo = workers.find(w => w.worker === worker);
    if (workerInfo) workerInfo.setJob(job);
    worker.postMessage(job);
  }
}

function initializeWorkers() {
  console.log(`🚀 Initializing ${numWorkers} worker threads...`);
  
  for (let i = 0; i < numWorkers; i++) {
    workers.push(createWorker());
  }
  
  // Wait for all workers to be ready
  return new Promise((resolve) => {
    const checkReady = () => {
      if (workers.every(w => w.isReady())) {
        console.log(`✅ All ${numWorkers} workers ready!`);
        resolve();
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  });
}

function showFinalSummary() {
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const cardsPerSecond = (processedCount / (totalTime || 1)).toFixed(1);
  const hadErrors = errorCount > 0;

  console.log(`\n\n${hadErrors ? '❌ Generation Failed!' : '✅ Generation Complete!'}`);
  console.log(`📈 Summary: ${processedCount} cards generated, ${errorCount} errors`);
  console.log(`⏱️  Total time: ${totalTime}s (${cardsPerSecond} cards/sec)`);
  console.log(`🚀 Used ${numWorkers} worker threads`);
  
  if (Object.keys(platformStats).length > 0) {
    console.log('📱 By platform:');
    Object.entries(platformStats).forEach(([platform, count]) => {
      console.log(`   ${platform.padEnd(8)}: ${String(count).padStart(5)} cards`);
    });
  }
  
  // Terminate all workers
  workers.forEach(workerInfo => workerInfo.worker.terminate());

  // If any error occurred, exit with non-zero to fail the calling script
  if (hadErrors) {
    process.exit(1);
  }
}

async function processFiles() {
  const socialImagesFolderPath = 'images/social';
  if (!fs.existsSync(socialImagesFolderPath)) {
    fs.mkdirSync(socialImagesFolderPath);
  }

  // Build job queue
  for (const mdFolder of mdFolders) {
    const platform = mdFolder.substring(1);
    const files = await fsp.readdir(mdFolder);
    const outputFolderPath = `images/social/${platform}`;
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    for (const file of files) {
      if (file.endsWith('.md')) {
        totalFiles++;
        workerQueue.push({
          platform,
          mdFilesPath: mdFolder,
          file,
          outputFolderPath
        });
      }
    }
  }
  
  console.log(`📋 Queued ${totalFiles} cards for processing...`);
  
  // Start processing with all workers
  workers.forEach(workerInfo => processNextJob(workerInfo.worker));
}

// Initialize and start processing
(async () => {
  try {
    console.log('📦 Resources will be loaded in worker threads...');
    console.log('🚀 Starting Twitter card generation...');
    await initializeWorkers();
    await processFiles();
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
})();

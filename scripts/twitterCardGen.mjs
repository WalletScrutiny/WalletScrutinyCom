import fs from 'fs';
import { Worker } from 'worker_threads';
import path from 'path';
import os from 'os';

const fsp = fs.promises;
const mdFolders = ['_android', '_bearer', '_hardware', '_iphone', '_desktop'];

// Worker thread management
const numWorkers = Math.max(8, os.cpus().length * 2); // At least 8 workers, or 2x CPU cores
const workers = [];
const workerQueue = [];

const platformNames = {
  android: 'Android',
  iphone: 'iOS', 
  hardware: 'Hardware',
  bearer: 'Bearer Token',
  desktop: 'Desktop'
};

// Worker thread management functions
function createWorker() {
  const worker = new Worker('./scripts/twitterCardWorker.mjs');
  let isReady = false;
  let currentJob = null;
  
  worker.on('message', (result) => {
    if (result.type === 'ready') {
      isReady = true;
      processNextJob(worker);
      return;
    }
    
    if (result.type === 'error') {
      console.error(`Worker initialization error: ${result.error}`);
      return;
    }
    
    // Job completed
    if (result.success) {
      processedCount++;
      platformStats[result.platform] = (platformStats[result.platform] || 0) + 1;
      
      if (processedCount % 10 === 0) {
        process.stdout.write('*');
      }
    } else {
      errorCount++;
      // Errors are logged to draw-card-error.log by worker
    }
    
    totalFiles--;
    currentJob = null;
    
    if (totalFiles === 0) {
      showFinalSummary();
    } else {
      processNextJob(worker);
    }
  });
  
  worker.on('error', (error) => {
    console.error(`Worker error: ${error.message}`);
    errorCount++;
    if (currentJob) {
      totalFiles--;
      currentJob = null;
    }
    if (totalFiles === 0) {
      showFinalSummary();
    }
  });
  
  return { worker, isReady: () => isReady, setJob: (job) => { currentJob = job; } };
}

function processNextJob(worker) {
  if (workerQueue.length > 0) {
    const job = workerQueue.shift();
    const workerInfo = workers.find(w => w.worker === worker);
    if (workerInfo) {
      workerInfo.setJob(job);
    }
    worker.postMessage(job);
  }
}

function initializeWorkers() {
  console.log(`🚀 Initializing ${numWorkers} worker threads...`);
  
  for (let i = 0; i < numWorkers; i++) {
    const workerInfo = createWorker();
    workers.push(workerInfo);
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

let totalFiles = 0;
let processedCount = 0;
let errorCount = 0;
const startTime = Date.now();
const platformStats = {};

// Resources are now loaded in each worker thread
async function loadResources() {
  console.log('📦 Resources will be loaded in worker threads...');
}

// Text wrapping moved to worker threads

function wrapText(text, length) {
  const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
  return `${text}`.match(regex) || [];
}

function showFinalSummary() {
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const cardsPerSecond = (processedCount / (totalTime || 1)).toFixed(1);
  
  console.log(`\n\n✅ Generation Complete!`);
  console.log(`📈 Summary: ${processedCount} cards generated, ${errorCount} errors`);
  console.log(`⏱️  Total time: ${totalTime}s (${cardsPerSecond} cards/sec)`);
  console.log(`🚀 Used ${numWorkers} worker threads`);
  
  if (Object.keys(platformStats).length > 0) {
    console.log('📱 By platform:');
    Object.entries(platformStats).forEach(([platform, count]) => {
      console.log(`   ${platform}: ${count} cards`);
    });
  }
  
  // Terminate all workers
  workers.forEach(workerInfo => {
    workerInfo.worker.terminate();
  });
}

async function processFilesTimed() {
  console.log('🚀 Starting Twitter card generation...');
  await processFiles();
}

// CTA phrase logic moved to worker threads

// Canvas drawing moved to worker threads

// Text printing moved to worker threads

// File processing moved to worker threads

async function processFiles() {
  const socialImagesFolderPath = 'images/social';
  if (!fs.existsSync(socialImagesFolderPath)) {
    fs.mkdirSync(socialImagesFolderPath);
  }

  // Build job queue
  for (const mdFolder of mdFolders) {
    const mdFilesPath = mdFolder;
    const platform = mdFolder.substring(1);
    const files = await fsp.readdir(mdFilesPath);
    const outputFolderPath = `images/social/${platform}`;
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    for (const file of files) {
      if (file.endsWith('.md')) {
        totalFiles++;
        workerQueue.push({
          platform,
          mdFilesPath,
          file,
          outputFolderPath
        });
      }
    }
  }
  
  console.log(`📋 Queued ${totalFiles} cards for processing...`);
  
  // Start processing with all workers
  workers.forEach(workerInfo => {
    processNextJob(workerInfo.worker);
  });
}

// Initialize and start processing
(async () => {
  try {
    await loadResources();
    await initializeWorkers();
    await processFilesTimed();
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
})();
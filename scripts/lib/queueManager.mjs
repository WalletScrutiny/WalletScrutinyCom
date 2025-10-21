/**
 * Queue Manager for Auto-Verification System
 * 
 * Manages the verification queue stored in data/verification-queue.json
 * Provides utilities for adding, updating, and querying queue items
 * 
 * @module queueManager
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Queue file location (relative to project root)
const QUEUE_FILE = path.join(__dirname, '../../data/verification-queue.json');

// Ensure data directory exists
const DATA_DIR = path.dirname(QUEUE_FILE);
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Initialize empty queue structure
 */
function getEmptyQueue() {
  return {
    queue: [],
    completed: [],
    failed: [],
    skipped: []
  };
}

/**
 * Load queue from file
 * Creates new queue if file doesn't exist
 */
export function loadQueue() {
  try {
    if (!fs.existsSync(QUEUE_FILE)) {
      const emptyQueue = getEmptyQueue();
      saveQueue(emptyQueue);
      return emptyQueue;
    }
    
    const data = fs.readFileSync(QUEUE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading queue:', error.message);
    return getEmptyQueue();
  }
}

/**
 * Save queue to file
 */
export function saveQueue(queue) {
  try {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving queue:', error.message);
    throw error;
  }
}

/**
 * Generate unique ID for queue item
 */
export function generateQueueId(platform, appId, version) {
  return `${platform}:${appId}:${version}`;
}

/**
 * Add item to queue
 * Skips if item already exists in any list
 */
export function addToQueue({ appId, version, platform, priority = 'medium' }) {
  const queue = loadQueue();
  const id = generateQueueId(platform, appId, version);
  
  // Check if already exists in any list
  const allItems = [
    ...queue.queue,
    ...queue.completed,
    ...queue.failed,
    ...queue.skipped
  ];
  
  if (allItems.some(item => item.id === id)) {
    console.log(`Item already in queue: ${id}`);
    return false;
  }
  
  const item = {
    id,
    appId,
    version,
    platform,
    detectedAt: new Date().toISOString(),
    status: 'pending',
    priority,
    attempts: 0,
    lastAttempt: null,
    error: null
  };
  
  queue.queue.push(item);
  saveQueue(queue);
  console.log(`Added to queue: ${id} (priority: ${priority})`);
  return true;
}

/**
 * Update queue item status
 */
export function updateQueueStatus(id, status, metadata = {}) {
  const queue = loadQueue();
  
  // Find item in queue
  const itemIndex = queue.queue.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    console.error(`Item not found in queue: ${id}`);
    return false;
  }
  
  const item = queue.queue[itemIndex];
  item.status = status;
  item.lastAttempt = new Date().toISOString();
  
  // Update metadata
  Object.assign(item, metadata);
  
  // Move to appropriate list based on status
  if (status === 'completed') {
    queue.queue.splice(itemIndex, 1);
    queue.completed.push(item);
  } else if (status === 'failed') {
    item.attempts = (item.attempts || 0) + 1;
    
    // Move to failed list if too many attempts
    if (item.attempts >= 3) {
      queue.queue.splice(itemIndex, 1);
      queue.failed.push(item);
    }
  } else if (status === 'skipped') {
    queue.queue.splice(itemIndex, 1);
    queue.skipped.push(item);
  }
  
  saveQueue(queue);
  console.log(`Updated queue item ${id}: ${status}`);
  return true;
}

/**
 * Get pending items sorted by priority
 */
export function getPendingItems() {
  const queue = loadQueue();
  
  const priorityOrder = {
    'high': 1,
    'medium': 2,
    'low': 3
  };
  
  return queue.queue
    .filter(item => item.status === 'pending')
    .sort((a, b) => {
      // Sort by priority first
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by detection time (older first)
      return new Date(a.detectedAt) - new Date(b.detectedAt);
    });
}

/**
 * Get queue statistics
 */
export function getQueueStats() {
  const queue = loadQueue();
  
  return {
    pending: queue.queue.filter(item => item.status === 'pending').length,
    processing: queue.queue.filter(item => item.status === 'processing').length,
    completed: queue.completed.length,
    failed: queue.failed.length,
    skipped: queue.skipped.length,
    total: queue.queue.length + queue.completed.length + queue.failed.length + queue.skipped.length
  };
}

/**
 * Clear completed items older than specified days
 */
export function clearOldCompleted(daysOld = 30) {
  const queue = loadQueue();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const beforeCount = queue.completed.length;
  queue.completed = queue.completed.filter(item => {
    const itemDate = new Date(item.lastAttempt || item.detectedAt);
    return itemDate > cutoffDate;
  });
  
  const removed = beforeCount - queue.completed.length;
  if (removed > 0) {
    saveQueue(queue);
    console.log(`Cleared ${removed} completed items older than ${daysOld} days`);
  }
  
  return removed;
}

/**
 * Reset item back to pending (for retry)
 */
export function resetItemToPending(id) {
  const queue = loadQueue();
  
  // Find in failed or completed
  let item = queue.failed.find(i => i.id === id);
  let sourceList = 'failed';
  
  if (!item) {
    item = queue.completed.find(i => i.id === id);
    sourceList = 'completed';
  }
  
  if (!item) {
    console.error(`Item not found: ${id}`);
    return false;
  }
  
  // Remove from source list
  if (sourceList === 'failed') {
    queue.failed = queue.failed.filter(i => i.id !== id);
  } else {
    queue.completed = queue.completed.filter(i => i.id !== id);
  }
  
  // Reset and add back to queue
  item.status = 'pending';
  item.attempts = 0;
  item.error = null;
  queue.queue.push(item);
  
  saveQueue(queue);
  console.log(`Reset item to pending: ${id}`);
  return true;
}

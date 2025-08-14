/**
 * Secure process execution module for WalletScrutiny Nostr Verification Tool
 * Handles child process execution with security controls and timeouts
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { ProcessError, ValidationError } from './OutputFormatter.mjs';
import { Validator } from './DataLoader.mjs';

/**
 * Secure process executor with safety controls
 */
export class ProcessExecutor {
  // Security limits
  static DEFAULT_TIMEOUT = 300000; // 5 minutes
  static MAX_TIMEOUT = 600000; // 10 minutes
  static ALLOWED_COMMANDS = ['node'];
  static ALLOWED_SCRIPTS = [
    'scripts/nostr/backupNostrVerificationEvents.mjs'
  ];

  /**
   * Execute the backup script securely
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>} Resolves when backup completes
   * @throws {ProcessError} If execution fails
   * @throws {ValidationError} If script path is invalid
   */
  static async executeBackupScript(timeout = this.DEFAULT_TIMEOUT) {
    const scriptPath = 'scripts/nostr/backupNostrVerificationEvents.mjs';
    
    // Validate timeout
    if (timeout > this.MAX_TIMEOUT) {
      throw new ValidationError(`Timeout too large (max ${this.MAX_TIMEOUT}ms)`, 'timeout');
    }

    // Validate and secure the script path
    const secureScriptPath = await this._validateScriptPath(scriptPath);
    
    // Check if script exists
    if (!fs.existsSync(secureScriptPath)) {
      throw new ProcessError(`Backup script not found: ${scriptPath}`, 'node', null);
    }

    // Execute with security controls
    return this._executeSecurely('node', [secureScriptPath], {
      timeout,
      cwd: process.cwd(),
      stdio: 'inherit'
    });
  }

  /**
   * Validate script path for security
   * @private
   * @param {string} scriptPath - Script path to validate
   * @returns {string} Validated absolute path
   * @throws {ValidationError} If path is invalid
   */
  static async _validateScriptPath(scriptPath) {
    // Check if script is in allowed list
    if (!this.ALLOWED_SCRIPTS.includes(scriptPath)) {
      throw new ValidationError(`Script not in allowed list: ${scriptPath}`, 'scriptPath');
    }

    // Validate file path for security
    try {
      const validatedPath = Validator.validateFilePath(scriptPath);
      
      // Ensure path is within project directory
      const projectRoot = process.cwd();
      const absoluteScriptPath = path.resolve(projectRoot, scriptPath);
      
      if (!absoluteScriptPath.startsWith(projectRoot)) {
        throw new ValidationError('Script path outside project directory', 'scriptPath');
      }

      return absoluteScriptPath;
      
    } catch (error) {
      throw new ValidationError(`Invalid script path: ${error.message}`, 'scriptPath');
    }
  }

  /**
   * Execute command securely with timeout and validation
   * @private
   * @param {string} command - Command to execute
   * @param {Array} args - Command arguments
   * @param {Object} options - Execution options
   * @returns {Promise<void>} Resolves when execution completes
   * @throws {ProcessError} If execution fails
   */
  static async _executeSecurely(command, args, options = {}) {
    // Validate command
    if (!this.ALLOWED_COMMANDS.includes(command)) {
      throw new ProcessError(`Command not allowed: ${command}`, command, null);
    }

    // Sanitize arguments
    const safeArgs = args.map(arg => Validator.sanitizeForShell(arg));

    // Set up secure execution options
    const secureOptions = {
      cwd: options.cwd || process.cwd(),
      stdio: options.stdio || 'pipe',
      timeout: options.timeout || this.DEFAULT_TIMEOUT,
      // Security: Don't inherit environment variables that might contain secrets
      env: {
        PATH: process.env.PATH,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    };

    return new Promise((resolve, reject) => {
      let completed = false;
      let timeoutId;

      // Set up timeout
      if (secureOptions.timeout > 0) {
        timeoutId = setTimeout(() => {
          if (!completed) {
            completed = true;
            child.kill('SIGTERM');
            
            // Force kill after additional timeout
            setTimeout(() => {
              if (!child.killed) {
                child.kill('SIGKILL');
              }
            }, 5000);
            
            reject(new ProcessError(
              `Process timeout after ${secureOptions.timeout}ms`, 
              command, 
              null
            ));
          }
        }, secureOptions.timeout);
      }

      // Spawn child process
      const child = spawn(command, safeArgs, {
        cwd: secureOptions.cwd,
        stdio: secureOptions.stdio,
        env: secureOptions.env
      });

      // Handle completion
      child.on('close', (code, signal) => {
        if (completed) return;
        completed = true;
        
        if (timeoutId) clearTimeout(timeoutId);

        if (signal) {
          reject(new ProcessError(
            `Process killed by signal: ${signal}`, 
            command, 
            null
          ));
        } else if (code === 0) {
          resolve();
        } else {
          reject(new ProcessError(
            `Process exited with code: ${code}`, 
            command, 
            code
          ));
        }
      });

      // Handle spawn errors
      child.on('error', (error) => {
        if (completed) return;
        completed = true;
        
        if (timeoutId) clearTimeout(timeoutId);
        
        reject(new ProcessError(
          `Process spawn error: ${error.message}`, 
          command, 
          null
        ));
      });

      // Handle stdio errors if not inherited
      if (secureOptions.stdio !== 'inherit') {
        child.stdout?.on('error', () => {
          // Ignore stdout errors to prevent crashes
        });
        
        child.stderr?.on('error', () => {
          // Ignore stderr errors to prevent crashes
        });
      }
    });
  }

  /**
   * Check if backup script exists and is executable
   * @returns {boolean} True if script is available
   */
  static isBackupScriptAvailable() {
    try {
      const scriptPath = 'scripts/nostr/backupNostrVerificationEvents.mjs';
      const absolutePath = path.resolve(process.cwd(), scriptPath);
      return fs.existsSync(absolutePath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get information about the backup script
   * @returns {Object} Script information
   */
  static getBackupScriptInfo() {
    const scriptPath = 'scripts/nostr/backupNostrVerificationEvents.mjs';
    const absolutePath = path.resolve(process.cwd(), scriptPath);
    
    try {
      const stats = fs.statSync(absolutePath);
      return {
        path: scriptPath,
        exists: true,
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
    } catch (error) {
      return {
        path: scriptPath,
        exists: false,
        error: error.message
      };
    }
  }
}
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

class Config {
  constructor() {
    try {
      const configPath = path.resolve(__dirname, '../../config/environment.yaml');
      const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
      
      // Get environment from NODE_ENV, default to development
      const env = process.env.NODE_ENV || 'development';
      this.currentConfig = config[env];

      if (!this.currentConfig) {
        throw new Error(`No configuration found for environment: ${env}`);
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      process.exit(1);
    }
  }

  get(key) {
    return this.currentConfig[key];
  }

  getAll() {
    return { ...this.currentConfig };
  }
}

// Export a singleton instance
module.exports = new Config(); 
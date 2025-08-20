#!/usr/bin/env node

// Development startup script
// This script helps you run both the React app and embed server in development

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting LuxLLM Development Environment...\n');

// Start React app (Vite dev server)
console.log('📱 Starting React app (Vite dev server)...');
const reactApp = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Wait a bit for React app to start
setTimeout(() => {
  console.log('\n🔧 Starting Embed API server...');
  const embedServer = spawn('npm', ['run', 'dev:server'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development servers...');
    reactApp.kill('SIGINT');
    embedServer.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development servers...');
    reactApp.kill('SIGTERM');
    embedServer.kill('SIGTERM');
    process.exit(0);
  });

}, 3000);

console.log('\n✅ Development environment starting...');
console.log('📱 React app will be available at: http://localhost:8080');
console.log('🔧 Embed API will be available at: http://localhost:3001');
console.log('🛑 Press Ctrl+C to stop all servers\n');

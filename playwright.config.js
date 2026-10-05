import {defineConfig} from '@playwright/test';
import process from 'node:process';
export default defineConfig({testDir:'tests/e2e',use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',channel:process.env.PLAYWRIGHT_CHANNEL || undefined},webServer:{command:'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --configLoader runner',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI}});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env using dotenv
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = process.env.Gemini_api_key || env.Gemini_api_key || '';

  return {
    plugins: [react()],
    define: {
      'process.env.Gemini_api_key': JSON.stringify(apiKey),
      'import.meta.env.Gemini_api_key': JSON.stringify(apiKey),
    },
    envPrefix: ['VITE_', 'Gemini_'],
  };
});

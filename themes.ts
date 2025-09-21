import { Theme } from './types';

export const themes: Theme[] = [
  {
    id: 'cosmic-beach',
    name: 'Cosmic Beach',
    background: 'bg-gradient-to-br from-gray-900 via-purple-900 to-orange-800',
    variables: {
      '--special-color': '#fb923c', // orange-400
      '--operator-color': '#22d3ee', // cyan-400
      '--number-color': '#ffffff', // white
      '--equal-bg': '#06b6d4', // cyan-500
      '--equal-bg-hover': '#22d3ee', // cyan-400
      '--equal-bg-active': '#0891b2', // cyan-600
      '--equal-color': '#0f172a', // slate-900
      '--text-color-display': '#ffffff', // white
      '--text-color-display-secondary': 'rgba(255, 255, 255, 0.7)',
      '--history-clear-color': '#22d3ee', // cyan-400
      '--history-clear-color-hover': '#67e8f9', // cyan-300
    },
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    background: 'bg-gradient-to-br from-gray-900 via-emerald-900 to-green-800',
    variables: {
      '--special-color': '#fcd34d', // amber-300
      '--operator-color': '#34d399', // emerald-400
      '--number-color': '#ffffff', // white
      '--equal-bg': '#10b981', // emerald-500
      '--equal-bg-hover': '#34d399', // emerald-400
      '--equal-bg-active': '#059669', // emerald-600
      '--equal-color': '#0f172a', // slate-900
      '--text-color-display': '#ffffff', // white
      '--text-color-display-secondary': 'rgba(255, 255, 255, 0.7)',
      '--history-clear-color': '#34d399', // emerald-400
      '--history-clear-color-hover': '#6ee7b7', // emerald-300
    },
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    background: 'bg-gradient-to-br from-slate-900 via-pink-900 to-rose-700',
    variables: {
      '--special-color': '#fbbf24', // amber-400
      '--operator-color': '#f472b6', // pink-400
      '--number-color': '#ffffff', // white
      '--equal-bg': '#ec4899', // pink-500
      '--equal-bg-hover': '#f472b6', // pink-400
      '--equal-bg-active': '#db2777', // pink-600
      '--equal-color': '#ffffff', // white
      '--text-color-display': '#ffffff', // white
      '--text-color-display-secondary': 'rgba(255, 255, 255, 0.7)',
      '--history-clear-color': '#f472b6', // pink-400
      '--history-clear-color-hover': '#f9a8d4', // pink-300
    },
  },
   {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    background: 'bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800',
    variables: {
      '--special-color': '#f59e0b', // amber-500
      '--operator-color': '#60a5fa', // blue-400
      '--number-color': '#ffffff',
      '--equal-bg': '#3b82f6', // blue-500
      '--equal-bg-hover': '#60a5fa', // blue-400
      '--equal-bg-active': '#2563eb', // blue-600
      '--equal-color': '#ffffff',
      '--text-color-display': '#ffffff',
      '--text-color-display-secondary': 'rgba(255, 255, 255, 0.7)',
      '--history-clear-color': '#60a5fa', // blue-400
      '--history-clear-color-hover': '#93c5fd', // blue-300
    },
  },
];

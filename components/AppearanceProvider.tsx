"use client";
import { useEffect } from "react";

export default function AppearanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const settings = JSON.parse(localStorage.getItem('general_settings_v1') || '{}');
    
    // Reset dark theme to light theme
    if (settings.theme === 'dark') {
      settings.theme = 'light';
      localStorage.setItem('general_settings_v1', JSON.stringify(settings));
    }
    
    // Font size
    if (settings.fontSize) {
      document.body.style.fontSize = settings.fontSize + 'px';
    } else {
      document.body.style.fontSize = '';
    }
    // Accent color
    if (settings.color) {
      document.body.style.setProperty('--primary', settings.color);
    }
    // Theme (handled by next-themes, but fallback for system)
    if (settings.theme) {
      document.documentElement.classList.remove('light', 'dark');
      if (settings.theme === 'dark') document.documentElement.classList.add('dark');
      else if (settings.theme === 'light') document.documentElement.classList.remove('dark');
      // system: do nothing, let next-themes handle
    } else {
      // Default to light theme if no theme is set
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return <>{children}</>;
} 
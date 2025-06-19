"use client";
import { useEffect } from "react";

export default function AppearanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const settings = JSON.parse(localStorage.getItem('general_settings_v1') || '{}');
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
    }
  }, []);
  return <>{children}</>;
} 
'use client';

import type { LucideProps } from 'lucide-react';
import { LayoutDashboard, Library, Settings, WifiZero } from 'lucide-react';
import React from 'react';

const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Settings: Settings,
  LayoutDashboard: LayoutDashboard,
  Library: Library,
};

export const DynamicIcon = ({ name, ...props }: { name: string } & LucideProps) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return <WifiZero {...props} />;
  }

  return <IconComponent {...props} />;
};
import React from 'react';

export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  AGGREGATION = 'AGGREGATION',
  QUERY = 'QUERY',
  FAMILY_GRAPH = 'FAMILY_GRAPH'
}

export interface NavItem {
  id: ModuleType;
  label: string;
  icon: React.ReactNode;
}

export interface User {
  name: string;
  rank: string;
  department: string;
  avatarUrl: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  isIncrease: boolean;
}
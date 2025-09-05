import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout hideNavigation title="Public Area">
      {props.children}
    </DashboardLayout>
  );
}  

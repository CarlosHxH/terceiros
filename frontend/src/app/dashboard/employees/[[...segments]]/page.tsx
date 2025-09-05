'use client';
import * as React from 'react';

import { useParams } from 'next/navigation';

import { Crud } from '@toolpad/core/Crud';
import { employeesDataSource, Employee, employeesCache } from '../../../../data/employees';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '../../../auth';


export default function EmployeesCrudPage() {
  
  const params = useParams();
  const [employeeId] = params.segments ?? [];
  
  
  const session = await auth();
        const currentUrl = (await headers()).get('referer') || process.env.AUTH_URL || 'http://localhost:3000';
  
        if (!session) {
          const redirectUrl = new URL('/auth/signin', currentUrl);
          redirectUrl.searchParams.set('callbackUrl', currentUrl);
      
          redirect(redirectUrl.toString());
        }
        

  return (
    <Crud<Employee>
      dataSource={employeesDataSource}
      dataSourceCache={employeesCache}
      rootPath="/employees"
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
      pageTitles={{
        show: `Employee ${employeeId}`,
        create: 'New Employee',
        edit: `Employee ${employeeId} - Edit`,
      }}
    />
  );
}

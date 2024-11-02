import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar/Sidebar';

const DashboardLayout = () => {
  return (
    <div className='relative min-h-screen md:flex'>
      {/* sidebar */}
      <Sidebar></Sidebar>
      {/* Outlet = Dynamic COntent*/}
      <div className='flex-1 md:ml-64'>
      <div className="p-5">
      <Outlet></Outlet>
      </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
import Navbar from '@/components/Navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import DarkMode from '@/DarkMode';

const MainLayout = () => {
  return (
    <ThemeProvider>
      <div className='flex flex-col min-h-screen dark:bg-gray-900 dark:text-white'>
        <Navbar/>
        <DarkMode /> {/* Add DarkMode component here */}
        <div className='flex-1 mt-16'>
          <Outlet/>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
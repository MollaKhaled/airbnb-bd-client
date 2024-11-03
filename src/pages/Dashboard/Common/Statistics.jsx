import React from 'react'
import useRole from '../../../hooks/useRole'
import AdminStatistics from '../../../Statistics/Admin/AdminStatistics';
import HostStatistics from '../../../Statistics/Host/HostStatistics';
import GuestStatistics from '../../../Statistics/Guest/GuestStatistics';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';

const Statistics = () => {
  const[role, isLoading] = useRole();
  if(isLoading) return <LoadingSpinner></LoadingSpinner>
  return (
    <>
      {role ==='admin' && <AdminStatistics></AdminStatistics>}
      {role ==='host' && <HostStatistics></HostStatistics>}
      {role ==='guest' && <GuestStatistics></GuestStatistics>}
    </>
  )
}

export default Statistics

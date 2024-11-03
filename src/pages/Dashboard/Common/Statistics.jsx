import React from 'react'
import useRole from '../../../hooks/useRole'
import AdminStatistics from '../../../Statistics/Admin/AdminStatistics';

const Statistics = () => {
  const[role, isLoading] = useRole();
  return (
    <div>
      {role ==='admin' && <AdminStatistics></AdminStatistics>}
    </div>
  )
}

export default Statistics

import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';


 const options = {
  title: 'Sales Over Time',
  curveType: 'function',
  legend: { position: 'bottom' },
  series: [{ color: '#F43F5E' }],
}
const SalesLineChart = ({ data =[]}) => {
  const [loading , setLoading] = useState(true);
  useEffect(()=>{
    setTimeout(()=> setLoading(false), 2000)
  }, []);
  

  return (
    <>
    {loading ? (<LoadingSpinner></LoadingSpinner>):
        data.length > 1 ? 
       ( <Chart chartType='LineChart' width='100%' data={data} options={options} />):
        (<p>Not enough data available for this section</p>)
      
       }
    </>
  )
}

export default SalesLineChart;
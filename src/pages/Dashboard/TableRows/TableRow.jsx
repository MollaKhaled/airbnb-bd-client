import { format } from 'date-fns'
import { useState } from 'react'
import DeleteModal from '../../../components/Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'

const TableRow = ({ booking, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  const closeModal =() =>{
    setIsOpen(false);
  };

   // Delete Item
   const {mutateAsync} = useMutation({
    mutationFn: async (id) => {
      const {data} = await axiosSecure.delete(`/booking/${id}`);
      return data;
    },
    onSuccess:async(data)=> {
      console.log(data);
      toast.success('Booking Canceled')
      refetch();
      // change Room booked status back to false
      await axiosSecure.patch(`/room/status/${booking?.roomId}`, 
        {status:false});
    }
  })
  // Handle Delete
  const handleDelete =async id => {
    console.log(id);
    try {
      await mutateAsync(id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={booking?.image}
                className='mx-auto object-cover rounded h-10 w-15 '
              />
            </div>
          </div>
          <div className='ml-3'>
            <p className='text-gray-900 whitespace-no-wrap'>{booking?.title}</p>
          </div>
        </div>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={booking?.guest?.image}
                className='mx-auto object-cover rounded h-10 w-15 '
              />
            </div>
          </div>
          <div className='ml-3'>
            <p className='text-gray-900 whitespace-no-wrap'>
              {booking?.guest?.name}
            </p>
          </div>
        </div>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${booking?.price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>
          {format(new Date(booking?.from), 'P')}
        </p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>
          {format(new Date(booking?.to), 'P')}
        </p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <button
        onClick={()=> setIsOpen(true)}
        className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Cancel</span>
       
        </button>
           {/* DeleteMOdal */}
           <DeleteModal
           isOpen={isOpen}
           closeModal={closeModal}
           handleDelete={handleDelete}
           id={booking?._id}
          ></DeleteModal>
      </td>
    </tr>
  )
}

export default TableRow

import { useState } from 'react';
import AddRoomForm from '../../../components/Form/AddRoomForm';
import useAuth from '../../../hooks/useAuth';
import { imageUpload } from '../../../api/utils';
import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {useMutation} from '@tanstack/react-query'

const AddRoom = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState('Upload a image');


  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  ]);
  // date range handler
  const handleDates = (item) => {
    console.log(item)
    setDates([item.selection]);
  };

   const { mutateAsync } = useMutation ( {
    mutationFn: async roomData => {
      const { data } = await axiosSecure.post(`/room`, roomData);
      return data;
    },
    onSuccess: () => {
      console.log('Data Saved Successfully');
      toast.success('Room Added SuccessFully');
      navigate('/dashboard/my-listings')
      setLoading(false);
    }
   })

// Form handler

const handleSubmit = async(e) =>{
  e.preventDefault();
  setLoading(true);
  const form = e.target;
  const location = form.location.value;
  const category = form.category.value;
  const title = form.title.value;
  const to = dates[0].endDate;
  const from = dates[0].startDate;
  const price = form.price.value;
  const guests = form.total_guest.value;
  const bathrooms = form.bathrooms.value;
  const description = form.description.value;
  const bedrooms = form.bedrooms.value;
  const image = form.image.files[0];
  const host = {
    name:user?.displayName,
    image:user?.photoURL,
    email:user?.email,
  }

  try {
    const image_url =  await imageUpload(image);
    const roomData = {
    location, 
    category, 
    title, 
    to, 
    from, 
    price, 
    guests, 
    bathrooms, 
    bedrooms, 
    host, 
    description, 
    image:image_url,
   }
    console.table(roomData);

  //  Post request to server
  await mutateAsync(roomData)

  } catch (error) {
    console.log(error);
    toast.error(error.message);
    setLoading(false);
  }
  
}
// handle image change
  const handleImage = image =>{
    setImagePreview(URL.createObjectURL(image));
    setImageText(image.name);
  }

  return (
   <>
      <Helmet>
        <title>Add Room | Dashboard</title>
      </Helmet>
      <AddRoomForm 
      dates={dates} 
      handleDates={handleDates} 
      handleSubmit={handleSubmit}
      setImagePreview={setImagePreview}
      imagePreview = {imagePreview}
      handleImage = {handleImage}
      imageText= {imageText}
      loading = {loading}
      />
   </>
  );
};

export default AddRoom;
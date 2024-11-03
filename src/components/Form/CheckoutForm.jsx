import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import './CheckoutForm.css'
import useAuth from '../../hooks/useAuth'
import { ImSpinner9 } from 'react-icons/im'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const CheckoutForm = ({ bookingInfo, closeModal, refetch }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [cardError, setCardError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() =>{
   if( bookingInfo?.price > 1){
    getClientSecret({price:bookingInfo?.price})
   }
  },[])
  // get clientSecret
  const getClientSecret= async(price) =>{
    const {data} =await axiosSecure.post(`/create-payment-intent`, price);
    console.log(data);
    setClientSecret(data.clientSecret);
  }

  // Create Payment Intent

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const card = elements.getElement(CardElement)
    if (card === null) {
      return
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })

    if (error) {
      console.log('error', error)
      setCardError(error.message)
    } else {
      setCardError('')
      console.log('payment method', paymentMethod)
    }

    setProcessing(true);

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email,
            name: user?.displayName,
          },
        },
      })

    if (confirmError) {
      console.log(confirmError)
      setCardError(confirmError.message)
    }

    console.log('payment intent', paymentIntent)

    if (paymentIntent.status === 'succeeded') {
   
      const paymentInfo = {
        ...bookingInfo,
        roomId:bookingInfo._id,
        transactionId: paymentIntent.id,
        date: new Date(),
      }
      delete paymentInfo._id;
      console.log(paymentInfo);
      setProcessing(false);
      try {
           // save payment information to the server
        const {data}=   await axiosSecure.post('/booking', paymentInfo);
        console.log(data)
          // Update room status in db
           await axiosSecure.patch(`/room/status/${bookingInfo._id}`, {status:true});
          //  await axiosSecure.patch(`/room/status/${bookingInfo._id}`, {status:false});
          
          // update ui
          refetch();
          closeModal();
          toast.success('Room Booked Successfully')
          navigate('/dashboard/my-bookings');
        
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <form className='my-2' onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        <div className='flex mt-2 justify-around'>
          <button
           onClick={closeModal}
            type='button'
            className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
           
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={!stripe || !clientSecret || processing}
            className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
          >
            {processing ? (
              <ImSpinner9 className='m-auto animate-spin' size={24} />
            ) : (
              `Pay ${bookingInfo.price}$`
            )}
          </button>
        </div>
      </form>
      {cardError && <p className='text-red-600 ml-8'>{cardError}</p>}
    </>
  )
}

export default CheckoutForm

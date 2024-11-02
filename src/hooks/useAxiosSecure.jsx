import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

// Create an instance of Axios with base URL from environment variables
export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = axiosSecure.interceptors.response.use(
      res => {
        return res; // Return response as-is if no error
      },
      async error => {
        console.log('Error tracked in the interceptor:', error.response);

        // Handle specific status codes
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            await logOut();
            navigate('/login');
          } else {
            // Handle other status codes if needed (optional)
            console.error(`Error Status: ${error.response.status}, Data:`, error.response.data);
          }
        } else {
          // Handle network errors or server unreachable scenarios
          console.error("Network or Server Error:", error.message);
        }

        return Promise.reject(error); // Reject the promise to propagate the error
      }
    );

    // Cleanup interceptor on component unmount
    return () => {
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;

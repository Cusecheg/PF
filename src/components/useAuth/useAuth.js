import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

export default function  useAuth(){
    const router = useRouter();
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const authToken = localStorage.getItem('authToken');
  
      if(!authToken){
          router.push('/');
          return;
      }
  
      const decodedToken = jwt.decode(authToken);
    //   console.log(decodedToken);
  
      if(!decodedToken || !decodedToken.exp){
          localStorage.removeItem('authToken');
          router.push('/');
          return;
      }
  
      const tokenExpiration = jwt.decode(authToken).exp;
      const currentTimestamp = Math.floor(Date.now() / 1000);
  
      if (tokenExpiration < currentTimestamp){
          localStorage.removeItem('authToken');
          router.push('/');
          return;
      }
      setAuthenticated(true);
    }, []);

    return isAuthenticated;
}
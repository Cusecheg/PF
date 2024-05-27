import LoginPage from "./Login/login";
import useAuth from "@/components/useAuth/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Home() {
const router = useRouter();
const isAuthenticated = useAuth();

useEffect(()=>{
  async function redirect(){
    if (isAuthenticated){
      await router.push('/Home');
    }
  }
  redirect();
}, [isAuthenticated])

  return (
    <>
       <LoginPage/>
    </>
  );
}


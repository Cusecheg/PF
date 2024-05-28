import { useState } from 'react';
import { useRouter } from 'next/router';


export default function LoginPage() {

  const router = useRouter();
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('email', data.email)
        router.push('/Home');
        // console.log(data.message)
      } else {
        // Si la respuesta no es satisfactoria, lanzar un error y manejarlo
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      setError(error.message);
      setTimeout(()=>{
        setError("")
      }, 3000)
    }
  }

  return (
    <main className='grid place-items-center h-screen'>
      <div className='grid grid-rows-2 gap-3 place-items-center w-full  max-w-72'>
        <img src='/user.svg' alt='Image login'style={{ width: "50px", height:"50px"}} />
        <form className=" text-black grid grid-rows-2 place-items-center gap-8 w-full"
        onSubmit={handleSubmit}>
          <input className='p-2 rounded-2xl  w-52 transition-all focus:w-full focus:outline-none'
          type="email" name="email" placeholder="Email" required />
          <input className='p-2 rounded-2xl  w-52 transition-all focus:w-full focus:outline-none'
          type="password" name="password" placeholder="Senha" required />
          <button className='text-white p-2 rounded-2xl border w-52 transition-all  hover:bg-zinc-700 hover:-translate-y-1'
          type="submit">
            Iniciar sessão</button>
        </form>
        {error && 
        <p className='text-white'>
          {error}</p>}
        </div>
    </main>
   
    
  );
}

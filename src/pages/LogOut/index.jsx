
import { useRouter } from 'next/router';

export default function LogOut() {
const router = useRouter();

const handleLogOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    
    router.push('/')
}


    return(
        <>
        <img
        src="/logout.svg"
        alt='Image LogOut'
        onClick={handleLogOut}
        className='hover:-translate-y-1 cursor-pointer hover:bg-zinc-500 rounded'
        style={{ width: "25px", height: "25px"}}
        />
        </>
    )
}

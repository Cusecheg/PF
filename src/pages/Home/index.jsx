import useAuth from "@/components/useAuth/useAuth";
import { useEffect, useState } from "react";
import LogOut from "../LogOut";
import { Switch } from "@mui/material";

export default function Hola() {
  const isAuthenticated = useAuth();
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);
  const [catalogId, setCatalogId] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchData() {
        try {

          const email = localStorage.getItem('email');

          if (!email) {
            throw new Error("Email not found in localStorage");
          }
          const url = `api/ifood/getCategories?email=${encodeURIComponent(email)}`;

          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            const newItems = data.categories.flatMap(category => category.items || category.pizza.toppings).map( item =>({
              ...item,
              isChecked: item.status  === "AVAILABLE"
          
            }));
            // console.log(data);
            setCatalogId(data.catalogId);
            setItems(newItems);
            setResults(newItems);
          } else {
            const data = await response.json();
            throw new Error(data.error);
          }
        } catch (error) {
          console.error(error);
          // alert(error.message);
        }
      }
      fetchData();
    }
  }, [isAuthenticated]);
  
  const handleChangeStatus = async (index, id, status, externalCode) => {

    const newStatus = status === "AVAILABLE"? "UNAVAILABLE" : "AVAILABLE";
    const email = localStorage.getItem('email');

    const bodyData = {
      email: email,
      catalogoId: catalogId,
      itemId: id,
      status: newStatus
    }

    if (externalCode){
      bodyData.externalCode = externalCode
    };
    
    try{
      const response = await fetch('/api/ifood/updateProductStatus',{
        method: "PATCH",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify(bodyData)
        
      });

      if (response.ok){
      setResults(prevResults => {
        const updatedResults = [...prevResults];
        updatedResults[index].isChecked = !updatedResults[index].isChecked;
        return updatedResults;
      });
    }else{
      const errorData = response.json();
      console.error("Failed to update status:", errorData)
    }
  }catch(error){
    console.error("Failed to update status", error)
  }
  };

  const handleChange = (e) => {
    const { value } = e.currentTarget;

    const filteredResults = items.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase()));

    setResults(filteredResults);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="grid mt-24 place-items-center bg-black text-white">
      <nav className="absolute top-4 right-4">
        <LogOut />
      </nav>
      <section className="grid place-items-center gap-5 max-w-2xl w-full">
        <input className="bg-zinc-500  w-80 opacity-50 transition-all  rounded-lg p-1 focus:w-96 focus:opacity-100"
          onChange={handleChange}
        />

        <ul className="grid gap-4 bg-zinc-500 w-3/4 rounded-lg">
          {results.map((result, index) => (
            <li className="grid p-1 text-center place-items-center grid-cols-2" key={index}>
              <p className="p-1">{result.name}</p>
              <div className="grid p-1 place-items-center grid-cols-2">
                <img className="rounded-md" alt={`Imagen de ${result.name}`} src={result.imagePath} />
                <Switch
                  checked={result.isChecked}
                  onChange={() => handleChangeStatus(index, result.id, result.status, result.externalCode)}
                  inputProps={{ 'aria-label': 'controlled' }}
                
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

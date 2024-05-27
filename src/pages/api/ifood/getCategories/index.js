import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getCategories(req, res) {
  if (req.method === 'GET') {
    try {
      // Obtener el email del localStorage
      const { email } = req.query
   

      // Buscar los datos del usuario en el banco de datos
      const userData = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }

      // Obtener el merchantId y el accessToken
      const merchant_1 = userData.merchant_1;
      const tokenIfood_1 = userData.tokenIfood_1;

      // Realizar la solicitud al backend de iFood para obtener las categorías
      const url = `${process.env.API_IFOOD_URL}/catalog/v2.0/merchants/${merchant_1}/catalogs`;
      let catalogId;

      // Obtener el catalogId
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${tokenIfood_1}`,
            Accept: 'application/json',
          },
        });

        if (response.status === 200) {
          catalogId = response.data[0].catalogId;
        } else {
          throw new Error('Error fetching catalog ID');
        }
    
      } catch (error) {
        return res.status(500).json({ 
            error: error.message,
            msg: 'Error fetching catalog ID'
        });
      }

      // Obtener las categorías
      try {
        const response = await axios.get(`${url}/${catalogId}/categories`, {
          headers: {
            Authorization: `Bearer ${tokenIfood_1}`,
            Accept: "application/json",
          },
        });

        if (response.status === 200) {
          return res.status(200).json({
            catalogId: catalogId,
            categories: response.data,
          });
          
        } else {
          throw new Error("Error fetching categories");
        }
      } catch (error) {
        return res.status(500).json({ 
            error: error.message, 
            msg: 'Error fetching categories'
        });
      }

    } catch (error) {
      console.error("Unexpected error:", error.message);
   
    }

  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}


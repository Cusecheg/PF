import axios from "axios";


// GET PRODUCTS FROM API IFOOD

export default async function getProducts(req, res) {
  if (req.method === 'GET') {
      const url = `${process.env.API_IFOOD_URL}/catalog/v2.0/merchants/${process.env.MERCHANT_ID}/products?limit=10&page=1`;

      try {
          const response = await axios.get(url, {
              headers: {
                  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                  Accept: 'application/json',
              },
          });
          console.log(response.data);
          res.status(200).json(response.data); // Devuelve la respuesta con los datos recibidos
      } catch (error) {
          console.error('Error fetching products:', error.response ? error.response.data : error.message);
          res.status(500).json({ error: 'Error fetching products' }); // Devuelve una respuesta de error
      }
  } else {
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}

//CHANGE STATUS OF PRODUCTS

// export const changeProductStatus = async (merchantId, authToken, itemId, status) => {
//     const url = `https://merchant-api.ifood.com.br/catalog/v2.0/merchants/${merchantId}/products/status`;

//     const data = [{
//         "externalCode": itemId,
//         "status": status,
//         "resources": ["ITEM"]
//     }];

//     try {
//         const response = await axios.patch(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error changing product status:', error.response ? error.response.data : error.message);
//     }
// };
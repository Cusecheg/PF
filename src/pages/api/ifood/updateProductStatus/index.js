import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para cambiar el estado de los productos
export default async function updateProductStatus(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
   
    const { email, catalogoId, itemId, status, externalCode } = req.body;

    try {
        // Buscar al usuario en la base de datos por su correo electrónico
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // Verificar si se encontró al usuario
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Utilizar los datos del usuario (merchant_id y access_token) en tu lógica
        const { merchant_1, tokenIfood_1 } = user;

        const url = `${process.env.API_IFOOD_URL}/catalog/v2.0/merchants/${merchant_1}/products/status`;

        const data = [{
            "productoId": itemId,
            "status": status,
            'resource': [
                "items",
                "options",
            ],
            "catalogoId": catalogoId,
        }];

        if (externalCode){
            data[0].externalCode = externalCode;
        }

        const response = await axios.patch(url, data, {
            headers: {
                'Authorization': `Bearer ${tokenIfood_1}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error changing items status:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            error: error.response ? error.response.data : error.message,
            msg: 'Error changing items status'
        });
    }
}

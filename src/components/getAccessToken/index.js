import axios from "axios";

export default async function getAccessToken(clientId, clientSecret) {
    const data = new URLSearchParams({
        grantType: 'client_credentials',
        clientId: clientId,
        clientSecret: clientSecret,
        authorizationCode: "",
        authorizationCodeVerifier: "",
        refreshToken: ""
    });
    console.log(clientId, clientSecret);
    try {
        const response = await axios.post(process.env.API_AUTHENTICATION_URL, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
        });

        return response.data; // Devuelve los datos recibidos
    } catch (error) {
        console.error('Error fetching accessToken:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching accessToken'); // Lanza un error para manejarlo en la función de llamada
    }
}

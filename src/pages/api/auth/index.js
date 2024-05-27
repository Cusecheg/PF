import { signIn } from "@/auth";

export default async function handler(req, res) {
  try {
    const credentials = req.body;
    const signInResponse = await signIn(credentials);

    if (signInResponse.success === true) {
      // Si la autenticación fue exitosa, envía un código de estado 200 y la respuesta JSON al frontend
      res.status(200).json({ message: signInResponse.message, user: signInResponse.user, email: signInResponse.user.email, token: signInResponse.token });
    } else {
      // Si hubo un error en la autenticación, envía un código de estado 401 y la respuesta JSON al frontend
      res.status(401).json({ error: signInResponse.error });
    }
  } catch (error) {
    // Si ocurre un error inesperado, envía un código de estado 500 y la respuesta JSON al frontend
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
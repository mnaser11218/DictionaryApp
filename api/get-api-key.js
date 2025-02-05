export default function handler(req, res) {
    // Access the environment variable
    const apiKey = process.env.MY_API_KEY;
    
    // Send the API key as a response (you can return any other data as needed)
    res.status(200).json({ apiKey });
  }
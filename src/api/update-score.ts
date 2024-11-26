import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { score } = req.body;
  
    try {
      // Example query to update scores in your database (adjust as necessary)
      await query('UPDATE matches SET predicted_score = $1 WHERE id = 1', [score]);
      res.status(200).json({ message: 'Score updated successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update score.' });
    }
  }
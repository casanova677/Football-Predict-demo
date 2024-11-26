import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await query('INSERT INTO users (username, password) VALUES ($1, $2)', [
        username,
        hashedPassword,
      ]);
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(400).json({ error: 'User registration failed.' });
    }
  }
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { username, password } = req.body;
  
    try {
      const user = await query('SELECT * FROM users WHERE email = $1', [username]);
    
      if (!user.length) return res.status(404).json({ error: 'User not found' });
  
      const valid = await bcrypt.compare(password, user[0].password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user[0].id, username }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
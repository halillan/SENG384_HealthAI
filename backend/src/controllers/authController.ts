import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import prisma from '../config/prisma';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role, specialization, institution } = req.body;

    // FR-01: Domain Validation (.edu or .edu.tr)
    if (!email.endsWith('.edu') && !email.endsWith('.edu.tr')) {
      return res.status(400).json({ error: 'Only .edu or .edu.tr domains are allowed.' });
    }

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(400).json({ error: authError?.message || 'Supabase Auth Failed' });
    }

    // 2. Create the user in our PostgreSQL Prisma Database
    const newUser = await prisma.user.create({
      data: {
        supabaseAuthId: authData.user.id,
        email,
        fullName,
        role,
        specialization,
        institution
      }
    });

    res.status(201).json({
      message: 'Registration successful',
      user: newUser,
      session: authData.session
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get the user from our database to return role and professional info
    const user = await prisma.user.findUnique({
      where: { email }
    });

    res.status(200).json({
      message: 'Login successful',
      user,
      token: authData.session.access_token
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

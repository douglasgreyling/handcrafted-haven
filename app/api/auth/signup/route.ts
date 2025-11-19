import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Seller from "@/models/Seller";
import connectToDatabase from '@/lib/mongoose';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { name, email, password } = await req.json();

    // Check if email exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newSeller = await Seller.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Account created successfully", seller: newSeller },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating account" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Seller from "@/models/Seller";
import connectToDatabase from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if seller exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, seller.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // SUCCESS
    return NextResponse.json(
      {
        message: "Login successful",
        seller: {
          id: seller._id,
          name: seller.name,
          email: seller.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}

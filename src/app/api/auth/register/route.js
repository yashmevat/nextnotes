import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
      const { name, email, password } = await req.json();
      if(!name || !email || !password){
        
    return NextResponse.json({ message: "All fields are required",success:false });
      }
      const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.appUser.create({
      data: { name, email, password: hashed }
    });
    return NextResponse.json({ message: "User registered", user,success:true });
  } catch (error) {
    return NextResponse.json({ message: "Email already exists",success:false }, { status: 400 });
  }
}

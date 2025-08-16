import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if(!email ||!password){
        
    return NextResponse.json({ success: false, message: "all fields are required" });
    }
    const user = await prisma.appUser.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });

    const token = signToken({ id: user.id, email: user.email });
    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

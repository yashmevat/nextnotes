import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if(!email ){
        
    return NextResponse.json({ success: false, message: "all fields are required" },{status:400});
    }
    const user = await prisma.appUser.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, imageUrl:user.imageUrl,email:user.email,name:user.name });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

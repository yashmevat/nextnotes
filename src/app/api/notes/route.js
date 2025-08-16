import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromHeader } from "@/lib/getUser";

export async function GET(req) {
    const user = await getUserFromHeader(req);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const notes = await prisma.appNote.findMany({ where: { userId: user.id } });
    return NextResponse.json({ notes, success: true });
}

export async function POST(req) {
    try {
        const user = await getUserFromHeader(req);
        if (!user) return NextResponse.json({ message: "Unauthorized user",success:false  }, { status: 401 });

        const { title, content } = await req.json();
        if(!title || !content){
            
        return NextResponse.json({message:"all fields are required",success:false});
        }
        const note = await prisma.appNote.create({
            data: { title, content, userId: user.id }
        });
        return NextResponse.json({note,success:true},{status:200});
    } catch (error) {
         
        if (!user) return NextResponse.json({ message: "internal server error",success:false  }, { status: 500 });
    }

}

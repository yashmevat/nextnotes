import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromHeader } from "@/lib/getUser";

export async function GET(req, { params }) {
    try {
        const user = await getUserFromHeader(req);
        if (!user) return NextResponse.json({ message: "Unauthorized user", success: false }, { status: 401 });

        const note = await prisma.appNote.findFirst({ where: { id: Number(params.id), userId: user.id } });
        if (!note) return NextResponse.json({ message: "Not found", success: false }, { status: 404 });

        return NextResponse.json({ note, success: true }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ message: "internal server error", success: false }, { status: 500 });
    }

}

export async function PUT(req, { params }) {
    try {
        const user = await getUserFromHeader(req);
        if (!user) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const { title, content } = await req.json();
        if (!title || !content) {
            return NextResponse.json({ message: "all fields are required", success: false }, { status: 401 });
        }
        const note = await prisma.appNote.updateMany({
            where: { id: Number(params.id), userId: user.id },
            data: { title, content }
        });
        return NextResponse.json({ success: true, note });
    } catch (error) {

        return NextResponse.json({ message: "internal server error", success: false }, { status: 500 });
    }

}

export async function DELETE(req, { params }) {
    try {
        const user = await getUserFromHeader(req);
        if (!user) return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });

        await prisma.appNote.deleteMany({ where: { id: Number(params.id), userId: user.id } });
        return NextResponse.json({ message: "Note deleted",success:true },{status:200});
    } catch (error) {
        return NextResponse.json({ message: "internal server error",success:false }, { status: 500 });
    }

}

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Path to save the image
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Create directory if it doesn't exist
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate a unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = join(uploadDir, filename);

        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

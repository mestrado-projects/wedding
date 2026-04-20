import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export async function GET() {
  try {
    const hotelDir = path.join(process.cwd(), "public", "hotel");
    const files = await fs.readdir(hotelDir);

    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => ({
        src: `/hotel/${file}`,
        alt: `Foto do hotel ${path.parse(file).name}`,
      }));

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
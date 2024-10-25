import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// To upload on cloudinary
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "File not found" }, { status: 400 });

    // need to upload buffer using upload_stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "devlink-uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      uploadStream.end(buffer);
    })

    return NextResponse.json({ publicId: result.public_id, url: result.secure_url }, { response: 200 });
  } catch (error) {
    console.error("Image upload failed:\n", error);
  }
}

export async function DELETE(request) {
  try {
    const { publicId } = await request.json();
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
    });
    return NextResponse.json({ message: "Image deleted successfully" }, { response: 200 });
  } catch (error) {
    console.error("Error deleting image:\n", error)
    return NextResponse.json(({ message: "Failed to delete image" }, { response: 400 }));
  }
}
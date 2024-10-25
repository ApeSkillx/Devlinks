import connectDB from "@/src/lib/connectDB";
import User from "@/src/models/user";
import { NextResponse } from "next/server";

// Fetches only the devLinks of the user.
export async function GET(request, { params }) {
  const { username } = await params;
  await connectDB();

  const user = await User.findOne({ username });
  if (!user && username !== "default") {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  };

  if (!user) { // Creating default user (no auth yet).
    try {
      const defaultUser = await User.create({
        username,
        first_name: "",
        last_name: "",
        email: "",
        profile_picture: "",
        profile_picture_publicId: "",
        devlinksList: [],
      })
      return NextResponse.json({ devlinksList: defaultUser.devlinksList }, { response: 200 });
    } catch (error) {
      // On deleting default user and restarting the application, it's somehow trying to make default user twice (maybe it's happening on starting too).
      // Below is handling it fine.
      console.error("Error creating new default user:\n", error);
      return NextResponse.json({ message: "Error creating default user" }, { response: 500 });
    }
  }
  return NextResponse.json({ devlinksList: user.devlinksList }, { status: 200 });
}

// Updates only the devLinks of the user.
export async function PATCH(request, { params }) {
  const { username } = await params;
  const { devlinksList } = await request.json();

  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  };

  const update = await User.findOneAndUpdate({ username },
    {
      devlinksList
    }
  );

  return NextResponse.json({ message: "Devlinks updated successfully" }, { status: 200 });
}
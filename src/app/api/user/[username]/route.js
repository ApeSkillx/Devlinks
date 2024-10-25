import connectDB from "@/src/lib/connectDB";
import User from "@/src/models/user";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { username } = await params;
  await connectDB();

  const user = await User.findOne({ username });
  if (!user && username !== "default") {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (!user) { // Creating default user (no auth yet).
    const defaultUser = await User.create({
      username,
      first_name: "",
      last_name: "",
      email: "",
      profile_picture: "",
      profile_picture_publicId: "",
      devlinksList: [],
    })
    return NextResponse.json({ user: defaultUser }, { response: 200 });
  }

  return NextResponse.json({ user }, { response: 200 });
}

export async function POST(request) {
  const {
    username,
    first_name,
    last_name,
    email,
    profile_picture,
    profile_picture_publicId,
    devlinksList
  } = await request.json();
  await connectDB();

  const user = await User.findOne({ username });
  if (user) {
    return NextResponse.json({ message: "User already exists" }, { status: 401 })
  };

  await User.create({
    username,
    first_name,
    last_name,
    email,
    profile_picture,
    profile_picture_publicId,
    devlinksList
  });

  return NextResponse.json({ message: "User created" }, { status: 201 });
}

export async function PUT(request, { params }) {
  const { username } = await params;
  const {
    first_name,
    last_name,
    email,
    profile_picture,
    profile_picture_publicId,
    devlinksList
  } = await request.json();
  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  };

  const update = await User.findOneAndReplace({ username },
    {
      first_name,
      last_name,
      email,
      profile_picture,
      profile_picture_publicId,
      devlinksList
    });

  return NextResponse.json({ message: "User replaced" }, { status: 200 });
}

// Update only user details, not the devlinksList of user.
export async function PATCH(request, { params }) {
  const { username } = await params;
  const {
    first_name,
    last_name,
    email,
    profile_picture,
    profile_picture_publicId
  } = await request.json();
  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  };

  const update = await User.findOneAndUpdate({ username },
    {
      first_name,
      last_name,
      email,
      profile_picture,
      profile_picture_publicId
    }
  )

  return NextResponse.json({ message: "User updated" }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const { username } = await params;
  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  };

  const delUsr = await User.deleteOne({ username });

  return NextResponse.json({ message: "User deleted" }, { status: 200 });
}

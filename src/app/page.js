import { redirect } from "next/navigation";

export default async function Home() {
  // Customize links is the home page.
  redirect("/customize-links");
}
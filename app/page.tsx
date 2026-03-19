import { redirect } from "next/navigation";

export default function RootPage() {
  // This immediately sends visitors to the sign-in page
  redirect("/sign-in");
}
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";


export const metadata = {
  title: "Home Page",
  description: "This is the home page of our Next.js application.",
};

export default async function Home() {
  const session = await auth()
  console.log('User session:', session);
  return (
    <div>
      <div>Home Page</div>
    </div>
  );
}

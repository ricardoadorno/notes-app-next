import { useRouter } from "next/router";
import { useEffect } from "react";

function Home() {
  // redirect to /auth/login if not logged in
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, []);
  return <div>Home</div>;
}

export default Home;

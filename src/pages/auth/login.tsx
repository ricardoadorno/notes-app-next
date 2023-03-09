import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    await axios
      .post("http://localhost:3000/api/loginuser", {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.user_url) {
          router.push("/notes/" + res.data.user_url);
        }
      });

    setIsLoading(false);
  }

  return (
    <div className="container">
      <article className="card">
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" ref={emailRef} />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordRef}
          />
          <button type="submit" aria-busy={isLoading}>
            Login
          </button>
          <Link className="center" href="/auth/register">
            {" "}
            Register{" "}
          </Link>
        </form>
      </article>
    </div>
  );
}

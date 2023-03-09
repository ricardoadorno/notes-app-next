import { useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

export default function Register() {
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleNewUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    axios
      .post("http://localhost:3000/api/createuser", {
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      })
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  return (
    <div className="container">
      <article className="card">
        <h3>Register</h3>
        <form onSubmit={handleNewUser}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            ref={nameRef}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="username"
            ref={emailRef}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            ref={passwordRef}
          />
          <button type="submit">Register</button>
          <Link href="/"> Back to Login </Link>
        </form>
      </article>
    </div>
  );
}

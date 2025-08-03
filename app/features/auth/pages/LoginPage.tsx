import type { MetaFunction } from "react-router";
import { LoginForm } from "../components/LoginForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In - Pokedex App" },
    { name: "description", content: "Sign in to your Pokemon trainer account" },
  ];
};

export default function LoginPage() {
  return <LoginForm />;
}

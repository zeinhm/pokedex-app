import type { MetaFunction } from "react-router";
import { LoginForm } from "../components/LoginForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Pokedex App" },
    { name: "description", content: "Login to your Pokemon trainer account" },
  ];
};

export default function LoginPage() {
  return <LoginForm />;
}

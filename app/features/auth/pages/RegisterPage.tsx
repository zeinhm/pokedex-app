import type { MetaFunction } from "react-router";
import { RegisterForm } from "../components/RegisterForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Create Account - Pokedex App" },
    { name: "description", content: "Join the Pokemon adventure today" },
  ];
};

export default function RegisterPage() {
  return <RegisterForm />;
}

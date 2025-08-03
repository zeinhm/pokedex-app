import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  type User,
} from "firebase/auth";
import { auth } from "@/shared/config/firebase.config";
import type { RegisterFormData } from "../types/auth.types";

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async register(data: RegisterFormData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });

      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      case "auth/invalid-credential":
        return "Invalid email or password. Please try again.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }
}

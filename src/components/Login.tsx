"use client"; // Optional: If you're using Next.js App Router (13+)

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Ensure axios is installed: `npm install axios`
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState(""); // Use email instead of username
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          email,
          password,
        }
      );

      const { token } = response.data; 
      console.log(response.data);// Extract token from the response
      localStorage.setItem("token", token); // Store token in localStorage

      router.push("/admin"); // Redirect to admin page
      setTimeout(() => {
        toast.success("Login Succesful!");
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid email or password. Please try again.!");
    }
  };

  return (
    <div className="items-center justify-center mt-7 w-1/2 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
      <div className="p-4 sm:p-7">
        <div className="text-center">
          <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Don't have an account yet?{" "}
            <a
              href="/register"
              className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
            >
              Sign up here
            </a>
          </p>
        </div>

        <div className="mt-4">
          <form onSubmit={handleLogin}>
            <div className="grid gap-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 dark:text-white"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-3 px-4 block w-full hover:border-green-400 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Password
                  </label>
                  <a
                    href="/recover-account"
                    className="text-sm  text-blue-600 hover:underline font-medium dark:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="hs-strong-password-input password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="py-3 px-4 block w-full hover:border-green-400 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                />

                <div
                  data-hs-strong-password='{
                      "target": "#hs-strong-password-input",
                      "stripClasses": "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-green-500 h-2 flex-auto rounded-full bg-blue-500 opacity-50 mx-1"
                    }'
                  id="strong-password"
                  className="flex mt-2 -mx-1"
                ></div>
              </div>

              <div className="mb-3">
                <span id="strong-password-weakness"></span>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ms-3 text-sm dark:text-white"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

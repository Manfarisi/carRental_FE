import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();
  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        navigate("/");
        setShowLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="w-[360px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 px-8 py-10 space-y-6"
      >
        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {state === "login" ? "Welcome Back 👋" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {state === "login"
              ? "Login to continue booking cars"
              : "Sign up to start renting cars"}
          </p>
        </div>

        {/* NAME */}
        {state === "register" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="John Doe"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* SWITCH */}
        <p className="text-sm text-center text-gray-500">
          {state === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

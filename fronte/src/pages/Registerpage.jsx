import {
  Eye,
  EyeClosed,
  GlobeLock,
  Loader,
  Lock,
  Mail,
  User2,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Userstore } from "../store/user.store";
import toast from "react-hot-toast";
const Registerpage = () => {
  const { Register, isentring } = Userstore();
  const [showpass, setshowpass] = useState(false);
  const [confirm, setconfirm] = useState("");
  const [formData, setformData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [check, setcheck] = useState(false);
  const validateForm = () => {
    if (!check) return toast.error("accept the terms and conditions");
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (formData.password != confirm)
      return toast.error("password must be identical");

    return true;
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success == true) return Register(formData);
  };
  return (
    <div className=" flex justify-center min-h-[90vh] w-full p-4 bg-neutral">
      <div className="flex flex-col p-2">
        <h2 className="text-center text-3xl  text-primary-content text-bold">
          SignUp
        </h2>
        <form onSubmit={handlesubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-primary-content font-medium">
                Email
              </span>
            </label>
            <div className="flex">
              <Mail className="size-9 m-1 text-primary-content" />
              <input
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setformData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <label className="label">
              <span className="label-text text-primary-content font-medium">
                Name
              </span>
            </label>
            <div className="flex">
              <User2 className="size-9 m-1 text-primary-content" />
              <input
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder="example"
                value={formData.name}
                onChange={(e) =>
                  setformData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <label className="label">
              <span className="label-text text-primary-content font-medium">
                Password
              </span>
            </label>
            <div className="flex">
              <Lock className="size-9 m-1 text-primary-content" />
              <input
                type={showpass ? "text" : "password"}
                className={`input input-bordered text-center w-full pl-10`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
              />
              {!showpass ? (
                <Eye
                  className="size-9 m-1 text-primary-content cursor-pointer"
                  onClick={() => setshowpass(!showpass)}
                />
              ) : (
                <EyeClosed
                  className="size-9 m-1 text-primary-content cursor-pointer"
                  onClick={() => setshowpass(!showpass)}
                />
              )}
            </div>
            <label className="label">
              <span className="label-text text-primary-content font-medium">
                {" "}
                confirm Password
              </span>
            </label>
            <div className="flex">
              <Lock className="size-9 m-1 text-primary-content" />
              <input
                type={showpass ? "text" : "password"}
                className={`input input-bordered text-center w-full pl-10`}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setconfirm(e.target.value)}
              />
            </div>
          </div>
          <button className="text-center bg-yellow-500  rounded-lg text-neutral text-2xl cursor-pointer  w-full p-3 mt-2 ">
            {isentring ? <Loader className="size-8 animate-spin" /> : "SignUp"}
          </button>
          <div className="flex justify-center items center">
            <input
              type="checkbox"
              className="checkbox checkbox-sm m-1"
              checked={check}
              onClick={() => setcheck(!check)}
            />
            <p className="text-center text-lg m-1">
              I agree to the Terms of Service and Privacy Policy
            </p>
          </div>
        </form>
        <a
          href={` ${check ? `${import.meta.env.VITE_Api}auth/google` : "#"} `}
          className="flex justify-center  bg-yellow-500 p-2 rounded-xl cursor-pointer mt-4"
          onClick={() => {
            if (!check) return toast.error("accept the conditions terms");
          }}
        >
          <img
            src="/google.png"
            alt=""
            className="w-[30px] m-1 h-[30px] rounded-full "
          />
          <span className=" text-xl m-1 text-neutral text-center">
            SignUp with google
          </span>
        </a>
        <p className="text-center text-xl text-primary-content mt-2 ">
          {" "}
          I have already an Account
          <Link to={"/login"}>
            <span className="text-yellow-500 text-2xl"> SignIn</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registerpage;

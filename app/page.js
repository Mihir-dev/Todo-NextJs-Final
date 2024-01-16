"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

const idb = window.indexedDB;
export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [match, setMatch] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [allUsersData, setAllUsersData] = useState([]);
  const router = useRouter();

  const idb = window.indexedDB;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Email
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (regex.test(username)) {
      setInvalidEmail(false);
    }
    if (regex.test(username) == false) {
      setInvalidEmail(true);
      setUsername("");
      setPassword("");
      toast.error("Invalid Email Format");
      return;
    }

    const dbPromise = idb.open("test-db", 2);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      const tx = db.transaction("userData", "readonly");
      const userData = tx.objectStore("userData");

      const users = userData.get(username);

      users.onsuccess = (query) => {
        const user1 = query.srcElement.result;
        console.log(user1);
        console.log("User Found");
        if (!user1) {
          toast.error("User Not Found");
        } else {
          if (user1.password == password) {
            console.log("We have a match");
            setMatch(true);
            toast.success("Logged In");
            localStorage.setItem("CurrentEmail", username);
            router.push("/todo");
          }
          if (user1.password != password) {
            toast.error("Incorrect Password");
          }
        }
      };
    };
  };

  return (
    <>
      <main className="flex flex-col h-screen bg-black">
        <div className="w-screen h-[4.5rem] rounded-b-lg shadow-sm shadow-gray-500/50 -translate-y-0.5 flex items-center py-3.5 px-7 justify-between bg-black">
          <div className="flex items-center space-x-2.5 group">
            <CubeTransparentIcon className="h-10 w-10 text-white group-hover:rotate-180 transition" />
            <p className="text-2xl font-medium text-white company-name">
              TASK ODYSSEY
            </p>
          </div>

          <div className="flex items-center space-x-3"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-[77%] w-3/6 bg-form-gray/20 rounded-md shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-center py-8 text-5xl">
              <h1>Login</h1>
            </div>

            <form className="flex flex-col items-center  px-32">
              <div className="m-0 flex justify-start w-full mb-1.5">
                <p>Email ID</p>
              </div>
              <input
                className="w-full h-10 outline-none px-4 rounded-md bg-black/50 text-white"
                placeholder="Enter your email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="email"
                required
              />

              <div className="m-0 flex justify-start w-full mt-8 mb-1.5">
                <p>Password</p>
              </div>
              <div className="w-full rounded-md bg-black/30 px-4 text-white h-10 flex items-center">
                <input
                  type={toggle ? "text" : "password"}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className=" outline-none  flex-1 bg-transparent "
                  placeholder="Enter your password"
                />
                {toggle ? (
                  <HiEye
                    className="text-white cursor-pointer"
                    onClick={() => setToggle((prev) => !prev)}
                  />
                ) : (
                  <HiEyeSlash
                    className="text-white cursor-pointer"
                    onClick={() => setToggle((prev) => !prev)}
                  />
                )}
              </div>

              <button
                className="mt-9 bg-black/35 text-white px-14 py-2  rounded-md hover:bg-white space-x-2 hover:text-black transition flex items-center justify-center"
                onClick={handleSubmit}
                type="submit"
              >
                Login
              </button>
              <Link
                href="/signup"
                className="mt-3 text-sm italic text-gray-500 underline cursor-pointer  hover:text-white transition"
              >
                Sign Up
              </Link>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

{
  /* <main className="w-screen h-screen flex items-center justify-center">
      <div className='h-[75%] w-3/6 bg-white/10 rounded-md shadow-2xl border space-y-5'>
        <div className='flex items-center justify-center py-8 text-5xl'>
        <h1>TODO</h1>
        </div>

        <form className="flex flex-col items-center  px-32">
          <div className="m-0 flex justify-start w-full mb-1.5">
            <p>Email ID</p>
          </div>
          <input  className='w-full h-10 outline-none px-4 rounded-lg border'  placeholder='Enter your email address' value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="email"
            required />
          
          <div className="m-0 flex justify-start w-full mt-8 mb-1.5">
            <p>Password</p>
          </div>
          <input type="password" value={password} required
            onChange={(e) => setPassword(e.target.value)} className='w-full border h-10 outline-none px-4 rounded-lg '  placeholder='Enter your password' />
          
          <button className='mt-9 bg-white px-14 py-2 border rounded-lg hover:bg-black space-x-2 hover:text-white transition flex items-center justify-center' onClick={handleSubmit} type='submit'>
              Login
          </button>
          <Link href="/signup" className='mt-3 text-sm italic text-gray-500 underline cursor-pointer hover:text-black transition'>Sign Up</Link>
        </form>
      </div>
    </main> */
}

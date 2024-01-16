"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowRightStartOnRectangleIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

const idb = window.indexedDB;
const createCollectionInIndexDB = () => {
  if (!idb) {
    alert("This browser dont't have indexDB");
    return;
  }

  const request = idb.open("test-db", 2);

  request.onerror = (e) => {
    console.log("error case", e);
  };

  request.onupgradeneeded = (e) => {
    const db = request.result;

    if (!db.objectStoreNames.contains("userData")) {
      db.createObjectStore("userData", {
        keyPath: "emailid",
      });
    }
  };

  request.onsuccess = () => {
    console.log("Database opened successfully");
  };
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [allUsersData, setAllUsersData] = useState([]);
  const [toggle, setToggle] = useState(false);

  const router = useRouter();

  useEffect(() => {
    createCollectionInIndexDB();
    getAllData();
  }, []);

  const getAllData = () => {
    const dbPromise = idb.open("test-db", 2);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("userData", "readonly");
      const userData = tx.objectStore("userData");

      const users = userData.getAll();

      users.onsuccess = (q) => {
        console.log(q.srcElement.result);
        setAllUsersData(q.srcElement.result);
      };

      users.onerror = (e) => {
        console.log("Error", e);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

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

    // Validate Password

    const n = password.length;
    // Checking lower alphabet in string
    let hasLower = false;
    let hasUpper = false;
    let hasDigit = false;
    let specialChar = false;
    const normalChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ";

    for (let i = 0; i < n; i++) {
      if (password[i] >= "a" && password[i] <= "z") {
        hasLower = true;
      }
      if (password[i] >= "A" && password[i] <= "Z") {
        hasUpper = true;
      }
      if (password[i] >= "0" && password[i] <= "9") {
        hasDigit = true;
      }
      if (!normalChars.includes(password[i])) {
        specialChar = true;
      }
    }

    if (hasLower && hasUpper && hasDigit && specialChar && n >= 8) {
      setInvalid(false);
    }

    if ((hasLower && hasUpper && hasDigit && specialChar && n >= 8) == false) {
      setInvalid(true);
      toast.error("Invalid Password Format");
      return;
    }

    if (invalid == false && invalidEmail == false) {
      // setPassword("");

      const dbPromise = idb.open("test-db", 2);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        const tx = db.transaction("userData", "readwrite");

        const userData = tx.objectStore("userData");

        const users = userData.put({
          emailid: username,
          password,
        });

        users.onsuccess = () => {
          tx.oncomplete = () => {
            db.close();
          };
          toast.success("User Created Successfully");

          router.push("/");
        };

        users.onerror = (e) => {
          alert("Error", e);
        };
      };
    }
  };
  return (
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
      <div className="w-screen flex-1 flex items-center justify-center">
        <div className="h-[77%] w-3/6 bg-form-gray/20   rounded-md shadow-2xl text-white space-y-4">
          <div className="flex items-center justify-center py-8 text-5xl">
            <h1>Signup</h1>
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

            <div className={`m-0 flex justify-start w-full mt-8 mb-1.5`}>
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
              className={`mt-9 bg-black/35 text-white px-14 py-2  rounded-md hover:bg-white space-x-2 hover:text-black transition flex items-center justify-center`}
              type="submit"
              onClick={handleSubmit}
            >
              <p>Sign Up</p>
            </button>
            <Link
              href="/"
              className="mt-3 mb-2 text-sm text-gray-500 hover:text-white  italic underline cursor-pointer  transition"
            >
              Login
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUp;

"use client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { FaPlus } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import Card from "@/components/Card";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { Tasks } from "@/Contexts/Tasks";
import { fetchTasks } from "@/utils/fetchTask";
import { searchTask } from "@/utils/searchTask";
import { continousSearch } from "@/utils/continuosSearch";
const idb = window.indexedDB;

const Todo = () => {
  const [create, setCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [datee, setDatee] = useState();
  const [userTasks, setUserTasks] = useState([]);

  const [updatedTask, setUpdatedTask] = useState(false);

  const [searching, setSearching] = useState(false);
  const router = useRouter();

  const logout = () => {
    localStorage.setItem("CurrentEmail", "");
    router.push("/");
  };

  useEffect(() => {
    if (localStorage.getItem("CurrentEmail")) {
      continousSearch(
        idb,
        searchText,
        searchDate,
        setUserTasks,
        setUpdatedTask,
        setSearching
      );
    }
  }, [searchText, searchDate]);

  useEffect(() => {
    if (!searching && localStorage.getItem("CurrentEmail")) {
      fetchTasks(idb, setUserTasks);
    }
  }, [create, updatedTask, searching]);

  return (
    <>
      {localStorage.getItem("CurrentEmail") != "" ? (
        <main className="h-screen w-screen flex flex-col bg-black ">
          <Tasks.Provider
            value={{
              create,
              setCreate,
              title,
              setTitle,
              desc,
              setDesc,
              datee,
              setDatee,
              searchText,
              setSearchText,
              searchDate,
              setSearchDate,
              updatedTask,
              setUpdatedTask,
              searching,
              setSearching,
              idb,
            }}
          >
            <div className="w-screen h-[4.5rem] rounded-b-lg shadow-sm shadow-gray-500/50 -translate-y-0.5 flex items-center py-3.5 px-7 justify-between bg-black">
              <div className="flex items-center space-x-2.5 group">
                <CubeTransparentIcon className="h-10 w-10 text-white group-hover:rotate-180 transition" />
                <p className="text-2xl font-medium text-white company-name">
                  TASK ODYSSEY
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className="bg-white/3 text-white/70  flex items-center space-x-3 cursor-pointer  px-3 py-2 rounded-lg hover:scale-105 transition ease-out hover:-translate-y-1 hover:shadow-sm hover:bg-dark-green hover:text-yellow-green hover:shadow-yellow-green"
                  onClick={() => setCreate(true)}
                >
                  <p> Create Task </p>
                  <FaPlus />
                </div>
                <div
                  className="bg-white/3 text-white/70  flex items-center space-x-3 cursor-pointer  px-3 py-2 rounded-lg hover:scale-105 transition ease-out hover:-translate-y-1 hover:shadow-sm hover:bg-dark-green hover:text-yellow-green hover:shadow-yellow-green"
                  onClick={logout}
                >
                  <p> Logout </p>
                  <IoIosLogOut className="scale-110" />
                </div>
              </div>
            </div>
            <div className="flex w-full h-full items-center justify-center">
              <div className="h-[31rem] w-[65%]  bg-white/2 rounded-lg shadow-2xl flex flex-col pb-7 px-14">
                <div className="flex items-center w-full justify-center py-7">
                  <form
                    className="bg-black/75 flex items-center px-3.5 py-3 w-full rounded-md space-x-4 "
                    id="search"
                  >
                    <FaSearch
                      className="cursor-pointer"
                      onClick={(e) =>
                        searchTask(
                          e,
                          idb,
                          searchText,
                          searchDate,
                          setUserTasks,
                          setUpdatedTask,
                          setSearching
                        )
                      }
                    />
                    <input
                      className="flex-1 outline-none bg-transparent border-r-2 border-gray-500/20 text-white "
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                    />
                    <input
                      type="date"
                      className=" px-2 outline-none  rounded-md text-gray-500/50 bg-white/2"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                    />
                    <button
                      hidden
                      type="submit"
                      onClick={(e) =>
                        searchTask(
                          e,
                          idb,
                          searchText,
                          searchDate,
                          setUserTasks,
                          setUpdatedTask,
                          setSearching
                        )
                      }
                    ></button>
                  </form>
                </div>
                <div className="flex-1 flex items-center justify-center ">
                  <div className=" flex flex-col items-center space-y-5 scrollbar-none overflow-y-scroll h-[22rem]  rounded-lg  w-full">
                    {/* Card  */}
                    {userTasks &&
                      userTasks
                        .slice(0)
                        .reverse()
                        .map((item, id) => {
                          if (item.done == false) {
                            return (
                              <div
                                key={id}
                                className="w-full h-36  flex  rounded-lg bg-black/75 px-3 py-2 "
                              >
                                {" "}
                                <Card
                                  title={item.title}
                                  desc={item.description}
                                  date={item.date}
                                  id={item.id}
                                  done={item.done}
                                  updatedTask={updatedTask}
                                  setUpdatedTask={setUpdatedTask}
                                />
                              </div>
                            );
                          }
                        })}

                    {userTasks &&
                      userTasks
                        .slice(0)
                        .reverse()
                        .map((item, id) => {
                          if (item.done == true) {
                            return (
                              <div
                                key={id}
                                className="w-full bg-black/75 h-36  flex  rounded-lg  px-3 py-2 "
                              >
                                {" "}
                                <Card
                                  title={item.title}
                                  desc={item.description}
                                  date={item.date}
                                  id={item.id}
                                  done={item.done}
                                  updatedTask={updatedTask}
                                  setUpdatedTask={setUpdatedTask}
                                />
                              </div>
                            );
                          }
                        })}

                    {userTasks && userTasks.length == 0 && (
                      <div className="h-full w-full flex items-center justify-center">
                        <p>No Tasks Yet :(</p>
                      </div>
                    )}

                    {!userTasks && (
                      <div className="h-full w-full flex items-center justify-center">
                        <p>No Tasks Yet :(</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {create && <Modal createModal />}
          </Tasks.Provider>
        </main>
      ) : (
        <main className="h-screen w-screen flex items-center justify-center bg-black ">
          <button
            className="bg-gray-500/10 text-white p-2 rounded-md px-5 hover:bg-gray-500/20"
            onClick={() => router.push("/")}
          >
            Login In
          </button>
        </main>
      )}
    </>
  );
};

export default Todo;

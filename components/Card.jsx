"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { IoIosClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import Modal from "./Modal";
import { EditTask } from "@/Contexts/EditTasks";
import { deleteTask } from "@/utils/deleteTask";
import { completedTask } from "@/utils/completedTask";
const idb = window.indexedDB;

const Card = ({ title, desc, date, id, done, updatedTask, setUpdatedTask }) => {
  const [complete, setComplete] = useState(done);
  const [edit, setEdit] = useState(false);

  const [titleEdit, setTitleEdit] = useState(title);
  const [descEdit, setDescEdit] = useState(desc);
  const [dateEdit, setDateEdit] = useState(date);

  const [completionToggle, setCompletionToggle] = useState(false);

  useEffect(() => {
    return;
  }, [completionToggle]);

  return (
    <>
      <div
        className={`flex flex-col border-r-2 border-gray-500/15 text-white/75  ${
          done ? "line-through" : "hover:text-yellow-green"
        } transition ease-in-out px-3 py-2 flex-1`}
      >
        <div className="flex-1">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="h-16">{desc}</p>
        </div>
        <div className=" flex justify-between  items-center">
          <p className="text-sm">{date}</p>
          {/* <button>Edit</button> */}
        </div>
      </div>
      <div className=" flex  space-y-2 flex-col items-center justify-center ml-1.5 px-5">
        <div
          onClick={() => deleteTask(idb, id, setUpdatedTask)}
          className={`cursor-pointer  px-1.5 py-1.5 hover:bg-red-500  hover:text-white rounded-full hover:scale-110 transition`}
        >
          <IoCloseSharp className={`font-medium text-2xl `} />
        </div>
        <div
          onClick={() => {
            setEdit(true);
            setTitleEdit(title);
            setDescEdit(desc);
            setDateEdit(date);
          }}
          className={` ${
            done ? "" : "cursor-pointer"
          }  px-[0.575rem] py-[0.575rem] hover:bg-amber-500 hover:text-white rounded-full hover:scale-110 transition`}
        >
          <MdEdit className={`font-normal text-xl `} />
        </div>
        <div
          onClick={() =>
            completedTask(
              idb,
              id,
              setComplete,
              setCompletionToggle,
              setUpdatedTask
            )
          }
          className={`cursor-pointer ${
            done ? "bg-emerald-500 text-white" : ""
          } px-1.5 py-1.5 hover:bg-emerald-500 hover:text-white rounded-full hover:scale-110 transition`}
        >
          <TiTick className={`font-medium text-2xl `} />
        </div>
      </div>
      {edit && (
        <EditTask.Provider
          value={{
            titleEdit,
            descEdit,
            dateEdit,
            setTitleEdit,
            setDescEdit,
            setDateEdit,
            setEdit,
            idb,
            id,
          }}
        >
          <Modal />
        </EditTask.Provider>
      )}
    </>
  );
};

export default Card;

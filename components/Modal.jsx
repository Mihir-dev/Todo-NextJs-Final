import { EditTask } from "@/Contexts/EditTasks";
import { Tasks } from "@/Contexts/Tasks";
import { createTask } from "@/utils/createTask";
import { editTask } from "@/utils/editTask";
import React, { useContext } from "react";
import { IoIosClose } from "react-icons/io";

const Modal = ({ createModal }) => {
  const {
    setTitle,
    setCreate,
    setDesc,
    setDatee,
    title,
    desc,
    datee,
    setUpdatedTask,
    idb,
    setSearchText,
    setSearchDate,
  } = useContext(Tasks);

  const {
    setEdit,
    titleEdit,
    descEdit,
    setTitleEdit,
    setDescEdit,
    dateEdit,
    setDateEdit,
    id,
  } = useContext(EditTask);

  return (
    <div className="z-50 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center rounded-md">
      <div className="h-[29rem] w-[47rem] rounded-md bg-form-gray/80 space-y-2 flex flex-col ">
        <div
          id="header"
          className="flex items-center justify-between px-7 py-3  border-b-2 border-gray-500/40 "
        >
          <p className="text-2xl text-white">Create Task</p>
          <IoIosClose
            className="text-4xl cursor-pointer hover:bg-red-500 text-white hover:text-white rounded-full"
            onClick={() => (createModal ? setCreate(false) : setEdit(false))}
          />
        </div>
        <div className="flex flex-col px-7  rounded-md flex-1 py-4">
          <div className="flex flex-col space-y-2">
            <p className="text-lg text-white">Title</p>
            <div className="flex">
              <input
                type="text"
                className="outline-none px-3 py-2 rounded-md flex-1 bg-black/30 text-white"
                value={createModal ? title : titleEdit}
                onChange={(e) =>
                  createModal
                    ? setTitle(e.target.value)
                    : setTitleEdit(e.target.value)
                }
                placeholder="Enter the title"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2  mt-3">
            <p className="text-lg text-white">Description</p>
            <div className="flex">
              <textarea
                type="text"
                className="outline-none px-3 py-2 rounded-md flex-1  bg-black/30 text-white"
                value={createModal ? desc : descEdit}
                onChange={(e) =>
                  createModal
                    ? setDesc(e.target.value)
                    : setDescEdit(e.target.value)
                }
                placeholder="Enter the description"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2 mt-3">
            <p className="text-lg text-white">Date</p>
            <div className="flex">
              <input
                type="date"
                className="outline-none px-3 py-2 rounded-md flex-1 bg-black/30 text-white"
                value={createModal ? datee : dateEdit}
                onChange={(e) =>
                  createModal
                    ? setDatee(e.target.value)
                    : setDateEdit(e.target.value)
                }
              />
            </div>
          </div>
          <div className=" flex justify-center items-center mt-7 ">
            <button
              className=" w-full py-2.5 rounded-md bg-black/35 text-white hover:bg-white hover:text-black transition ease-in-out"
              onClick={(e) =>
                createModal
                  ? createTask(
                      e,
                      idb,
                      title,
                      desc,
                      datee,
                      setCreate,
                      setTitle,
                      setDesc,
                      setDatee,
                      setUpdatedTask,
                      setSearchText,
                      setSearchDate
                    )
                  : editTask(
                      e,
                      idb,
                      setUpdatedTask,
                      titleEdit,
                      descEdit,
                      dateEdit,
                      setEdit,
                      id,
                      setSearchText,
                      setSearchDate
                    )
              }
            >
              {createModal ? "Create Task!" : "Edit Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

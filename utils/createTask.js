import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
export const createTask = (
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
) => {
  e.preventDefault();

  const task = {
    title: title,
    description: desc,
    date: datee,
    id: uuidv4(),
    done: false,
  };

  const dbPromise = idb.open("test-db", 2);
  dbPromise.onsuccess = () => {
    const db = dbPromise.result;
    const tx = db.transaction("userData", "readwrite");
    const userData = tx.objectStore("userData");
    const current = localStorage.getItem("CurrentEmail");

    const users = userData.get(current);

    users.onsuccess = (e) => {
      let data = e.target.result;
      console.log(data);

      data.tasks = [...(data.tasks || []), task];

      const putRequest = userData.put(data);

      putRequest.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
        };
        console.log("task added");
        setCreate(false);
        setTitle("");
        setDesc("");
        setDatee("");
        setUpdatedTask((prev) => !prev);
        setSearchText("");
        setSearchDate("");
        toast.success("Task Created Successfully");
      };
    };
  };
};

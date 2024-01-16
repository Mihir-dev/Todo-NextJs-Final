import toast from "react-hot-toast";
import { fetchTasks } from "./fetchTask";

export const searchTask = (
  e,
  idb,
  searchText,
  searchDate,
  setUserTasks,
  setUpdatedTask,
  setSearching
) => {
  e.preventDefault();
  const dbPromise = idb.open("test-db", 2);
  dbPromise.onsuccess = () => {
    const db = dbPromise.result;
    const tx = db.transaction("userData", "readwrite");
    const userData = tx.objectStore("userData");
    const current = localStorage.getItem("CurrentEmail");

    const users = userData.get(current);
    users.onsuccess = (e) => {
      let data = e.target.result;
      let taskArray = data.tasks;

      let newArray = [];

      if (searchText == "" && searchDate == "") {
        // No Input
        toast.error("Please input the filters");
        fetchTasks(idb, setUserTasks);
      } else if (searchText != "" && searchDate == "") {
        // Only Text
        newArray = taskArray.filter((e) => {
          return (
            e.title.toLowerCase() == searchText.toLowerCase() ||
            e.description.toLowerCase() == searchText.toLowerCase()
          );
        });
        setUserTasks(newArray);
        setUpdatedTask((prev) => !prev);
        setSearching(true);
        console.log(newArray);
        toast.success("Search Completed");
      } else if (searchText == "" && searchDate != "") {
        // Only Date
        newArray = taskArray.filter((e) => {
          return e.date == searchDate;
        });
        setUserTasks(newArray);
        setUpdatedTask((prev) => !prev);
        setSearching(true);
        toast.success("Search Completed");
      } else if (searchText != "" && searchDate != "") {
        // Both Text and Date
        newArray = taskArray.filter((e) => {
          return (
            (e.title.toLowerCase() == searchText.toLowerCase() ||
              e.description.toLowerCase() == searchText.toLowerCase()) &&
            e.date == searchDate
          );
        });
        setUserTasks(newArray);
        setUpdatedTask((prev) => !prev);
        setSearching(true);

        toast.success("Search Completed");
      }

      tx.oncomplete = () => {
        db.close();
      };
    };
  };
};

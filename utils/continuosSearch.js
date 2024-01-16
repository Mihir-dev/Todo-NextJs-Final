import { fetchTasks } from "./fetchTask";

export const continousSearch = (
  idb,
  searchText,
  searchDate,
  setUserTasks,
  setUpdatedTask,
  setSearching
) => {
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
        fetchTasks(idb, setUserTasks);
      }

      // Only Text
      if (searchText != "" && searchDate == "") {
        newArray = taskArray.filter((e) => {
          return (
            e.title.toLowerCase().includes(searchText.toLowerCase()) ||
            e.description.toLowerCase().includes(searchText.toLowerCase())
          );
        });
        setUserTasks(newArray);
        setUpdatedTask((prev) => !prev);
        setSearching(true);
        console.log(newArray);
      }

      // Only Date
      else if (searchDate != "" && searchText == "") {
        newArray = taskArray.filter((e) => {
          return e.date == searchDate;
        });
        setUserTasks(newArray);
        setUpdatedTask((prev) => !prev);
        setSearching(true);
      } else if (searchText != "" && searchDate != "") {
        newArray = taskArray.filter((e) => {
          return (
            (e.title.toLowerCase().includes(searchText.toLowerCase()) ||
              e.description.toLowerCase().includes(searchText.toLowerCase())) &&
            e.date == searchDate
          );
        });
        setUserTasks(newArray);
        setUpdatedTask((prev) => !prev);
        setSearching(true);
      }

      tx.oncomplete = () => {
        db.close();
      };
    };
  };
};

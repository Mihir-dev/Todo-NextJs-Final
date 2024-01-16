import toast from "react-hot-toast";
export const editTask = (
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
) => {
  e.preventDefault();
  setUpdatedTask((prev) => !prev);
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

      taskArray.forEach((e) => {
        if (e.id == id) {
          e.title = titleEdit;
          e.description = descEdit;
          e.date = dateEdit;
        }
      });
      const putRequest = userData.put(data);
      putRequest.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
        };
        console.log("Task Completed");
        toast("Task Edit Successfully", {
          icon: "🎊",
        });
      };
      setEdit(false);
      setUpdatedTask((prev) => !prev);
      setSearchDate("");
      setSearchText("");
    };
  };
};

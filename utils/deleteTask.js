import toast from "react-hot-toast";

export const deleteTask = (idb, id, setUpdatedTask) => {
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
      const newArray = taskArray.filter((e) => {
        return e.id != id;
      });
      data.tasks = newArray;
      const putRequest = userData.put(data);
      putRequest.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
        };
        console.log("Task Deleted");
        toast("Task Deleted Successfully", {
          icon: "🎊",
        });
      };
      setUpdatedTask((prev) => !prev);
    };
  };
};

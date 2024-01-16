const { default: toast } = require("react-hot-toast");

export const completedTask = (
  idb,
  id,
  setComplete,
  setCompletionToggle,
  setUpdatedTask
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

      // Try
      taskArray.forEach((element) => {
        if (element.id === id) {
          element.done = true;
        }
      });

      setComplete(true);

      data.tasks = taskArray;

      console.log(taskArray);

      const putRequest = userData.put(data);

      putRequest.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
        };
        console.log("Task Completed");
        setCompletionToggle((prev) => !prev);
        setUpdatedTask((prev) => !prev);
        toast("Task Completed", {
          icon: "🎊",
        });
      };
    };
  };
};

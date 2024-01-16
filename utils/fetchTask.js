export const fetchTasks = (idb, setUserTasks) => {
  const dbPromise = idb.open("test-db", 2);
  dbPromise.onsuccess = () => {
    const db = dbPromise.result;
    const tx = db.transaction("userData", "readwrite");
    const userData = tx.objectStore("userData");
    const current = localStorage.getItem("CurrentEmail");

    const users = userData.get(current);

    users.onsuccess = (e) => {
      const data = e.target.result;
      setUserTasks(data.tasks);
      tx.oncomplete = () => {
        db.close();
      };
      console.log("task fetched");
    };
  };
};

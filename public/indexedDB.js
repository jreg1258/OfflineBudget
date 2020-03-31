let db;
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
  
const request = indexedDB.open("budget", 1);

// Create schema
request.onupgradeneeded = event => {
  let db = event.target.result;

  // Creates an object store with a listID keypath that can be used to query on.
  db.createObjectStore("pending", {
    autoIncrement: true
  });
};

// Opens a transaction, accesses the budget objectStore and statusIndex.
request.onsuccess = event => {
  db = event.target.result;
  if (navigator.onLine) {
  checkIfDataBaseOnline();
  }
};
request.onerror = () =>{
  console.log(event.target.errorCode)
}


function checkIfDataBaseOnline() {
    const transaction = db.transaction(["pending"], "readwrite");
    const budgetStore = transaction.objectStore("pending");
    const getAllRecords = budgetStore.getAll();
    getAllRecords.onsuccess = function(){
      if (getAllRecords.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAllRecords.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => {    
          return response.json();
        })
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const budgetStore = transaction.objectStore("pending");
          budgetStore.clear();
        }).catch(err => {
          return err
        })
      }
    }
}

window.addEventListener("online", checkIfDataBaseOnline())


function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const budgetStore = transaction.objectStore("pending");
  budgetStore.add(record)
}
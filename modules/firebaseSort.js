const firebaseSort = {
  byDate(snapshot, key, value) {
    const sortData = [];
    snapshot.forEach((childSnapshot) => {
      const child = childSnapshot.val();
      if (child[key] === value) {
        sortData.push(child);
      }
    });
    sortData.reverse();
    return sortData;
  },
};

module.exports = firebaseSort;

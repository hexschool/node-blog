const pageConfig = {
  perpage: 3,
};

const convertPagination = (snapshot, current, category = '') => {
  const data = [];
  const totalResult = snapshot.numChildren(); // 總資料數
  const pageCount = Math.ceil(totalResult / pageConfig.perpage); // 總頁數
  let currentPage = current;
  let i = 0;
  if (currentPage > pageCount) {
    currentPage = pageCount;
  }

  const minItem = (currentPage * pageConfig.perpage) - pageConfig.perpage;
  const maxItem = currentPage * pageConfig.perpage;
  snapshot.forEach((childSnapshot) => {
    i += 1;
    if (i > minItem && i <= maxItem) {
      const item = childSnapshot.val();
      item.num = i;
      data.push(item);
    }
  });

  return {
    page: {
      total_pages: pageCount,
      current_page: currentPage,
      has_pre: currentPage > 1,
      has_next: currentPage < pageCount,
      category,
    },
    data,
  };
};

module.exports = convertPagination;

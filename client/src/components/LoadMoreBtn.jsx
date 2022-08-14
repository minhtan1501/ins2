import React from "react";

export default function LoadMoreBtn({ result, page, load, handleLoadMore = null }) {
    return (
    <>
      {result < 9 * (page - 1)
        ? ""
        : !load && <button className='bg-sky-500 text-white font-semibold p-2 rounded dark:bg-yellow-500 dark:text-primary mx-auto hover:opacity-60 block' onClick={handleLoadMore} >Hiện thị thêm</button>}
    </>
  );
}

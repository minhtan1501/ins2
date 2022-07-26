import React from "react";
import Posts from "../components/home/Posts";
import Status from "../components/home/Status";
import Container from "../components/Container";
import { useSelector } from "react-redux";
import { ImSpinner8 } from "react-icons/im";
export default function Home() {
  const { homePosts } = useSelector((state) => state);

  return (
    <div className="bg-white dark:bg-primary min-h-screen mt-12">
      <Container>
        <div className="grid grid-cols-12 flex-1">
          <div className="col-span-8 lg:ml-0 ml-4">
            <Status />
            {!homePosts.loading ? (
              !homePosts.posts?.length ? (
                <h2 className="text-4xl text-center text-light-subtle dark:text-dark-subtle">
                  Chưa có bài viết nào!
                </h2>
              ) : (
                <Posts />
              )
            ) : (
              <div className="flex justify-center mt-3">
                <ImSpinner8
                  className="animate-spin dark:text-yellow-500 text-sky-500"
                  size={34}
                />
              </div>
            )}
          </div>
          <div className="col-span-4"></div>
        </div>
      </Container>
    </div>
  );
}

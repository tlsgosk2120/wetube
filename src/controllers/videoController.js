import { videos } from "../db";

const fakeUser = {
  username: "Nicolas",
  loggedIn: false,
};

export const trending = (req, res) => {
  return res.render("home", {
    pageTitle: "Home Page Videos",
    videos,
    fakeUser,
  });
};

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching : ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing : ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  // const video = videos[id - 1];
  // video.title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  // here we will add a video to the videos array.
  return res.redirect(`/`);
};

// export const search = (req, res) => {
//   //   const searchingBy = req.query.term; 아래 쿼리와 같음
//   const {
//     query: { term: searchingBy },
//   } = req;
//   res.render("search", { pageTitle: "Search", searchingBy: searchingBy });
// };

// export const deleteVideo = (req, res) =>
//   res.render("deleteVideo", { pageTitle: "Delete Video" });

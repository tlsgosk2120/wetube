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

export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}` });
};

export const edit = (req, res) =>
  res.render("edit", { pageTitle: "Edit Video" });

export const search = (req, res) => {
  //   const searchingBy = req.query.term; 아래 쿼리와 같음
  const {
    query: { term: searchingBy },
  } = req;
  res.render("search", { pageTitle: "Search", searchingBy: searchingBy });
};

export const upload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const deleteVideo = (req, res) =>
  res.render("deleteVideo", { pageTitle: "Delete Video" });

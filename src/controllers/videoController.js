import Video from "../models/Video";

export const home = (req, res) => {
  Video.find({}, (error, videos) => {
    return res.render("home", { pageTitle: "Home", videos });
  });
};

export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  // const video = videos[id - 1];
  // video.title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  // here we will add a video to the videos array.
  const { title } = req.body;
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
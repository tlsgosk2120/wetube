import Video from "../models/Video";

// Video.find({}, (error, videos) => {});

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("watch", { pageTitle: video.title, video });
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

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect(`/`);
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
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

import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

// Video.find({}, (error, videos) => {});

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("video/home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        model: "User",
      },
    });

  if (!video) {
    return res.render("video/404", { pageTitle: "Video not found." });
  }
  return res.render("video/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("video/404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("video/edit", {
    pageTitle: `Edit: ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("video/404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("video/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].destination + "/" + thumb[0].filename,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("success", "Upload successful.");
    return res.redirect(`/`);
  } catch (error) {
    return res.status(400).render("video/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id).populate("comments");
  if (!video) {
    return res.render("video/404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);

  const loginUser = await User.findById(video.owner);
  const comments = video.comments;
  if (comments) {
    let commentIds = [];
    comments.forEach((comment) => {
      commentIds.push(comment._id);
    });
    console.log("commentIds", commentIds);
    await Comment.deleteMany({ _id: { $in: commentIds } });
    let newComments = loginUser.comments.filter((comment) => {
      commentIds.forEach((id) => {
        String(comment) !== String(id);
      });
    });
    loginUser.comments = newComments;
  }
  let videos = loginUser.videos.filter((video) => String(video) !== String(id));
  loginUser.videos = videos;
  loginUser.save();
  return res.redirect(`/`);
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("video/search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

// export const registerLikes = async (req, res) => {
//   const { id } = req.params;
//   const video = await Video.findById(id);
//   if (!video) {
//     return res.sendStatus(404);
//   }
//   video.meta.views += 1;
//   await video.save();
//   return res.sendStatus(200);
// };

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  console.log(user);
  const loginUser = await User.findById(user._id);
  loginUser.comments.push(comment._id);
  loginUser.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const comment = await Comment.findById(id);
  if (!comment) {
    req.flash("error", "Comment is not exist.");
    return res.redirect("/");
  }
  if (String(comment.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(id);

  const loginUser = await User.findById(comment.owner);
  let newUserCommnets = loginUser.comments.filter(
    (comment) => String(comment) !== String(id)
  );
  loginUser.comments = newUserCommnets;
  loginUser.save();
  const video = await Video.findById(comment.video);
  let newVideoCommnets = video.comments.filter(
    (comment) => String(comment) !== String(id)
  );
  video.comments = newVideoCommnets;
  video.save();
  return res.sendStatus(201);
};

export const countLike = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const comment = await Comment.findById(id);
  const loginUser = await User.findById(user._id);
  if (loginUser.commentLikes.includes(id)) {
    let newCommentLikes = loginUser.commentLikes.filter(
      (like) => String(like) !== String(id)
    );
    loginUser.commentLikes = newCommentLikes;
    loginUser.save();
    comment.meta.likes -= 1;
    comment.save();
    return res.sendStatus(201);
  }
  loginUser.commentLikes.push(id);
  loginUser.save();
  comment.meta.likes += 1;
  comment.save();
  return res.sendStatus(201);
};

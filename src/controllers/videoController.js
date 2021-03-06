import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import { async } from "regenerator-runtime";
import { isHeroku } from "../middlewares";

// Video.find({}, (error, videos) => {});
// const decodedUrl = decodeURI(window.location.search); 한글 params 얻고 싶을 때

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
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
    const {
        session: {
            user: { _id },
        },
        files: { video, thumb },
        params: { id },
        body: { title, description, hashtags },
    } = req;
    const uploadVideo = await Video.findById(id);
    if (!uploadVideo) {
        return res.render("video/404", { pageTitle: "Video not found." });
    }
    if (String(uploadVideo.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        fileUrl: video ? (isHeroku ? video[0].location : "/" + video[0].path) : uploadVideo.fileUrl,
        thumbUrl: thumb ? (isHeroku ? thumb[0].location : thumb[0].path) : uploadVideo.thumbUrl,
        hashtags: Video.formatHashtags(hashtags.replaceAll(", ", ",")),
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
            fileUrl: isHeroku ? video[0].location : "/" + video[0].path,
            thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
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
                $regex: new RegExp(`${keyword}`, "i"),
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

export const countVideoLike = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    const loginUser = await User.findById(user._id);
    if (loginUser.videoLikes.includes(id)) {
        let newVideoLikes = loginUser.videoLikes.filter((like) => String(like) !== String(id));
        loginUser.videoLikes = newVideoLikes;
        await loginUser.save();
        video.meta.likes -= 1;
        await video.save();
        req.session.user = loginUser;
        return res.sendStatus(201);
    }
    loginUser.videoLikes.push(id);
    await loginUser.save();
    video.meta.likes += 1;
    await video.save();
    req.session.user = loginUser;
    return res.sendStatus(201);
};

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
    await video.save();
    const loginUser = await User.findById(user._id);
    loginUser.comments.push(comment._id);
    await loginUser.save();

    return res.status(201).json({ newCommentId: comment._id });
};

export const editComment = async (req, res) => {
    const {
        params: { id },
        session: { user },
        body: { text },
    } = req;
    const comment = await Comment.findById(id).populate("video").populate("owner");
    if (!comment) {
        req.flash("error", "Comment is not exist.");
        return res.redirect("/");
    }
    if (String(comment.owner._id) !== String(user._id)) {
        return res.status(403).redirect("/");
    }
    await Comment.findByIdAndUpdate(id, {
        text,
        edit: true,
    });
    return res.sendStatus(201);
};

export const deleteComment = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;
    const comment = await Comment.findById(id).populate("video").populate("owner");
    if (!comment) {
        req.flash("error", "Comment is not exist.");
        return res.redirect("/");
    }
    if (String(comment.owner._id) !== String(user._id)) {
        return res.status(403).redirect("/");
    }
    await Comment.findByIdAndDelete(id);

    const loginUser = comment.owner;
    let newUserCommnets = loginUser.comments.filter((comment) => String(comment) !== String(id));
    loginUser.comments = newUserCommnets;
    let newUserCommnetLikes = loginUser.commentLikes.filter((likes) => String(likes) !== String(id));
    loginUser.commentLikes = newUserCommnetLikes;
    await loginUser.save();
    req.session.user = loginUser;
    const video = comment.video;
    let newVideoCommnets = video.comments.filter((comment) => String(comment) !== String(id));
    video.comments = newVideoCommnets;
    await video.save();
    return res.sendStatus(201);
};

export const countCommentLike = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;
    const comment = await Comment.findById(id);
    const loginUser = await User.findById(user._id);
    if (loginUser.commentLikes.includes(id)) {
        let newCommentLikes = loginUser.commentLikes.filter((like) => String(like) !== String(id));
        loginUser.commentLikes = newCommentLikes;
        await loginUser.save();
        comment.meta.likes -= 1;
        await comment.save();
        req.session.user = loginUser;
        return res.sendStatus(201);
    }
    loginUser.commentLikes.push(id);
    await loginUser.save();
    comment.meta.likes += 1;
    await comment.save();
    req.session.user = loginUser;
    return res.sendStatus(201);
};

export const pushHeart = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;
    const comment = await Comment.findById(id).populate("video");
    if (String(user._id) !== String(comment.video.owner._id)) {
        req.flash("error", "Not authorized.");
        return res.redirect("/");
    }
    if (comment.meta.heart) {
        comment.meta.heart = false;
        await comment.save();
        return res.sendStatus(201);
    }
    comment.meta.heart = true;
    await comment.save();
    return res.sendStatus(201);
};

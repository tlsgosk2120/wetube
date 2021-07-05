import User from "../models/User";
import fetch from "node-fetch";
import bcryptjs from "bcryptjs";
import { application } from "express";

export const getJoin = (req, res) => res.render("user/join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(404).render("user/join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(404).render("user/join", {
            pageTitle,
            errorMessage: "This usernam/emaile is already taken.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("user/join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => {
    return res.render("user/login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(400).render("user/login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    }
    const ok = await bcryptjs.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("user/login", {
            pageTitle,
            errorMessage: "Wrong password.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    // res.send(JSON.stringify(json));
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            // set notification
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("user/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, email: sEmail, username: sUsername, avatarUrl },
        },
        body: { name, email, username, location },
        file,
    } = req;
    if (sEmail !== email || sUsername !== username) {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user && user._id.toString() !== _id) {
            return res.status(404).render("user/edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This usernam/emaile is already taken.",
            });
        }
    }
    const updateUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location,
        },
        { new: true }
    );
    req.session.user = updateUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly) {
        return res.redirect("/");
    }
    return res.render("user/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id, password },
        },
        body: { oldPasswod, newPassword, newPassword1 },
    } = req;
    const ok = await bcryptjs.compare(oldPasswod, password);
    if (!ok) {
        return res.status(400).render("user/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is not incorrect.",
        });
    }
    if (newPassword !== newPassword1) {
        return res.status(400).render("user/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmaition.",
        });
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    //send notification
    return res.redirect("/users/logout");
};

export const see = (req, res) => res.render("user/userDetail", { pageTitle: "See User" });

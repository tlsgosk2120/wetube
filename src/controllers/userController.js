import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(404).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(404).render("join", {
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
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const exists = await User.exists({ username });
    if (!exists) {
        return res.status(400).render("login", { pageTitle: "Login", errorMessage: "An account with this username does not exists." });
    }
    // check if password correct
    return res.render("login", { pageTitle: "Login" });
};

export const edit = (req, res) => res.render("edit", { pageTitle: "Edit User" });

export const remove = (req, res) => res.render("removeProfile", { pageTitle: "Remove User" });

export const logout = (req, res) => res.render("logout", { pageTitle: "Logout" });

export const see = (req, res) => res.render("userDetail", { pageTitle: "See User" });

// export const changePassword = (req, res) =>
//   res.render("changePassword", { pageTitle: "Change Password" });

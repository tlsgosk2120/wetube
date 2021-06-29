import User from "../models/User";
import bcryptjs from "bcryptjs";

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
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcryptjs.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password.",
    });
  }
  console.log("LOG USER IN! COMING SOON!");
  return res.redirect("/");
};

export const edit = (req, res) =>
  res.render("edit", { pageTitle: "Edit User" });

export const remove = (req, res) =>
  res.render("removeProfile", { pageTitle: "Remove User" });

export const logout = (req, res) =>
  res.render("logout", { pageTitle: "Logout" });

export const see = (req, res) =>
  res.render("userDetail", { pageTitle: "See User" });

// export const changePassword = (req, res) =>
//   res.render("changePassword", { pageTitle: "Change Password" });

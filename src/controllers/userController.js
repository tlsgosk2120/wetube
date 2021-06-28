export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = (req, res) => {
  console.log(req.body);
  res.end();
};

export const edit = (req, res) =>
  res.render("edit", { pageTitle: "Edit User" });

export const remove = (req, res) =>
  res.render("removeProfile", { pageTitle: "Remove User" });

export const login = (req, res) => res.render("login", { pageTitle: "Login" });

export const logout = (req, res) =>
  res.render("logout", { pageTitle: "Logout" });

export const see = (req, res) =>
  res.render("userDetail", { pageTitle: "See User" });

// export const changePassword = (req, res) =>
//   res.render("changePassword", { pageTitle: "Change Password" });

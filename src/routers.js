// Global

const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const SEARCH = "/search";

// Users

const LOGOUT = "/logout";
const EDIT_PROFILE = "/edit";
const SEE = "/:id";
// const CHANGE_PASSWORD = "/change-password";

// Videos

const WATCH = "/:id([0-9a-f]{24})";
const EDIT_VIDEO = "/:id([0-9a-f]{24})/edit";
const DELETE_VIDEO = "/:id([0-9a-f]{24})/delete";
const UPLOAD = "/upload";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  see: SEE,
  editProfile: EDIT_PROFILE,
  // changePassword: CHANGE_PASSWORD,
  upload: UPLOAD,
  watch: WATCH,
  editVideo: EDIT_VIDEO,
  deleteVideo: DELETE_VIDEO,
};

export default routes;

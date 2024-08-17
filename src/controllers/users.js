export const join = (req, res) => {
  return res.send("join");
};

export const login = (req, res) => {
  return res.send("join");
};

export const edit = (req, res) => {
  return res.send("edit user");
};

export const remove = (req, res) => {
  return res.send("remove user");
};

export const logout = (req, res) => {
  return res.send("remove user");
};

export const see = (req, res) => {
  console.log(req.params);
  return res.send("Watch");
};

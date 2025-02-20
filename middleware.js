const validateTask = (req, res, next) => {
    const { title, status } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required and should be a string" });
    }
    if (status && typeof status !== "string") {
      return res.status(400).json({ error: "Status should be a string" });
    }
    next();
  };
  
  module.exports = { validateTask };
  

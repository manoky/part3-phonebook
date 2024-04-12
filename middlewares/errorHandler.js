const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case "CastError": {
      res.status(400).send({ error: "malformed id" })
      return
    }
    case "ValidationError": {
      res.status(400).json({ error: error.message })
      return
    }
    default:
      next(error)
  }

  next(error)
}

module.exports = errorHandler

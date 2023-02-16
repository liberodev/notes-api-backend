const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({error: 'id used is malformed'}),

  ValidationError: (res, {message}) =>
    res.status(400).send({error: message}),

  JsonWebTokenError: res =>
    res.status(401).json({error: 'invalid token'}),

  TokenExpiredError: (res, {message}) => 
    res.status(511).json({error: message}),

  defaultError: res =>
    res.status(500).end()
}

module.exports = (err, req, res, next) => {
  console.error(err)

  const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError

  handler(res, err)
}

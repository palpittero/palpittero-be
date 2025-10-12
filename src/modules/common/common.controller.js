const updateStatus = async (req, res, model) => {
  const { id } = req.params
  const { status } = req.body

  const record = await model.update({ id, status })

  if (!record) {
    return res.sendStatus(404)
  }

  res.sendStatus(204)
}

export { updateStatus }

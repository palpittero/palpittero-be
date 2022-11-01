import matchesModel from '../../models/matches.model'

const getMatches = async (req, res) => {
  const { status, date, roundId } = req.query
  const matches = await matchesModel.fetchAll({ status, date, roundId })

  res.json({
    data: matches
  })
}

const getMatch = async (req, res) => {
  const id = parseInt(req.params.id)
  const match = await matchesModel.fetchById(id)

  if (!match) {
    return res.sendStatus(404)
  }

  return res.json({
    data: match
  })
}

const createMatch = async (req, res) => {
  const { roundId, homeTeamId, awayTeamId, date } = req.body

  const parsedDate = new Date(date)

  const [id] = await matchesModel.insert({
    roundId,
    homeTeamId,
    awayTeamId,
    date: parsedDate
  })

  res.status(200).json({ data: id })
}

const createMatches = async (req, res) => {
  const { roundId, details } = req.body

  const matches = details.map(({ homeTeamId, awayTeamId, date }) => ({
    homeTeamId,
    awayTeamId,
    roundId,
    date: new Date(date)
  }))

  console.log(matches)

  // const parsedDate = new Date(date)

  await matchesModel.batchInsert(matches)

  res.status(200).json()
}

const updateMatch = async (req, res) => {
  const id = parseInt(req.params.id)
  const match = await matchesModel.fetchById(id)

  if (!match) {
    return res.sendStatus(404)
  }

  const {
    roundId,
    homeTeamId,
    awayTeamId,
    date,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals,
    extraTimeHomeTeamGoals,
    extraTimeAwayTeamGoals,
    penaltiesHomeTeamGoals,
    penaltiesAwayTeamGoals,
    result
    // status
  } = req.body

  const parsedDate = new Date(date)

  await matchesModel.update({
    id,
    roundId,
    homeTeamId,
    awayTeamId,
    date: parsedDate,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals,
    extraTimeHomeTeamGoals,
    extraTimeAwayTeamGoals,
    penaltiesHomeTeamGoals,
    penaltiesAwayTeamGoals,
    result
    // status
  })

  return res.json({
    data: id
  })
}

const deleteMatch = async (req, res) => {
  const id = parseInt(req.params.id)
  const match = await matchesModel.fetchById(id)

  if (!match) {
    return res.sendStatus(404)
  }

  await matchesModel.delete({ id })
  return res.sendStatus(204)
}

const deleteMatches = async (req, res) => {
  const { ids } = req.body
  // const match = await matchesModel.fetchById(id)

  // if (!match) {
  //   return res.sendStatus(404)
  // }

  await matchesModel.batchDelete({ values: ids })
  // await guessesModel.batchDelete({ columnName: 'matchId', values: ids }, false)
  return res.sendStatus(204)
}

export {
  getMatches,
  getMatch,
  createMatch,
  createMatches,
  updateMatch,
  deleteMatch,
  deleteMatches
}

import teamsModel from '../../models/teams.model'
import teamsChampionshipsModel from '../../models/teamsChampionships.model'
import matchesModel from '../../models/matches.model'

const getTeams = async (req, res) => {
  const { query } = req

  const teams = await teamsModel.fetchAll(query)

  res.json({
    data: teams
  })
}

const getTeam = async (req, res) => {
  const id = parseInt(req.params.id)
  const team = await teamsModel.fetchById(id)

  if (!team) {
    return res.sendStatus(404)
  }

  return res.json({
    data: team
  })
}

const createTeam = async (req, res) => {
  const { name, badge } = req.body

  const [id] = await teamsModel.insert({
    name,
    badge
  })

  res.status(201).json({ data: id })
}

const updateTeam = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, badge, status } = req.body

  const team = await teamsModel.fetchById(id)

  if (!team) {
    return res.sendStatus(404)
  }

  await teamsModel.update({
    id,
    name,
    badge,
    status
  })

  return res.json({
    data: id
  })
}

const deleteTeam = async (req, res) => {
  const id = parseInt(req.params.id)
  const team = await teamsModel.fetchById(id)

  if (!team) {
    return res.sendStatus(404)
  }

  await teamsModel.delete({ id })
  return res.sendStatus(204)
}

const deleteTeams = async (req, res) => {
  const { ids } = req.body
  // const team = await teamsModel.fetchById(id)

  // if (!team) {
  // return res.sendStatus(404)
  // }

  await teamsModel.deleteMany({ values: ids })
  // await teamsChampionshipsModel.deleteMany({
  //   columnName: 'teamId',
  //   values: ids
  // })
  // await matchesModel.deleteByTeams(ids)

  return res.sendStatus(204)
}

export { getTeams, getTeam, createTeam, updateTeam, deleteTeam, deleteTeams }

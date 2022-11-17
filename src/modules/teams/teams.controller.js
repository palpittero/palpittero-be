import countriesModel from '../../models/countries.model'
import teamsModel from '../../models/teams.model'
import { safeJSONParse } from '../../utils/misc'

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
  const {
    name,
    type,
    country: rawCountry,
    region,
    nationalDivision,
    status
  } = req.body

  const badge = req.file?.path ? req.file?.path : req.body.badge
  const country = safeJSONParse(rawCountry)

  const [id] = await teamsModel.insert({
    name,
    badge,
    type,
    countryId: country?.id ?? null,
    region,
    nationalDivision,
    status
  })

  res.status(201).json({ data: id })
}

const updateTeam = async (req, res) => {
  const id = parseInt(req.params.id)
  const {
    name,
    type,
    country: rawCountry,
    region: rawRegion,
    nationalDivision: rawNationalDivision,
    status
  } = req.body

  const team = await teamsModel.fetchById(id)

  if (!team) {
    return res.sendStatus(404)
  }

  const badge = req.file?.path ? req.file?.path : req.body.badge
  const country = safeJSONParse(rawCountry)
  const region = safeJSONParse(rawRegion)
  const nationalDivision = safeJSONParse(rawNationalDivision)

  await teamsModel.update({
    id,
    name,
    badge,
    type,
    countryId: country?.id ?? null,
    region,
    nationalDivision,
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

  await teamsModel.batchDelete({ values: ids })

  return res.sendStatus(204)
}

const getCountries = async (req, res) => {
  // const { data } = await axios(process.env.COUNTRIES_API_URL)
  // const countries = data.map(
  //   ({ fifa, cioc, cca2, cca3, translations, flags }) => ({
  //     fifa,
  //     cioc,
  //     cca2,
  //     cca3,
  //     name: translations.por.common,
  //     flag: flags.png
  //   })
  // )
  const countries = await countriesModel.fetchAll()

  res.json({
    data: countries
  })
}

export {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  deleteTeams,
  getCountries
}

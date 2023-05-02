import dashboardModel from '../../models/dashboard.model'

const getGeneralStats = async (req, res) => {
  const { users, leagues, processedGuesses } =
    await dashboardModel.fetchGeneralStats()

  return res.json({
    data: {
      users,
      leagues,
      processedGuesses
    }
  })
}

const getUnprocessedGuesses = async (req, res) => {
  const { leagueId } = req.query
  const matchesGuesses = await dashboardModel.fetchUnprocessedMatchesGuesses({
    leagueId
  })

  const championshipsGuesses =
    await dashboardModel.fetchUnprocessedChampionshipsGuesses({
      leagueId
    })

  return res.json({
    data: {
      matchesGuesses,
      championshipsGuesses
    }
  })
}

export { getGeneralStats, getUnprocessedGuesses }

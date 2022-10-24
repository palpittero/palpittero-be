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
  const result = await dashboardModel.fetchUnprocessedGuesses()

  return res.json({
    data: result?.unprocessedGuesses || 0
  })
}

export { getGeneralStats, getUnprocessedGuesses }

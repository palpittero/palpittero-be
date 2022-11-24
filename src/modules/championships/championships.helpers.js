const parseChampionshipPositions = ({ positions, championshipId }) =>
  positions
    .filter(({ teamId }) => teamId)
    .map(({ teamId, position }) => ({
      teamId,
      position,
      championshipId
    }))

export { parseChampionshipPositions }

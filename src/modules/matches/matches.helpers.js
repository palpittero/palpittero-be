const parseMatchesStatuses = (matches) => {
  return matches.reduce(
    (acc, match) => ({
      ...acc,
      [match.id]: match.status
    }),
    {}
  )
}

export { parseMatchesStatuses }

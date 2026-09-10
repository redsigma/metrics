export function uniqueActivity(events, unique) {
  if (!unique)
    return events

  const repositories = new Set()
  return events.filter(({repo}) => {
    if (repositories.has(repo))
      return false
    repositories.add(repo)
    return true
  })
}

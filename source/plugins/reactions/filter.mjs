export function filterReactions(list, filter, matcher) {
  return Object.entries(list)
    .filter(([_, {value, percentage}]) => !filter || matcher(filter, {"reactions.count": value, "reactions.percentage": percentage * 100}))
    .map(([reaction]) => reaction)
}

const processes = require("child_process")

const runUnique = (events, unique) => {
  const script = `
    import {uniqueActivity} from "./source/plugins/activity/unique.mjs"
    console.log(JSON.stringify(uniqueActivity(${JSON.stringify(events)}, ${unique})))
  `
  return JSON.parse(processes.spawnSync("node", ["--input-type=module", "--eval", script], {encoding: "utf8"}).stdout)
}

test("keeps only the first activity event for each repository", () => {
  const events = [
    {repo: "owner/one", id: 1},
    {repo: "owner/one", id: 2},
    {repo: "owner/two", id: 3},
  ]

  expect(runUnique(events, true)).toEqual([
    {repo: "owner/one", id: 1},
    {repo: "owner/two", id: 3},
  ])
})

test("preserves repeated activity when unique mode is disabled", () => {
  const events = [{repo: "owner/one", id: 1}, {repo: "owner/one", id: 2}]

  expect(runUnique(events, false)).toEqual(events)
})

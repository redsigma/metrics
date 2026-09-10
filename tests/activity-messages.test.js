const processes = require("child_process")

const formatCommits = commits => {
  const script = `
    import {formatActivityCommits} from "./source/plugins/activity/index.mjs"
    console.log(JSON.stringify(formatActivityCommits(${JSON.stringify(commits)})))
  `
  const result = processes.spawnSync("node", ["--input-type=module", "--eval", script], {encoding: "utf8"})
  if (result.status !== 0)
    throw new Error(result.stderr)
  return JSON.parse(result.stdout)
}

test("keeps the commit message from GitHub compare results", () => {
  expect(formatCommits([
    {sha: "123456789", commit: {message: "Fix activity output\n\nMore details"}},
  ])).toEqual([
    {sha: "1234567", message: "Fix activity output\n\nMore details"},
  ])
})

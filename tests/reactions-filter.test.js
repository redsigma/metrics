const processes = require("child_process")

const runFilter = (list, filter) => {
  const script = `
    import {filterReactions} from "./source/plugins/reactions/filter.mjs"
    const list = ${JSON.stringify(list)}
    const result = filterReactions(list, ${JSON.stringify(filter)}, (query, values) => {
      const [field, operator, threshold] = query.match(/^([^:]+):>([0-9.]+)$/).slice(1)
      return values[field] > Number(threshold)
    })
    console.log(JSON.stringify(result))
  `
  return JSON.parse(processes.spawnSync("node", ["--input-type=module", "--eval", script], {encoding: "utf8"}).stdout)
}

test("filters reactions by count without changing reaction data", () => {
  const list = {
    HEART: {value: 2, percentage: 0.2, score: 0.2},
    THUMBS_UP: {value: 8, percentage: 0.8, score: 0.8},
  }

  expect(runFilter(list, "reactions.count:>2")).toEqual(["THUMBS_UP"])
})

test("filters reactions by percentage", () => {
  const list = {
    HEART: {value: 2, percentage: 0.2, score: 0.2},
    THUMBS_UP: {value: 8, percentage: 0.8, score: 0.8},
  }

  expect(runFilter(list, "reactions.percentage:>50")).toEqual(["THUMBS_UP"])
})

import { readFileSync, writeFileSync } from "fs"

const data = JSON.parse(readFileSync("autism_qa.json", "utf8"))
const maxSamples = 10 // change this if you want more

let output = ""

for (let i = 0; i < Math.min(maxSamples, data.length); i++) {
  const qa = data[i]
  if (qa?.question && qa?.answer) {
    output += `SAMPLE "${qa.question}" """\n${qa.answer}\n"""\n\n`
  }
}

writeFileSync("samples.txt", output)

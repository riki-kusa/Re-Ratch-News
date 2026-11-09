import { readFile } from "node:fs/promises";

const fileText = await readFile("./articles.json", "utf8");

console.log(fileText);
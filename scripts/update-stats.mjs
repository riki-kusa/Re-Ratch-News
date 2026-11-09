import { readFile } from "node:fs/promises";

const fileText = await readFile("./articles.json", "utf8");

const articles = JSON.parse(fileText);

console.log(articles);
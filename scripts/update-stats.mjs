import { readFile, writeFile } from "node:fs/promises";

const fileText = await readFile("./articles.json", "utf8");

const articles = JSON.parse(fileText);

console.log(articles);

for (const article of articles) {

    const response = await fetch(
        "https://api.scratch.mit.edu/projects/" + article.id
    );

    const project = await response.json();

    article.favorites = project.stats.favorites;
    article.loves = project.stats.loves;

}
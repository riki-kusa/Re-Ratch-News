import { readFile, writeFile } from "node:fs/promises";

const fileText = await readFile("./articles.json", "utf8");

const articles = JSON.parse(fileText);

for (const article of articles) {

    const response = await fetch(
        "https://api.scratch.mit.edu/projects/" + article.id
    );

    if (!response.ok) {
        throw new Error("API取得失敗: HTTP " + response.status);
    }

    const project = await response.json();

    article.favorites = project.stats.favorites;
    article.loves = project.stats.loves;

}
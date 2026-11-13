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

    if (
        !project.stats ||
        !Number.isInteger(project.stats.favorites) ||
        !Number.isInteger(project.stats.loves)
    ) {
        throw new Error("反応数を取得できませんでした: " + article.id);
    }

    article.favorites = project.stats.favorites;
    article.loves = project.stats.loves;

}
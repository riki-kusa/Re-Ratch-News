import { readFile, writeFile } from "node:fs/promises";

const fileText = await readFile("./articles.json", "utf8");

const articles = JSON.parse(fileText);


const studioResponse = await fetch(
    "https://api.scratch.mit.edu/studios/52054890/projects?limit=40&offset=0"
);

if (!studioResponse.ok) {
    throw new Error("スタジオ取得失敗: HTTP " + studioResponse.status);
}

const studioProjects = await studioResponse.json();

const newProjectIds = [];

for (const studioProject of studioProjects) {

    const exists = articles.some(function(article) {
        return article.id === studioProject.id;
    });

    if (!exists) {
        newProjectIds.push(studioProject.id);
    }

}

console.log("未登録の作品ID:", newProjectIds);

for (const id of newProjectIds) {
    articles.push({ id: id });
}

for (const article of articles) {

    const response = await fetch(
        "https://api.scratch.mit.edu/projects/" + article.id
    );

    if (!response.ok) {
        throw new Error("API取得失敗: HTTP " + response.status);
    }

    const project = await response.json();

    if (
        !project.author ||
        !project.history ||
        typeof project.title !== "string" ||
        typeof project.instructions !== "string" ||
        typeof project.description !== "string" ||
        typeof project.image !== "string" ||
        !Number.isInteger(project.stats.views)
    ) {
        throw new Error("記事情報が不足しています: " + article.id);
    }

    article.favorites = project.stats.favorites;
    article.loves = project.stats.loves;
    article.title = project.title;
    article.body = project.instructions;
    article.credits = project.description;
    article.author = project.author.username;
    article.image = project.image;
    article.sharedAt = project.history.shared;
    article.views = project.stats.views;

}
const jsonText = JSON.stringify(articles, null, 4) + "\n";

await writeFile("./articles.json", jsonText, "utf8");
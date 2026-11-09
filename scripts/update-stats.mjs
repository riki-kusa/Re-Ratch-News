
import { readFile, writeFile } from "node:fs/promises";

const articleFile = new URL("../articles.json", import.meta.url);
const articles = JSON.parse(await readFile(articleFile, "utf8"));

if (!Array.isArray(articles)) {
    throw new Error("articles.json は配列である必要があります。");
}

const updatedArticles = [];

for (const article of articles) {

    const response = await fetch(
        "https://api.scratch.mit.edu/projects/" + article.id,
        { signal: AbortSignal.timeout(15000) }
    );

    if (!response.ok) {
        throw new Error("作品 " + article.id + " の取得に失敗: HTTP " + response.status);
    }

    const project = await response.json();

    const favorites = project.stats?.favorites;
    const loves = project.stats?.loves;

    if (!Number.isInteger(favorites) || !Number.isInteger(loves)) {
        throw new Error("作品 " + article.id + " の星・ハート数を取得できませんでした。");
    }

    updatedArticles.push({
        ...article,
        favorites: favorites,
        loves: loves
    });

    console.log(article.id + ": 星 " + favorites + " / ハート " + loves);
}

await writeFile(articleFile, JSON.stringify(updatedArticles, null, 4) + "\n", "utf8");

console.log("articles.json の統計情報を更新しました。");

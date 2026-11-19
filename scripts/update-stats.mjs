import { readFile, writeFile } from "node:fs/promises";

const fileText = await readFile("./articles.json", "utf8");

let articles = JSON.parse(fileText);

const studioProjects = [];
let offset = 0;

while (true) {

    const studioResponse = await fetch(
        "https://api.scratch.mit.edu/studios/52054890/projects?limit=40&offset=" + offset
    );

    if (!studioResponse.ok) {
        throw new Error("スタジオ取得失敗: HTTP " + studioResponse.status);
    }

    const pageProjects = await studioResponse.json();

    if (!Array.isArray(pageProjects)) {
        throw new Error("スタジオAPIの応答が配列ではありません");
    }

    studioProjects.push(...pageProjects);

    if (pageProjects.length < 40) {
        break;
    }

    offset += 40;
}

const infoResponse = await fetch(
    "https://api.scratch.mit.edu/studios/52054890"
);

if (!infoResponse.ok) {
    throw new Error("スタジオ情報取得失敗: HTTP " + infoResponse.status);
}

const studioInfo = await infoResponse.json();
const reportedCount = studioInfo.stats?.projects;

if (!Number.isInteger(reportedCount)) {
    throw new Error("スタジオの作品数を確認できません");
}

if (
    (reportedCount < 100 && studioProjects.length !== reportedCount) ||
    (reportedCount >= 100 && studioProjects.length < 100)
) {
    throw new Error("スタジオの作品数と取得件数が一致しません");
}


if (studioProjects.length === 0) {
    throw new Error("スタジオの取得結果が空のため、更新を停止します");
}

articles = articles.filter(function(article) {
    return studioProjects.some(function(studioProject) {
        return studioProject.id === article.id;
    });
});


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

// 日本時間を基準に3日単位の期間番号を生成
const period = Math.floor(
    (Date.now() + 9 * 60 * 60 * 1000)
    / (3 * 24 * 60 * 60 * 1000)
);

// 人気順位を計算
const ranked = [...articles].sort((a, b) =>
    (b.favorites * 2 + b.loves) -
    (a.favorites * 2 + a.loves)
);

// 中間3分の1を抽出
const start = Math.floor(ranked.length / 3);
const end = Math.ceil(ranked.length * 2 / 3);
const candidates = ranked.slice(start, end);

// 今の3日間で選ばれた記事を探す
const previous = articles.find(a => a.topicPeriod === period);

// 中間層に残っていれば維持、それ以外なら再抽選
const selected =
    previous && candidates.some(a => a.id === previous.id)
        ? previous
        : candidates[Math.floor(Math.random() * candidates.length)];

// 古い選出情報を消す
for (const article of articles) {
    delete article.topicPeriod;
}

// 選ばれた記事に期間番号を保存
if (selected) {
    selected.topicPeriod = period;
}

const jsonText = JSON.stringify(articles, null, 4) + "\n";

await writeFile("./articles.json", jsonText, "utf8");

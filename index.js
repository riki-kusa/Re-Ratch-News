async function getArticles() {

    if (document.body.dataset.page === "detail") {

        const params = new URLSearchParams(location.search);
        const articleId = params.get("id");
    
        const response = await fetch("../articles.json");
        const articles = await response.json();
        
        const foundArticle = articles.find(function(article) {
            return String(article.id) === articleId;
        });
        
        console.log(foundArticle);

        const detailTitle = document.querySelector(".detail-title");
        detailTitle.textContent = foundArticle.title;

        const imageElement = document.querySelector(".detail-image");
        imageElement.src = foundArticle.image;

        const detailBody = document.querySelector(".detail-body");
        detailBody.textContent = foundArticle.body;

        const detailBody = document.querySelector(".detail-body");
        detailBody.textContent = foundArticle.body;

        const metaElement = document.querySelector(".detail-meta");
        metaElement.textContent = "投稿者：" + foundArticle.author;
    
        return;
    }

    const response = await fetch("./articles.json");

    const articles = await response.json();

    const article = articles[0];

    const titleElement = document.querySelector(".topic .news-title");
    titleElement.textContent = article.title;

    const imageElement = document.querySelector(".topic .news-image");
    imageElement.src = article.image;

    const linkElement = document.querySelector(".topic .news-card");
    linkElement.href = "article/article.html?id=" + article.id;

}

getArticles();
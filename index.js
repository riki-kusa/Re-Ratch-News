async function getArticles() {

    if (document.body.dataset.page === "detail") {

        const params = new URLSearchParams(location.search);
        const articleId = params.get("id");
    
        console.log(articleId);
    
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
async function getArticles() {

    const response = await fetch("./articles.json");

    const articles = await response.json();

    const article = articles[0];

    const titleElement = document.querySelector(".topic .news-title");
    
    titleElement.textContent = article.title;

}

getArticles();
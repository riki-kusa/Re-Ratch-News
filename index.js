async function getArticles() {

    const response = await fetch("./articles.json");

    const articles = await response.json();

    console.log(articles);

}

getArticles();
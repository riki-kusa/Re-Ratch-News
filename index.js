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

        const detailcredits = document.querySelector(".detail-credits");
        detailcredits.textContent = foundArticle.credits;

        const metaElement = document.querySelector(".detail-meta");
        const sharedDate = new Date(foundArticle.sharedAt).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo"});
        metaElement.textContent = sharedDate + " / 投稿者：" + foundArticle.author;

        const linkElement = document.querySelector(".detail-original");
        linkElement.href = "https://scratch.mit.edu/projects/" + foundArticle.id;
    
        return;
    }

    if (document.body.dataset.page === "archive") {

        const response = await fetch("../articles.json");
        const articles = await response.json();
    
        const archiveList = document.querySelector(".archive-list");
        const sampleCard = archiveList.querySelector(".archive-card");
        
        archiveList.replaceChildren();
        
        articles.forEach(function(item) {
            const card = sampleCard.cloneNode(true);
        
            card.querySelector(".archive-title").textContent = item.title;

            card.querySelector("img").src = item.image;

            const sharedDate = new Date(item.sharedAt).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo"});
            card.subtitleElement.textContent = sharedDate + " / " + item.author;

            
        
            archiveList.append(card);
        });
    
        return;
    }

    const response = await fetch("./articles.json");
    const articles = await response.json();

    const latestArticles = articles.slice().sort(function(a, b) {
        return new Date(b.sharedAt) - new Date(a.sharedAt);
    });

    const article = articles[0];

    const titleElement = document.querySelector(".topic .news-title");
    titleElement.textContent = article.title;

    const imageElement = document.querySelector(".topic .news-image");
    imageElement.src = article.image;

    const linkElement = document.querySelector(".topic .news-card");
    linkElement.href = "article/article.html?id=" + article.id;

    const sharedDate = new Date(article.sharedAt).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo"});
    const subtitleElement = document.querySelector(".topic .news-subtitle");
    subtitleElement.textContent = sharedDate + " / " + article.author;

    const latestList = document.querySelector(".latest-list");
    const originalCard = latestList.querySelector(".latest-card");
    
    latestList.replaceChildren();
    
    latestArticles.slice(0, 4).forEach(function(item) {
        const card = originalCard.cloneNode(true);
    
        card.querySelector(".latest-title").textContent = item.title;

        card.querySelector("img").src = item.image;

        card.href =  "article/article.html?id=" + item.id;

        const date = new Date(item.sharedAt).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo"});
        card.querySelector(".latest-date").textContent = date + " / " + item.author;
    
        latestList.append(card);
    });
    

}

getArticles();
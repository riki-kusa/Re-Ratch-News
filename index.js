
function setArticleImage(img, url, fallback) {

    img.onerror = function() {
        img.onerror = null;
        img.src = fallback;
    };

    img.src = url;
}

async function getArticles() {

    if (document.body.dataset.page === "detail") {

        const params = new URLSearchParams(location.search);
        const articleId = params.get("id");

        const response = await fetch("../articles.json");
        const articles = await response.json();
        
        const foundArticle = articles.find(function(article) {
            return String(article.id) === articleId;
        });
        
        document.title = foundArticle.title + " | Re:Ratch News";

        console.log(foundArticle);

        const detailTitle = document.querySelector(".detail-title");
        detailTitle.textContent = foundArticle.title;

        const imageElement = document.querySelector(".detail-image");
        setArticleImage(imageElement, foundArticle.image, "../kari.png");

        const embedElement = document.querySelector(".detail-embed");

        if (foundArticle.id === 1399302174) {

          imageElement.hidden = true;

          embedElement.src = "https://turbowarp.org/" + foundArticle.id + "/embed";
  
          embedElement.hidden = false;
 
        }

        const detailBody = document.querySelector(".detail-body");
            
        const md = window.markdownit({
           html: false,
           linkify: false,
           breaks: true
        });

　　　　　md.disable("image");

　　　　　detailBody.innerHTML = md.render(foundArticle.body);

        const detailcredits = document.querySelector(".detail-credits");
        detailcredits.innerHTML = md.render(foundArticle.credits);

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

        const sortedArticles = articles.slice().sort(function(a, b) {
            return new Date(b.sharedAt) - new Date(a.sharedAt);
        });

        const popularArticles = articles.slice().sort(function(a, b) {
            return (b.favorites * 2 + b.loves) - (a.favorites * 2 + a.loves);
        });
    
        const archiveList = document.querySelector(".archive-list");
        const sampleCard = archiveList.querySelector(".archive-card");
        
        
        function showArchive(articleList) {

            archiveList.replaceChildren();

            articleList.forEach(function(item) {
                const card = sampleCard.cloneNode(true);

                card.querySelector(".archive-title").textContent = item.title;
                setArticleImage(card.querySelector("img"), item.image, "../kari.png");

                const sharedDate = new Date(item.sharedAt).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo"});

                card.querySelector(".archive-date").textContent = sharedDate + " / " + item.author;
                card.querySelector(".archive-desc").textContent = item.body.slice(0, 30) + "…";
                card.href = "../article/article.html?id=" + item.id;

                
                archiveList.append(card);

            });
        }
            
        showArchive(sortedArticles);
        
        const archiveTabs = document.querySelectorAll(".archive-tab");

        archiveTabs.forEach(function(button) {
        
            button.addEventListener("click", function() {
        
                archiveTabs.forEach(function(tab) {
                    tab.classList.remove("is-active");
                    tab.setAttribute("aria-pressed", "false");
                });
        
                button.classList.add("is-active");
                button.setAttribute("aria-pressed", "true");
        
                if (button.dataset.mode === "latest") {
                    showArchive(sortedArticles);
                } else {
                    showArchive(popularArticles);
                }
        
            });
        
        });

        return;
    }

    const response = await fetch("./articles.json");
    const articles = await response.json();

    const latestArticles = articles.slice().sort(function(a, b) {
        return new Date(b.sharedAt) - new Date(a.sharedAt);
    });

    const popularArticles = articles.slice().sort(function(a, b) {
        return (b.favorites * 2 + b.loves) - (a.favorites * 2 + a.loves);
    });
    
    const start = Math.floor(popularArticles.length / 3);
    const end = Math.ceil(popularArticles.length * 2 / 3);

    const topicCandidates = popularArticles.slice(start, end);

const article = articles.find(a => a.topicPeriod !== undefined) ?? topicCandidates[0];

    const titleElement = document.querySelector(".topic .news-title");
    titleElement.textContent = article.title;

    const imageElement = document.querySelector(".topic .news-image");
    setArticleImage(imageElement, article.image, "kari.png");

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

        setArticleImage(card.querySelector("img"), item.image, "kari.png");

        card.href =  "article/article.html?id=" + item.id;

        const date = new Date(item.sharedAt).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo"});
        card.querySelector(".latest-date").textContent = date + " / " + item.author;
    
        latestList.append(card);
    });
    
    const popularGrid = document.querySelector(".popular-grid");
    const originalPopularCard = popularGrid.querySelector(".popular-card");
    
    popularGrid.replaceChildren();
    
    popularArticles.slice(0, 3).forEach(function(item) {
    
        const card = originalPopularCard.cloneNode(true);
    
        card.querySelector(".popular-title").textContent = item.title;
        setArticleImage(card.querySelector("img"), item.image, "kari.png");
    
        const date = new Date(item.sharedAt).toLocaleDateString(
            "ja-JP",
            { timeZone: "Asia/Tokyo" }
        );
    
        card.querySelector(".popular-date").textContent = date + " / " + item.author;
    
        card.href = "article/article.html?id=" + item.id;
    
        popularGrid.append(card);
    
    });
    
}

const maintenanceMode = true;

const params = new URLSearchParams(location.search);

if (params.has("preview")) {
    sessionStorage.setItem("previewMode", "true");
}

const previewMode =
    sessionStorage.getItem("previewMode") === "true";

if (maintenanceMode && !previewMode) {
    location.replace("/Re-Ratch-News/maintenance.html");
} else {
    getArticles();
}

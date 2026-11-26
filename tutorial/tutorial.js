async function getTutorial() {

    const response = await fetch("tutorial.md");
    const content = await response.text();

    console.log(content);

}

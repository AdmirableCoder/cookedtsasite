document.addEventListener("DOMContentLoaded", () => {
  const words = [
    "connection",
    "togetherness",
    "volunteering",
    "collaboration",
    "friendship",
    "belonging",
    "culture",
    "unity",
    "gatherings",
    "service",
    "conversations",
    "nature",
    "inclusion",
    "celebration",
    "community building",
  ];

  let current = 0;
  const target = document.getElementById("dynamic-word");

  function typeWord(word, onComplete) {
    target.textContent = "";
    let progress = 0;

    const type = setInterval(() => {
      target.textContent = word.substring(0, progress + 1);
      progress++;
      if (progress === word.length) {
        clearInterval(type);
        setTimeout(onComplete, 1000);
      }
    }, 100);
  }

  function deleteWord(onComplete) {
    let progress = target.textContent.length;

    const del = setInterval(() => {
      target.textContent = target.textContent.substring(0, progress - 1);
      progress--;
      if (progress === 0) {
        clearInterval(del);
        setTimeout(onComplete, 200);
      }
    }, 60);
  }

  function loopWords() {
    typeWord(words[current], () => {
      deleteWord(() => {
        current = (current + 1) % words.length;
        loopWords();
      });
    });
  }

  loopWords();
});

(function () {
  const daysThreshold = 120; //remove topicos criados a mais de 3 meses
  const accountIdOlderThen = 96594500; // NEW! remove contas criadas por volta de Jun 18, 2023

  removeOldTopicsAndNewAccounts();
  window.addEventListener("scroll", handleScroll);

  function removeOldTopicsAndNewAccounts() {
    const topics = document.querySelectorAll(".structItem--thread");

    topics.forEach((topic) => {
      const dateString = topic
        .querySelector(".structItem-startDate time")
        .getAttribute("data-date-string");
      const userId = topic
        .querySelector(".structItem-iconContainer a")
        .getAttribute("data-user-id");

      const topicDate = new Date(dateString);
      const currentDate = new Date();
      const diffInDays = Math.floor(
        (currentDate - topicDate) / (1000 * 60 * 60 * 24)
      );
      console.log(diffInDays);

      if (diffInDays > daysThreshold || userId >= accountIdOlderThen) {
        topic.style = "display: none;";
      }
    });
  }

  let loading = false;

  function loadMorePosts() {
    if (loading) return;
    loading = true;

    const nextPageLink = document.querySelector(
      "a.pageNav-jump.pageNav-jump--next"
    );

    if (nextPageLink) {
      const nextPageUrl = nextPageLink.href;

      fetch(nextPageUrl)
        .then((response) => response.text())
        .then(handleLoad)
        .catch((error) => {
          console.error("Error:", error);
          loading = false;
        });
    }
  }

  function handleLoad(nextPageHtml) {
    const nextPageContent = document.createElement("div");
    nextPageContent.innerHTML = nextPageHtml;

    const threadList = document.querySelector(
      ".block-outer.block-outer--after"
    );
    document
      .querySelector("div.block-outer.block-outer--after")
      .querySelector("div.block-outer-main").style.display = "none";
    const nextPagePosts = nextPageContent.querySelectorAll(
      ".structItem--thread"
    );

    nextPagePosts.forEach((post) => {
      threadList.appendChild(post);
    });

    loading = false;
  }

  function handleScroll() {
    const scrollThreshold = 6000; // Define o limite de rolagem em pixels
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition > pageHeight - scrollThreshold) {
      removeOldTopicsAndNewAccounts();
      loadMorePosts();
    }
  }
})();

    //============>
    const bookmarkList = document.querySelector(".bookmark-list");
    const bookmarkForm = document.querySelector(".bookmark-form");
    const bookmarkInput = document.querySelector("input[type=text]");
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const apiUrl = "https://opengraph.io/api/1.1/site";
    const appId = "951f082f-af88-4d3f-af53-221655625821";

      //to display saved data
    fillbookmarkList(bookmarks);

    function createbookmark(e) {
        e.preventDefault();
        if (!bookmarkInput.value) {
          alert("Add your bookmark please!");
          return;
        }

        //Grab data from site using API
        const url = encodeURIComponent(bookmarkInput.value);
        fetch(`${apiUrl}/${url}?app_id=${appId}`)
          .then((response) => response.json())
          .then((data) => {
            //add a new bookmark to the bookmarks
            const bookmark = {
              title: data.hybridGraph.title,
              image: data.hybridGraph.image,
              link: data.hybridGraph.url,
              siteName: data.hybridGraph.site_name,
              favicon: data.hybridGraph.favicon,
            };

            bookmarks.push(bookmark);
            fillbookmarkList(bookmarks);
            storeBookmarks(bookmarks);
            bookmarkForm.reset();
          });
      }

      // BOOKMARK FUNCTION FOR ADDING
      function fillbookmarkList(bookmarks = []) {
        const bookmarksHtml = (bookmarkList.innerHTML = bookmarks
          .map((bookmark, i) => {
            return `
   
      <div>
        <div class="bg-gray-200 shadow-lg p-3 rounded-lg relative bookmark " data-id="${i}" >
            <img class="w-6 h-6 mb-4"
            src="${bookmark.favicon}"
            alt="" />

          <button class="absolute top-1 right-1 text-red-600 closeIcon cursor-pointer p-1 rounded-md hover:bg-red-200" data-id="${i}">
            Remove
          </button>
            <a href='${bookmark.link}' target="_blank" >
              <div class="text-md h-14">
                <h1> ${bookmark.title}</h1>
              </div>

              <img class="w-full h-40 rounded-lg shadow-lg object-cover"
                src="${bookmark.image}"
                alt=""/>
            </a>
          </div>
        </div>
          `;
          })
          .join(""));
      }

      //remove bookmark from local
      function removeBookmark(e) {
        if (!e.target.matches(".closeIcon")) return;
        const index = e.target.parentNode.dataset.id;
        bookmarks.splice(index, 1);
        fillbookmarkList(bookmarks);
        storeBookmarks(bookmarks);
      }

      //save that bookmark list to localstorage
      function storeBookmarks(bookmarks = []) {
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      }

      bookmarkForm.addEventListener("submit", createbookmark);
      bookmarkList.addEventListener("click", removeBookmark);

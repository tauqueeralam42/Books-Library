document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://api.freeapi.app/api/v1/public/books";
    const bookContainer = document.getElementById("book-list");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");
    const toggleViewBtn = document.getElementById("toggleView");
    const loadMoreBtn = document.getElementById("loadMore");
    const detailsPanel = document.createElement("div");
  
    detailsPanel.classList.add("details-panel");
    document.body.appendChild(detailsPanel);
  
    let books = [];
    let currentPage = 1;
    let isGridView = true;
  
    // Fetch Books from API
    async function fetchBooks(page = 1) {
      try {
        const response = await fetch(`${API_URL}?page=${page}&limit=9`);
        const data = await response.json();
        console.log(data);
        books = books.concat(data.data.data);
        displayBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
  
    // Display Books
    function displayBooks(filteredBooks) {
      bookContainer.innerHTML = "";
  
      filteredBooks.forEach((book) => {
        const volumeInfo = book.volumeInfo;
        const {
          title,
          authors,
          publisher,
          publishedDate,
          imageLinks,
          infoLink,
          description,
          buyLink,
        } = volumeInfo;
  
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
  
        bookCard.innerHTML = `
          <img src="${imageLinks?.thumbnail || "default.jpg"}" alt="${title}">
          <h3>${title}</h3>
          <p><strong>Author:</strong> ${authors.join(", ")}</p>
          <p><strong>Publisher:</strong> ${publisher}</p>
          <p><strong>Published:</strong> ${publishedDate}</p>
          <button class="more-info-btn" data-title="${title}">More Info</button>
        `;
  
        // Add event listener for More Info button
        bookCard.querySelector(".more-info-btn").addEventListener("click", () => {
          showDetailsPanel({
            title,
            authors,
            publisher,
            publishedDate,
            description,
            buyLink,
            image: imageLinks?.thumbnail || "default.jpg",
          });
        });
  
        bookContainer.appendChild(bookCard);
      });
  
      // Toggle between Grid and List view
      bookContainer.className = isGridView ? "grid-view" : "list-view";
    }
  
    // Show details panel
    function showDetailsPanel(book) {
      detailsPanel.innerHTML = `
        <div class="panel-content">
          <span class="close-btn">&times;</span>
          <img src="${book.image}" alt="${book.title}">
          <h2>${book.title}</h2>
          <p><strong>Author:</strong> ${book.authors.join(", ")}</p>
          <p><strong>Publisher:</strong> ${book.publisher}</p>
          <p><strong>Published:</strong> ${book.publishedDate}</p>
          <p><strong>Description:</strong> ${book.description || "No description available."}</p>
          <a href="${book.buyLink || '#'}" target="_blank" class="buy-btn">Buy Now</a>
        </div>
      `;
      detailsPanel.style.display = "block";
  
      // Close panel event
      detailsPanel.querySelector(".close-btn").addEventListener("click", () => {
        detailsPanel.style.display = "none";
      });
    }
  
    // Search Books
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filteredBooks = books.filter(
        (book) =>
          book.volumeInfo.title.toLowerCase().includes(query) ||
          (book.volumeInfo.authors &&
            book.volumeInfo.authors.some((author) =>
              author.toLowerCase().includes(query)
            ))
      );
      displayBooks(filteredBooks);
    });
  
    // Sorting Books
    sortSelect.addEventListener("change", () => {
      let sortedBooks = [...books];
  
      if (sortSelect.value === "title") {
        sortedBooks.sort((a, b) =>
          a.volumeInfo.title.localeCompare(b.volumeInfo.title)
        );
      } else if (sortSelect.value === "date") {
        sortedBooks.sort(
          (a, b) =>
            new Date(b.volumeInfo.publishedDate) -
            new Date(a.volumeInfo.publishedDate)
        );
      }
  
      displayBooks(sortedBooks);
    });
  
    toggleViewBtn.addEventListener("click", () => {
        isGridView = !isGridView;
        
        // Toggle class for grid or list view
        bookContainer.className = isGridView ? "grid-view" : "list-view";
    
        // Update button text dynamically
        toggleViewBtn.innerHTML = !isGridView 
            ? ` Grid View` 
            : ` List View`;
    
        // Add a smooth scaling effect on click
        toggleViewBtn.style.transform = "scale(0.9)";
        setTimeout(() => {
            toggleViewBtn.style.transform = "scale(1)";
        }, 200);
    
        // Re-render books in the selected view mode
        displayBooks(books);
    });
    
    // Load More Books
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      fetchBooks(currentPage);
    });
  
    // Initial Fetch
    fetchBooks();
  });
  
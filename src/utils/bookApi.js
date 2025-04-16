const GOOGLE_BOOKS_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

export const fetchBookDetails = async (title, author) => {
  try {
    // Clean and encode the search terms
    const cleanQuery = `${title} ${author}`
      .replace(/[^\w\s]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '+');
    
    // Try first with exact title
    let url = `https://corsproxy.io/?${encodeURIComponent(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(title)}"+inauthor:"${encodeURIComponent(author)}"`
    )}`;
    
    // Show API request in UI
    window._lastBookApiRequest = {
      status: 'fetching',
      url: url,
      timestamp: new Date().toISOString(),
      query: { title, author }
    };

    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    let data = await response.json();

    // If exact match fails, try with a simpler query
    if (!response.ok || data.totalItems === 0) {
      url = `https://corsproxy.io/?${encodeURIComponent(
        `https://www.googleapis.com/books/v1/volumes?q=${cleanQuery}`
      )}`;
      
      window._lastBookApiRequest = {
        ...window._lastBookApiRequest,
        status: 'fetching',
        url: url,
        timestamp: new Date().toISOString(),
        note: 'Trying simplified search'
      };

      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      data = await response.json();
    }
    
    if (!response.ok) {
      window._lastBookApiRequest = {
        ...window._lastBookApiRequest,
        status: 'error',
        error: `API Error: ${response.status} - ${JSON.stringify(data.error || data)}`,
        timestamp: new Date().toISOString()
      };
      throw new Error(`Failed to fetch book details: ${response.status}`);
    }
    
    if (!data.items || data.items.length === 0) {
      window._lastBookApiRequest = {
        ...window._lastBookApiRequest,
        status: 'no_results',
        timestamp: new Date().toISOString()
      };
      return null;
    }

    // Get the first result that best matches the title
    const bestMatch = data.items.find(item => 
      item.volumeInfo.title.toLowerCase().includes(title.toLowerCase())
    ) || data.items[0];

    const book = bestMatch.volumeInfo;

    // Show success in UI
    window._lastBookApiRequest = {
      ...window._lastBookApiRequest,
      status: 'success',
      data: {
        title: book.title,
        author: book.authors ? book.authors.join(', ') : author,
        id: bestMatch.id
      },
      timestamp: new Date().toISOString()
    };

    return {
      title: book.title,
      author: book.authors ? book.authors.join(', ') : author,
      synopsis: book.description || null,
      releaseDate: book.publishedDate || null,
      genre: book.categories ? book.categories[0] : null,
      coverImage: book.imageLinks ? (
        // Try to get the largest available image
        book.imageLinks.extraLarge?.replace('http:', 'https:') ||
        book.imageLinks.large?.replace('http:', 'https:') ||
        book.imageLinks.medium?.replace('http:', 'https:') ||
        book.imageLinks.small?.replace('http:', 'https:') ||
        book.imageLinks.thumbnail?.replace('http:', 'https:')
      ) : null,
      isbn: book.industryIdentifiers?.[0]?.identifier || null,
      pageCount: book.pageCount || null,
      publisher: book.publisher || null,
      averageRating: book.averageRating || null,
      ratingsCount: book.ratingsCount || null,
      previewLink: book.previewLink || null
    };
  } catch (error) {
    // Show error in UI with full details
    window._lastBookApiRequest = {
      ...window._lastBookApiRequest,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
    return null;
  }
};

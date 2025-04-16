const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Popular authors in each genre
const popularAuthors = {
  fiction: [
    'Sarah J. Maas',
    'Ali Hazelwood',
    'Colleen Hoover',
    'Rebecca Yarros',
    'Emily Henry',
    'Taylor Jenkins Reid',
    'Penelope Douglas'
  ],
  fantasy: [
    'Sarah J. Maas',
    'Rebecca Yarros',
    'Brandon Sanderson',
    'Jennifer L. Armentrout',
    'Holly Black',
    'Leigh Bardugo',
    'V.E. Schwab'
  ],
  romance: [
    'Ali Hazelwood',
    'Colleen Hoover',
    'Emily Henry',
    'Penelope Douglas',
    'Ana Huang',
    'Lucy Score',
    'Tessa Bailey'
  ],
  sciFi: [
    'Brandon Sanderson',
    'Andy Weir',
    'V.E. Schwab',
    'Pierce Brown',
    'Martha Wells',
    'Adrian Tchaikovsky',
    'Blake Crouch'
  ]
};

// Define genres with their search queries
export const genres = {
  fiction: { 
    name: 'Fiction',
    query: 'subject:fiction',
    popularBooks: [
      'Fourth Wing',
      'Iron Flame',
      'A Court of Thorns and Roses',
      'The Love Hypothesis',
      'Happy Place',
      'House of Earth and Blood',
      'Birthday Girl'
    ]
  },
  fantasy: { 
    name: 'Fantasy',
    query: 'subject:fantasy',
    popularBooks: [
      'Fourth Wing',
      'Iron Flame',
      'A Court of Thorns and Roses',
      'House of Earth and Blood',
      'The Way of Kings',
      'Throne of Glass',
      'From Blood and Ash'
    ]
  },
  romance: { 
    name: 'Romance',
    query: 'subject:romance',
    popularBooks: [
      'The Love Hypothesis',
      'Happy Place',
      'Love Theoretically',
      'Things We Never Got Over',
      'Book Lovers',
      'Beach Read',
      'Beautiful Disaster'
    ]
  },
  sciFi: { 
    name: 'Science Fiction',
    query: 'subject:science+fiction',
    popularBooks: [
      'Project Hail Mary',
      'Mistborn',
      'Red Rising',
      'The Martian',
      'Skyward',
      'Children of Time',
      'Dark Matter'
    ]
  }
};

// Format book data from Google Books API
const formatBookData = (item) => ({
  id: item.id,
  title: item.volumeInfo.title,
  author: item.volumeInfo.authors?.[0] || 'Unknown Author',
  description: item.volumeInfo.description || 'No description available',
  coverImage: item.volumeInfo.imageLinks ? (
    // Try to get the largest available image
    item.volumeInfo.imageLinks.extraLarge?.replace('http:', 'https:') ||
    item.volumeInfo.imageLinks.large?.replace('http:', 'https:') ||
    item.volumeInfo.imageLinks.medium?.replace('http:', 'https:') ||
    item.volumeInfo.imageLinks.small?.replace('http:', 'https:') ||
    item.volumeInfo.imageLinks.thumbnail?.replace('http:', 'https:')
  ) : '/placeholder-book.png',
  rating: item.volumeInfo.averageRating || 0,
  ratingsCount: item.volumeInfo.ratingsCount || 0,
  publishedDate: item.volumeInfo.publishedDate,
  publisher: item.volumeInfo.publisher,
  pageCount: item.volumeInfo.pageCount,
  categories: item.volumeInfo.categories || [],
  language: item.volumeInfo.language,
  previewLink: item.volumeInfo.previewLink,
  amazonLink: `https://www.amazon.com/s?k=${encodeURIComponent(item.volumeInfo.title)}+${encodeURIComponent(item.volumeInfo.authors?.[0] || '')}`,
  price: item.saleInfo?.listPrice?.amount || null,
  currency: item.saleInfo?.listPrice?.currencyCode || null,
  isbn: item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier,
  popularity: calculatePopularityScore(item),
  // Add these fields for react-select compatibility
  value: item.id,
  label: `${item.volumeInfo.title} by ${item.volumeInfo.authors?.[0] || 'Unknown Author'}`
});

// Calculate a popularity score based on various metrics
const calculatePopularityScore = (item) => {
  let score = 0;
  const info = item.volumeInfo;
  const title = info.title || '';
  const author = info.authors?.[0] || '';

  // Check if it's by a popular author
  for (const [genre, authors] of Object.entries(popularAuthors)) {
    if (authors.some(a => author.toLowerCase().includes(a.toLowerCase()))) {
      score += 100;
      break;
    }
  }

  // Check if it's a popular book title
  for (const [genre, { popularBooks }] of Object.entries(genres)) {
    if (popularBooks.some(book => 
      title.toLowerCase().includes(book.toLowerCase()) ||
      book.toLowerCase().includes(title.toLowerCase())
    )) {
      score += 100;
      break;
    }
  }

  // Ratings count weight (up to 50 points)
  score += Math.min((info.ratingsCount || 0) / 1000, 50);
  
  // Average rating weight (up to 50 points)
  score += (info.averageRating || 0) * 10;

  // Recent publication bonus (within last 3 years)
  if (info.publishedDate) {
    const publishYear = new Date(info.publishedDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - publishYear <= 3) {
      score += 30;
    }
  }

  // Adult content bonus (not children's/young adult)
  if (info.categories?.some(cat => 
    !cat.toLowerCase().includes('juvenile') && 
    !cat.toLowerCase().includes('young adult')
  )) {
    score += 20;
  }

  return score;
};

// Search books by query (for VideoUpload component)
export const searchBooks = async (query) => {
  if (!query) return [];
  
  try {
    // First try to find exact matches in our popular books
    const allPopularBooks = Object.values(genres).flatMap(g => g.popularBooks);
    const exactMatches = allPopularBooks.filter(book => 
      book.toLowerCase().includes(query.toLowerCase())
    );

    // Then try to find matches by popular authors
    const allAuthors = Object.values(popularAuthors).flat();
    const authorMatches = allAuthors.filter(author => 
      author.toLowerCase().includes(query.toLowerCase())
    );

    const requests = [
      // Search for exact matches in popular books
      ...exactMatches.map(book => 
        fetch(`${GOOGLE_BOOKS_API}?q=intitle:"${encodeURIComponent(book)}"&maxResults=3&orderBy=relevance&printType=books`)
      ),
      // Search for books by matching authors
      ...authorMatches.map(author => 
        fetch(`${GOOGLE_BOOKS_API}?q=inauthor:"${encodeURIComponent(author)}"&maxResults=3&orderBy=relevance&printType=books`)
      ),
      // General search
      fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=5&orderBy=relevance&printType=books`)
    ];

    const responses = await Promise.all(requests);
    const dataPromises = responses.map(response => response.json());
    const results = await Promise.all(dataPromises);

    const allBooks = results
      .flatMap(data => data.items || [])
      .filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
      .map(formatBookData)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);

    return allBooks;
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

// Get top books by genre
export const getTopBooksByGenre = async (genre, maxResults = 10) => {
  try {
    const genreInfo = genres[genre];
    if (!genreInfo) throw new Error('Invalid genre');

    // Create search queries for popular books and authors
    const queries = [
      // Search for specific popular books in this genre
      ...genreInfo.popularBooks.map(book => 
        fetch(`${GOOGLE_BOOKS_API}?q=intitle:"${encodeURIComponent(book)}"&maxResults=3&orderBy=relevance&printType=books`)
      ),
      // Search for books by popular authors in this genre
      ...(popularAuthors[genre] || []).map(author =>
        fetch(`${GOOGLE_BOOKS_API}?q=inauthor:"${encodeURIComponent(author)}"+${genreInfo.query}&maxResults=5&orderBy=relevance&printType=books`)
      ),
      // General genre search
      fetch(`${GOOGLE_BOOKS_API}?q=${genreInfo.query}+bestseller&maxResults=20&orderBy=relevance&printType=books`)
    ];

    const responses = await Promise.all(queries);
    const dataPromises = responses.map(response => response.json());
    const results = await Promise.all(dataPromises);
    
    // Combine and deduplicate books
    const allBooks = results
      .flatMap(data => data.items || [])
      .filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
      .map(formatBookData)
      .sort((a, b) => b.popularity - a.popularity);

    return allBooks.slice(0, maxResults);
  } catch (error) {
    console.error(`Error fetching ${genre} books:`, error);
    return [];
  }
};

// Get bestsellers (focusing on adult fiction)
export const getBestsellers = async (maxResults = 10) => {
  try {
    const popularBooks = [
      'Fourth Wing',
      'Iron Flame',
      'A Court of Thorns and Roses',
      'The Love Hypothesis',
      'House of Earth and Blood',
      'Happy Place',
      'Things We Never Got Over'
    ];

    // Make multiple requests to get popular books
    const requests = [
      // Search for specific popular books
      ...popularBooks.map(book => 
        fetch(`${GOOGLE_BOOKS_API}?q=intitle:"${encodeURIComponent(book)}"&maxResults=3&orderBy=relevance&printType=books`)
      ),
      // Search for books by popular authors
      ...Object.values(popularAuthors).flat().map(author =>
        fetch(`${GOOGLE_BOOKS_API}?q=inauthor:"${encodeURIComponent(author)}"+bestseller&maxResults=3&orderBy=relevance&printType=books`)
      )
    ];

    const responses = await Promise.all(requests);
    const dataPromises = responses.map(response => response.json());
    const results = await Promise.all(dataPromises);
    
    // Combine and deduplicate books
    const allBooks = results
      .flatMap(data => data.items || [])
      .filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
      .map(formatBookData)
      .sort((a, b) => b.popularity - a.popularity);

    return allBooks.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
};

// Get new releases (focusing on adult fiction)
export const getNewReleases = async (maxResults = 10) => {
  const currentYear = new Date().getFullYear();
  try {
    // Combine popular authors from all genres
    const allPopularAuthors = [...new Set(Object.values(popularAuthors).flat())];
    
    const requests = [
      // Search for new books by popular authors
      ...allPopularAuthors.map(author =>
        fetch(`${GOOGLE_BOOKS_API}?q=inauthor:"${encodeURIComponent(author)}"+publishedDate:${currentYear}&maxResults=3&orderBy=newest&printType=books`)
      ),
      // General new releases search
      fetch(`${GOOGLE_BOOKS_API}?q=subject:fiction+publishedDate:${currentYear}&maxResults=20&orderBy=newest&printType=books`)
    ];

    const responses = await Promise.all(requests);
    const dataPromises = responses.map(response => response.json());
    const results = await Promise.all(dataPromises);
    
    const allBooks = results
      .flatMap(data => data.items || [])
      .filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
      .map(formatBookData)
      .sort((a, b) => b.popularity - a.popularity);

    return allBooks.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
};

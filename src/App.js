import './components/Cart';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Bookstore from './components/Bookstore';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import VideoUpload from './components/VideoUpload';
import { TBRProvider } from './contexts/TBRContext';
import UploadModal from './components/UploadModal';
import TBRList from './components/TBRList';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Bell, Upload, Book, User } from 'lucide-react';
import VideoCard from './components/VideoCard';
import Cart from './components/Cart';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import LoginModal from './components/LoginModal';

// Mock data for genres
const genres = [
  { 
    name: "All Genres",
    color: "#333333",
    subgenres: []
  },
  { 
    name: "Fantasy", 
    color: "#2C5F2D",
    subgenres: ["Epic Fantasy", "Urban Fantasy", "Dark Fantasy", "YA Fantasy", "Romantasy"] 
  },
  { 
    name: "Horror", 
    color: "#A30000",
    subgenres: ["Psychological Horror", "Gothic Horror", "Cosmic Horror", "Folk Horror"] 
  },
  { 
    name: "Thriller", 
    color: "#545454",
    subgenres: ["Psychological Thriller", "Legal Thriller", "Medical Thriller", "Crime Thriller"] 
  },
  { 
    name: "Romance", 
    color: "#B76D68",
    subgenres: ["Contemporary Romance", "Historical Romance", "Paranormal Romance", "Romantic Comedy"] 
  },
  { 
    name: "Mystery", 
    color: "#6A5ACD",
    subgenres: ["Cozy Mystery", "Police Procedural", "Amateur Sleuth", "Historical Mystery"] 
  },
  { 
    name: "Science Fiction", 
    color: "#8B8000",
    subgenres: ["Space Opera", "Cyberpunk", "Post-Apocalyptic", "Hard Science Fiction"] 
  }
];

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      message: 'Sarah commented on your "The Way of Kings" review',
      read: false,
      timestamp: new Date().toISOString(),
      chatId: '123',
      videoId: '456',
      commentId: '789'
    },
    {
      id: 2,
      type: 'like',
      message: 'Alex liked your "Project Hail Mary" review',
      read: true,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      videoId: '457'
    },
    {
      id: 3,
      type: 'comment',
      message: 'New comment on your "Mistborn" discussion',
      read: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      videoId: '458',
      commentId: '790'
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedSubgenre, setSelectedSubgenre] = useState(null);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const handleGenreClick = (genre) => {
    if (selectedGenre?.name === genre.name) {
      setSelectedGenre(null);
      setSelectedSubgenre(null);
    } else {
      setSelectedGenre(genre);
      setSelectedSubgenre(null);
    }
  };

  const handleSubgenreClick = (subgenre) => {
    setSelectedSubgenre(subgenre);
    setShowGenreDropdown(false);
  };

  // Sample data for demonstration
  const sampleVideos = [
    {
      _id: '1',
      title: 'Why You Should Read Fantasy',
      creator: 'BookLover123',
      description: 'Exploring the magic of fantasy literature...',
      videoUrl: 'https://example.com/video1.mp4',
      genre: 'Fantasy',
      subgenre: 'Romantasy',
      views: 1200,
      featuredBooks: [
        {
          book: {
            _id: 'book1',
            title: 'The Name of the Wind',
            author: 'Patrick Rothfuss',
            genre: 'Fantasy'
          }
        }
      ]
    },
    {
      _id: '2',
      title: 'Best Horror Books of 2025',
      creator: 'SpookyReads',
      description: 'The scariest books of the year...',
      videoUrl: 'https://example.com/video2.mp4',
      genre: 'Horror',
      subgenre: 'Gothic Horror',
      views: 800,
      featuredBooks: [
        {
          book: {
            _id: 'book2',
            title: 'Mexican Gothic',
            author: 'Silvia Moreno-Garcia',
            genre: 'Horror'
          }
        }
      ]
    }
  ];

  const [videos] = useState(sampleVideos);
  const [userPreferences] = useState({
    favoriteGenres: ['Fantasy', 'Horror'],
    bookmarkedGenres: ['Romantasy', 'Gothic Horror']
  });

  // Filter videos based on user preferences
  const recommendedVideos = videos.filter(video => 
    userPreferences.favoriteGenres.includes(video.genre) ||
    userPreferences.bookmarkedGenres.includes(video.subgenre)
  );

  useEffect(() => {
    // Sample notifications
    const newNotifications = [
      {
        id: 1,
        type: 'message',
        message: '@BookLover123 sent you a message: "Loved your latest video!"',
        timestamp: new Date(),
        read: false,
        link: '/messages',
        data: {
          chatId: 'chat123',
          userId: 'BookLover123'
        }
      },
      {
        id: 2,
        type: 'bookmark',
        message: '@ReadingRainbow bookmarked your video "Why You Should Read Fantasy"',
        timestamp: new Date(),
        read: false,
        link: '/profile'
      }
    ];
    setNotifications(newNotifications);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLogin(true);
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    // Close notifications dropdown
    setShowNotifications(false);

    // Navigate based on notification type
    if (notification.type === 'message') {
      navigate(`/messages/${notification.chatId}`);
    } else if (notification.type === 'comment') {
      navigate(`/video/${notification.videoId}?comment=${notification.commentId}`);
    } else {
      navigate(notification.link);
    }
  };

  const handleAddToTBR = (book) => {
    setNotification({
      show: true,
      type: 'success',
      message: `${book.title} added to your TBR list!`
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-1">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <Book className="h-8 w-8 text-[#5D4037]" />
                <span className="text-xl font-semibold text-[#5D4037]">BookTalk</span>
              </button>
              <div className="hidden md:block ml-6 flex-1">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search videos..."
                        className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/upload')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Upload Video"
              >
                <Upload className="h-6 w-6 text-gray-600" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                
                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <button 
                            className="text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => {
                              // Mark all as read logic would go here
                            }}
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {notifications.map(notif => (
                          <button
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              notif.read ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.timestamp).toLocaleDateString()} • {new Date(notif.timestamp).toLocaleTimeString()}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Profile"
              >
                <User className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pt-16 pb-24"> {/* Added padding to account for navigation */}
        <Routes>
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/" element={
            <>
              {/* Genre Dropdown */}
              <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="py-4">
                    <div className="relative w-full md:w-72">
                      <button
                        onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                        className="w-full px-5 py-3.5 text-left bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 ease-in-out"
                      >
                        <span className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">
                            {selectedGenre ? selectedGenre.name : 'All Genres'}
                          </span>
                          <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showGenreDropdown ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20" 
                            fill="none" 
                            stroke="currentColor"
                          >
                            <path d="M6 8l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>

                      {/* Dropdown Panel */}
                      {showGenreDropdown && (
                        <div className="fixed inset-0 z-50 md:relative md:inset-auto">
                          {/* Mobile backdrop */}
                          <div 
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden transition-opacity"
                            onClick={() => setShowGenreDropdown(false)}
                          />
                          
                          {/* Dropdown content */}
                          <div className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-auto md:top-full md:mt-2 bg-white rounded-t-2xl md:rounded-xl shadow-xl max-h-[80vh] md:max-h-[460px] overflow-hidden border border-gray-100">
                            {/* Mobile header */}
                            <div className="md:hidden px-6 py-4 border-b sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                              <h3 className="text-lg font-medium text-gray-900">Browse Genres</h3>
                            </div>
                            
                            {/* Genres list */}
                            <div className="overflow-y-auto">
                              {genres.map((genre) => (
                                <div key={genre.name} className="border-b border-gray-50 last:border-0">
                                  <button
                                    onClick={() => handleGenreClick(genre)}
                                    className={`w-full px-5 py-3.5 text-left transition-all duration-200 ${
                                      selectedGenre?.name === genre.name 
                                        ? 'bg-gray-50' 
                                        : 'hover:bg-gray-50/80'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className={`font-medium ${
                                        selectedGenre?.name === genre.name 
                                          ? 'text-gray-900' 
                                          : 'text-gray-700'
                                      }`}>
                                        {genre.name}
                                      </span>
                                      {genre.subgenres.length > 0 && (
                                        <svg 
                                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                            selectedGenre?.name === genre.name ? 'rotate-180' : ''
                                          }`}
                                          viewBox="0 0 20 20" 
                                          fill="none" 
                                          stroke="currentColor"
                                        >
                                          <path d="M6 8l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      )}
                                    </div>
                                  </button>
                                  
                                  {/* Subgenres */}
                                  {selectedGenre?.name === genre.name && genre.subgenres.length > 0 && (
                                    <div className="bg-gray-50/50">
                                      {genre.subgenres.map((subgenre) => (
                                        <button
                                          key={subgenre}
                                          onClick={() => handleSubgenreClick(subgenre)}
                                          className={`w-full pl-12 pr-5 py-3 text-left transition-all duration-200 ${
                                            selectedSubgenre === subgenre 
                                              ? 'bg-gray-100 font-medium text-gray-900' 
                                              : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                                          }`}
                                        >
                                          {subgenre}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {/* Mobile close button */}
                            <div className="md:hidden p-4 border-t sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                              <button
                                onClick={() => setShowGenreDropdown(false)}
                                className="w-full py-3.5 px-5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors duration-200"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Feed */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended For You</h2>
                <div className="grid grid-cols-1 gap-6">
                  {recommendedVideos.map(video => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      onBookmarkToggle={() => {}}
                      onAddToTBR={handleAddToTBR}
                    />
                  ))}
                </div>
              </main>
            </>
          } />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:chatId" element={<Messages />} />
          <Route path="/bookstore" element={<Bookstore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tbr" element={<TBRList />} />
        </Routes>
      </div>

      <Navigation />

      {/* Modals */}
      <Cart isOpen={showCart} onClose={() => setShowCart(false)} items={[]} />
      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} genres={genres} />
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.show}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => {
          // Only allow closing if authenticated
          if (isAuthenticated) {
            setShowLogin(false);
          }
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationsProvider>
          <TBRProvider>
            <AppContent />
          </TBRProvider>
        </NotificationsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

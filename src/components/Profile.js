import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Settings, LogOut, Bookmark, Video, Plus, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EditProfileModal from './EditProfileModal';
import SettingsModal from './SettingsModal';
import BookSynopsis from '../components/BookSynopsis';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: `${user.firstName} ${user.lastName}` || 'Your Name',
        username: user.username || '@username',
        bio: user.bio || 'Tell us about yourself...',
        email: user.email || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || null,
        stats: {
          followers: user.stats?.followers || 0,
          following: user.stats?.following || 0,
          videos: user.stats?.videos || 0
        }
      });
    }
  }, [user]);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Your Name',
    username: user?.username || '@username',
    bio: user?.bio || 'Tell us about yourself...',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePicture: user?.profilePicture || null,
    stats: {
      followers: user?.stats?.followers || 0,
      following: user?.stats?.following || 0,
      videos: user?.stats?.videos || 0
    }
  });

  const handleSaveProfile = async (updatedProfile) => {
    try {
      await updateUser(updatedProfile);
      setProfileData(prev => ({
        ...prev,
        name: updatedProfile.name,
        username: updatedProfile.username,
        bio: updatedProfile.bio,
        profilePicture: updatedProfile.profilePicture
      }));
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const bookmarks = [
    { id: 1, title: 'Why Mistborn is a Must-Read', creator: '@fantasy_fan', thumbnail: 'https://example.com/thumb1.jpg' },
    { id: 2, title: 'Monthly Book Haul', creator: '@booknerd', thumbnail: 'https://example.com/thumb2.jpg' }
  ];

  const uploads = [
    { id: 1, title: 'Book Review: Dune', views: '2.3K', thumbnail: 'https://example.com/thumb3.jpg' },
    { id: 2, title: 'Reading Vlog: Week 23', views: '1.1K', thumbnail: 'https://example.com/thumb4.jpg' }
  ];

  const drafts = [
    { id: 1, title: 'Monthly Wrap-Up', lastEdited: '2 hours ago', thumbnail: 'https://example.com/thumb5.jpg' },
    { id: 2, title: 'Fantasy Book Recommendations', lastEdited: 'Yesterday', thumbnail: 'https://example.com/thumb6.jpg' }
  ];

  const handleBuyClick = (e, book) => {
    e.stopPropagation();
    if (book.amazonLink) {
      window.open(book.amazonLink, '_blank');
    } else {
      const searchQuery = `${book.title} ${book.author}`.replace(/ /g, '+');
      window.open(`https://www.amazon.com/s?k=${searchQuery}&i=stripbooks`, '_blank');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bookmarks':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {bookmarks.map(video => (
              <div key={video.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.creator}</p>
              </div>
            ))}
          </div>
        );
      case 'uploads':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {uploads.map(video => (
              <div key={video.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.views} views</p>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-300 transition-colors cursor-pointer">
              <Plus size={24} className="mb-2" />
              <span className="text-sm font-medium">New Upload</span>
            </div>
          </div>
        );
      case 'drafts':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {drafts.map(draft => (
              <div key={draft.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{draft.title}</h3>
                <p className="text-sm text-gray-500">Last edited: {draft.lastEdited}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSaveProfile}
        initialData={{
          name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          profilePicture: profileData.profilePicture
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D4C5BE] p-6 mb-6">
          <div className="flex justify-between items-start max-w-4xl mx-auto">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-20 h-20 bg-[#D4C5BE] rounded-full overflow-hidden">
                  {profileData.profilePicture ? (
                    <img
                      src={typeof profileData.profilePicture === 'string' ? profileData.profilePicture : URL.createObjectURL(profileData.profilePicture)}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#5D4037]">{profileData.name}</h1>
                  <p className="text-[#8B7B74]">{profileData.username}</p>
                </div>
              </div>
              <p className="text-[#6B4D3C] max-w-lg">{profileData.bio}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditProfile(true)}
                className="p-2 rounded-full hover:bg-[#FAF7F5] transition-colors"
                title="Edit Profile"
              >
                <Edit className="w-5 h-5 text-[#6B4D3C]" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-full hover:bg-[#FAF7F5] transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-[#6B4D3C]" />
              </button>
              <button
                onClick={() => {/* Handle logout */}}
                className="p-2 rounded-full hover:bg-[#FAF7F5] transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-[#6B4D3C]" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6 max-w-4xl mx-auto">
            <div>
              <span className="block font-medium text-[#5D4037]">{profileData.stats.followers}</span>
              <span className="text-sm text-[#8B7B74]">Followers</span>
            </div>
            <div>
              <span className="block font-medium text-[#5D4037]">{profileData.stats.following}</span>
              <span className="text-sm text-[#8B7B74]">Following</span>
            </div>
            <div>
              <span className="block font-medium text-[#5D4037]">{profileData.stats.videos}</span>
              <span className="text-sm text-[#8B7B74]">Videos</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D4C5BE] overflow-hidden">
          <div className="border-b border-[#D4C5BE]">
            <div className="flex">
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'text-[#6B4D3C] border-b-2 border-[#6B4D3C]'
                    : 'text-[#8B7B74] hover:text-[#6B4D3C]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Bookmarks
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'uploads'
                    ? 'text-[#6B4D3C] border-b-2 border-[#6B4D3C]'
                    : 'text-[#8B7B74] hover:text-[#6B4D3C]'
                }`}
              >
                <Video className="w-4 h-4" />
                Uploads
              </button>
            </div>
          </div>
          {renderContent()}
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={user}
          onSave={handleSaveProfile}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
        />
      </div>

      {/* Book Synopsis Modal */}
      {selectedBook && (
        <BookSynopsis book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
};

export default Profile;

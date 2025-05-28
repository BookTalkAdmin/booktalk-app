import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const EditProfileModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    username: initialData?.username || '',
    bio: initialData?.bio || '',
    profilePicture: initialData?.profilePicture || null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.patch(`/users/${user._id}`, formData);
      await updateUser(response.data);
      onSave(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#D4C5BE]">
          <h3 className="text-lg font-medium text-[#6B4D3C]">Edit Profile</h3>
          <button onClick={onClose} className="p-2 text-[#8B7B74] hover:text-[#6B4D3C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#6B4D3C] mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-[#D4C5BE] rounded-lg focus:outline-none focus:border-[#6B4D3C]"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4D3C] mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-2 border border-[#D4C5BE] rounded-lg focus:outline-none focus:border-[#6B4D3C]"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4D3C] mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-2 border border-[#D4C5BE] rounded-lg focus:outline-none focus:border-[#6B4D3C] h-24"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4D3C] mb-1">Profile Picture</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="px-4 py-2 border border-[#D4C5BE] rounded-lg flex items-center space-x-2 hover:bg-[#F5F0ED]"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
              {formData.profilePicture && (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D4C5BE] rounded-lg hover:bg-[#F5F0ED] text-[#6B4D3C]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B4D3C] text-white rounded-lg hover:bg-[#8B7B74] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;

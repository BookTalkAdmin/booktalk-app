import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [previewUrl, setPreviewUrl] = useState(user.profilePicture);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      username,
      bio,
      profilePicture
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#D4C5BE]">
            <h2 className="text-lg font-semibold text-[#6B4D3C]">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 text-[#8B7B74] hover:text-[#6B4D3C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#D4C5BE]">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-sm border border-[#D4C5BE] text-[#6B4D3C] hover:bg-[#FAF7F5] transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-[#6B4D3C] hover:text-[#8B5E3C] transition-colors"
              >
                Change profile picture
              </button>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white"
                placeholder="@username"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white h-24 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#D4C5BE] text-[#6B4D3C] rounded-full hover:bg-[#FAF7F5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B4D3C] text-white rounded-full hover:bg-[#5D4037] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;

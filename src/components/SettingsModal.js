import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, AlertTriangle, Lock, UserCog, Shield, LogOut } from 'lucide-react';
import PrivacyOptionModal from './PrivacyOptionModal';
import ContactEditModal from './ContactEditModal';
import { useAuth } from '../contexts/AuthContext';

const SettingsModal = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activePrivacyOption, setActivePrivacyOption] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [userData, setUserData] = useState({
    email: user.email,
    phone: user.phone
  });
  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    activityStatus: true,
    directMessages: 'friends',
    likedVideos: 'only_you',
    viewers: true,
    favoriteSounds: false,
    followingList: 'everyone'
  });

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const privacyOptions = {
    directMessages: {
      title: 'Direct Messages',
      options: [
        {
          value: 'everyone',
          label: 'Everyone',
          description: 'Any BookTalk user can send you direct messages'
        },
        {
          value: 'friends',
          label: 'Friends',
          description: 'Only followers you follow back can send you messages'
        },
        {
          value: 'no_one',
          label: 'No One',
          description: 'No one can send you direct messages'
        }
      ]
    },
    likedVideos: {
      title: 'Who Can See Your Liked Videos',
      options: [
        {
          value: 'everyone',
          label: 'Everyone',
          description: 'Any BookTalk user can see your liked videos'
        },
        {
          value: 'friends',
          label: 'Friends',
          description: 'Only followers you follow back can see your liked videos'
        },
        {
          value: 'only_you',
          label: 'Only You',
          description: 'Only you can see your liked videos'
        }
      ]
    },
    followingList: {
      title: 'Who Can See Your Following List',
      options: [
        {
          value: 'everyone',
          label: 'Everyone',
          description: 'Any BookTalk user can see who you follow'
        },
        {
          value: 'friends',
          label: 'Friends',
          description: 'Only followers you follow back can see who you follow'
        },
        {
          value: 'no_one',
          label: 'No One',
          description: 'No one can see who you follow'
        }
      ]
    }
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Handle password change logic here
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeactivateAccount = () => {
    // Handle account deactivation logic here
    setShowDeactivateConfirm(false);
    onClose();
  };

  const handleContactSave = (value) => {
    setUserData(prev => ({
      ...prev,
      [editingContact]: value
    }));
  };

  const renderAccountTab = () => (
    <div className="space-y-4">
      {/* Account Information */}
      <div>
        <h3 className="text-sm font-medium text-[#6B4D3C] mb-3">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#FAF7F5] rounded-lg">
            <div>
              <p className="text-sm text-[#8B7B74]">Email</p>
              <p className="text-[#6B4D3C]">{userData.email}</p>
            </div>
            <button
              onClick={() => setEditingContact('email')}
              className="text-sm text-[#6B4D3C] hover:text-[#5D4037]"
            >
              Edit
            </button>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#FAF7F5] rounded-lg">
            <div>
              <p className="text-sm text-[#8B7B74]">Phone</p>
              <p className="text-[#6B4D3C]">{userData.phone || 'Not added'}</p>
            </div>
            <button
              onClick={() => setEditingContact('phone')}
              className="text-sm text-[#6B4D3C] hover:text-[#5D4037]"
            >
              {userData.phone ? 'Edit' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Password */}
      <div>
        <h3 className="text-sm font-medium text-[#6B4D3C] mb-3">Password</h3>
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="flex justify-between items-center w-full p-3 bg-[#FAF7F5] rounded-lg text-left"
          >
            <span className="text-[#6B4D3C]">Change password</span>
            <ChevronRight className="w-4 h-4 text-[#8B7B74]" />
          </button>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 text-[#8B7B74] hover:text-[#6B4D3C] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B4D3C] text-white rounded-lg hover:bg-[#5D4037] transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Deactivate Account */}
      <div>
        <h3 className="text-sm font-medium text-[#6B4D3C] mb-3">Danger Zone</h3>
        {!showDeactivateConfirm ? (
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            className="flex justify-between items-center w-full p-3 bg-red-50 rounded-lg text-left"
          >
            <span className="text-red-600">Deactivate my account</span>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        ) : (
          <div className="p-4 bg-red-50 rounded-lg space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-600 font-medium">Deactivate Account</h4>
                <p className="text-sm text-red-600/80 mt-1">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className="px-4 py-2 text-[#8B7B74] hover:text-[#6B4D3C] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, deactivate my account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 py-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      {/* Discoverability */}
      <div>
        <h3 className="text-sm font-medium text-[#6B4D3C] mb-3">Discoverability</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-start p-3 bg-[#FAF7F5] rounded-lg">
            <div>
              <p className="text-[#6B4D3C] font-medium">Private account</p>
              <p className="text-sm text-[#8B7B74] mt-1">
                With a private account, only people you approve can view your profile and posts. Existing followers won't be affected.
              </p>
            </div>
            <div className="relative inline-flex">
              <button
                onClick={() => handlePrivacyChange('privateAccount', !privacySettings.privateAccount)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.privateAccount ? 'bg-[#6B4D3C]' : 'bg-[#D4C5BE]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    privacySettings.privateAccount ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-start p-3 bg-[#FAF7F5] rounded-lg">
            <div>
              <p className="text-[#6B4D3C] font-medium">Activity status</p>
              <p className="text-sm text-[#8B7B74] mt-1">
                When this is turned on, you and your friends (followers you follow back) will see each other's activity status.
              </p>
            </div>
            <div className="relative inline-flex">
              <button
                onClick={() => handlePrivacyChange('activityStatus', !privacySettings.activityStatus)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.activityStatus ? 'bg-[#6B4D3C]' : 'bg-[#D4C5BE]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    privacySettings.activityStatus ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactions */}
      <div>
        <h3 className="text-sm font-medium text-[#6B4D3C] mb-3">Interactions</h3>
        <div className="space-y-3">
          <button
            onClick={() => setActivePrivacyOption('directMessages')}
            className="flex justify-between items-center w-full p-3 bg-[#FAF7F5] rounded-lg"
          >
            <span className="text-[#6B4D3C]">Direct messages</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8B7B74] capitalize">
                {privacySettings.directMessages.replace('_', ' ')}
              </span>
              <ChevronRight className="w-4 h-4 text-[#8B7B74]" />
            </div>
          </button>

          <button
            onClick={() => setActivePrivacyOption('likedVideos')}
            className="flex justify-between items-center w-full p-3 bg-[#FAF7F5] rounded-lg"
          >
            <span className="text-[#6B4D3C]">Liked videos</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8B7B74] capitalize">
                {privacySettings.likedVideos.replace('_', ' ')}
              </span>
              <ChevronRight className="w-4 h-4 text-[#8B7B74]" />
            </div>
          </button>

          <button
            onClick={() => setActivePrivacyOption('followingList')}
            className="flex justify-between items-center w-full p-3 bg-[#FAF7F5] rounded-lg"
          >
            <span className="text-[#6B4D3C]">Following list</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8B7B74] capitalize">
                {privacySettings.followingList.replace('_', ' ')}
              </span>
              <ChevronRight className="w-4 h-4 text-[#8B7B74]" />
            </div>
          </button>

          <div className="flex justify-between items-center p-3 bg-[#FAF7F5] rounded-lg">
            <span className="text-[#6B4D3C]">Viewers</span>
            <div className="relative inline-flex">
              <button
                onClick={() => handlePrivacyChange('viewers', !privacySettings.viewers)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.viewers ? 'bg-[#6B4D3C]' : 'bg-[#D4C5BE]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    privacySettings.viewers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-[#FAF7F5] rounded-lg">
            <span className="text-[#6B4D3C]">Favorite sounds</span>
            <div className="relative inline-flex">
              <button
                onClick={() => handlePrivacyChange('favoriteSounds', !privacySettings.favoriteSounds)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.favoriteSounds ? 'bg-[#6B4D3C]' : 'bg-[#D4C5BE]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    privacySettings.favoriteSounds ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          <div className="border-b border-[#D4C5BE]">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold text-[#6B4D3C]">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 text-[#8B7B74] hover:text-[#6B4D3C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex border-b border-[#D4C5BE]">
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'account'
                    ? 'text-[#6B4D3C] border-b-2 border-[#6B4D3C]'
                    : 'text-[#8B7B74] hover:text-[#6B4D3C]'
                }`}
              >
                <UserCog className="w-4 h-4" />
                Account
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'privacy'
                    ? 'text-[#6B4D3C] border-b-2 border-[#6B4D3C]'
                    : 'text-[#8B7B74] hover:text-[#6B4D3C]'
                }`}
              >
                <Shield className="w-4 h-4" />
                Privacy
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {activeTab === 'account' ? renderAccountTab() : renderPrivacyTab()}
          </div>

          {/* Privacy Option Modal */}
          {activePrivacyOption && (
            <PrivacyOptionModal
              isOpen={true}
              onClose={() => setActivePrivacyOption(null)}
              title={privacyOptions[activePrivacyOption].title}
              options={privacyOptions[activePrivacyOption].options}
              selectedValue={privacySettings[activePrivacyOption]}
              onSelect={(value) => handlePrivacyChange(activePrivacyOption, value)}
            />
          )}

          {/* Contact Edit Modal */}
          {editingContact && (
            <ContactEditModal
              isOpen={true}
              onClose={() => setEditingContact(null)}
              type={editingContact}
              currentValue={userData[editingContact]}
              onSave={handleContactSave}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;

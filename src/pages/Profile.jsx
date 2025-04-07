import React, { useState } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
    
    // Clear errors when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (profile.newPassword && profile.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (profile.newPassword && !profile.currentPassword) {
      newErrors.currentPassword = 'Current password is required to set a new password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    // Simulate saving with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Reset password fields
    setProfile({
      ...profile,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Hide success message after a delay
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <FiArrowLeft className="mr-2" /> Back to conversations
          </Link>
          
          <h1 className="text-2xl font-bold mb-6">User Profile</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <FiUser size={32} />
                  </div>
                  <div className="ml-4">
                    <Button variant="outline" size="sm">Change Photo</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<FiUser />}
                  fullWidth
                />
                
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<FiMail />}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Change Password</h2>
              
              <Input
                label="Current Password"
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={profile.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                icon={<FiLock />}
                fullWidth
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={profile.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  icon={<FiLock />}
                  fullWidth
                />
                
                <Input
                  label="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={profile.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={<FiLock />}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              
              {saveSuccess && (
                <span className="ml-4 text-green-600">Profile updated successfully!</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
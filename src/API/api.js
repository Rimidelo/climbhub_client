// api.js
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL;

// -------------------
// Existing Axios calls
// -------------------
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const getGyms = async () => {
  try {
    const response = await axios.get(`${API_URL}/gyms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gyms:', error);
    throw error;
  }
};

export const getGymsWithVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/gyms/gyms-with-videos`);
    return response.data; // Array of gyms with videos
  } catch (error) {
    console.error('Error fetching gyms with videos:', error);
    throw error;
  }
};




// -------------------
// Videos
// -------------------
export const uploadVideo = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/videos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const getAllVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/videos`);
    return response.data; // returns an array of video objects
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
};

export const toggleLike = async (videoId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/videos/${videoId}/like`, { userId });
    return response.data; // { message: 'Video liked/unliked', likesCount: number }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Add a comment to a video
export const addComment = async (videoId, commentText, userId) => {
  try {
    const response = await axios.post(`${API_URL}/videos/${videoId}/comment`, { text: commentText, userId });
    return response.data; // Returns the newly added comment
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for a video
export const getComments = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/videos/${videoId}/comments`);
    return response.data; // Array of comments
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Fetch videos uploaded by a specific profile
export const getVideosByProfile = async (profileId) => {
  try {
    const response = await axios.get(`${API_URL}/videos/profile/${profileId}/videos`);
    return response.data; // Returns an array of videos
  } catch (error) {
    console.error('Error fetching uploaded videos:', error);
    throw error;
  }
};

export const deleteVideo = async (videoId) => {
  try {
    const response = await axios.delete(`${API_URL}/videos/${videoId}`);
    return response.data; // { message: 'Video deleted successfully' }
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

export const getVideosByPreferences = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/videos/preferences/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos by preferences:', error);
    throw error;
  }
};

export const getVideosByGym = async (gymId) => {
  try {
    const response = await axios.get(`${API_URL}/videos/gym/${gymId}`);
    return response.data; // Array of videos for the specified gym
  } catch (error) {
    console.error('Error fetching videos by gym:', error);
    throw error;
  }
};

export const toggleSaveVideo = async (videoId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/videos/${videoId}/save`, { userId });
    return response.data;
    // { message: 'Video saved' or 'Video unsaved', savedVideos: [...] }
  } catch (error) {
    console.error('Error toggling save:', error);
    throw error;
  }
};

// -------------------
// Profile
// -------------------

export const createProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${API_URL}/users/${userId}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

export const updateProfile = async (profileId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/profile/${profileId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const searchProfiles = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/profile/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }
};

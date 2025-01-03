import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Modal,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import IosShareIcon from '@mui/icons-material/IosShare';
import { UserContext } from '../../contexts/UserContext';
import { getAllVideos, getComments, toggleLike, addComment } from '../../API/api';

const Reels = () => {
  const { user } = useContext(UserContext);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null); // For comments modal
  const [commentText, setCommentText] = useState(''); // New comment input
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allVideos = await getAllVideos();
        const videosWithComments = await Promise.all(
          allVideos.map(async (video) => {
            const comments = await getComments(video._id);
            return { ...video, comments };
          })
        );
        setVideos(videosWithComments);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load Reels videos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!videos.length) return;

    const options = {
      root: null,
      threshold: 0.75,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoEl = entry.target;
        if (entry.isIntersecting) {
          videoEl.play().catch((err) => {
            console.warn('Cannot play video', err);
          });
        } else {
          videoEl.pause();
        }
      });
    }, options);

    videoRefs.current.forEach((videoEl) => {
      if (videoEl) observer.observe(videoEl);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  const handleLike = async (videoIndex) => {
    if (!user || !user._id) {
      setError('Please log in to like videos.');
      return;
    }

    try {
      const video = videos[videoIndex];
      await toggleLike(video._id, user._id);

      setVideos((prev) =>
        prev.map((v, i) => {
          if (i !== videoIndex) return v;
          const isLiked = v.likes.includes(user._id);
          let updatedLikes = [...v.likes];
          if (isLiked) {
            updatedLikes = updatedLikes.filter((uid) => uid !== user._id);
          } else {
            updatedLikes.push(user._id);
          }
          return {
            ...v,
            likes: updatedLikes,
            likesCount: updatedLikes.length,
          };
        })
      );
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to toggle like.');
    }
  };

  const handleShowComments = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseComments = () => {
    setSelectedVideo(null);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedVideo) return;

    try {
      const newComment = await addComment(selectedVideo._id, commentText.trim(), user._id);
      setSelectedVideo((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };
  

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="black"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        '::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      }}
    >
      {error && (
        <Typography variant="body1" color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {videos.map((video, index) => {
        const isLiked = user && video.likes.includes(user._id);

        return (
          <Box
            key={video._id || index}
            sx={{
              height: '100vh',
              scrollSnapAlign: 'start',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 400,
                aspectRatio: '9 / 16',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.videoUrl}
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  color: '#fff',
                  zIndex: 5,
                  pr: '60px',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {video?.profile?.user?.name || 'Unknown User'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {video.description || 'No Description'}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 80,
                  right: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  color: '#fff',
                  zIndex: 5,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={() => handleLike(index)}
                    sx={{ color: 'white' }}
                  >
                    {isLiked ? (
                      <FavoriteIcon sx={{ fontSize: 28, color: 'red' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 28 }} />
                    )}
                  </IconButton>
                  <Typography variant="body2">
                    {video.likesCount || video.likes.length || 0}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={() => handleShowComments(video)}
                    sx={{ color: 'white' }}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                  <Typography variant="body2">
                    {video.comments?.length || 0}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <IconButton sx={{ color: 'white' }}>
                    <IosShareIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}

      {/* Comments Modal */}
      <Modal open={!!selectedVideo} onClose={handleCloseComments}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {selectedVideo?.comments.map((comment, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={comment.profile?.user?.image}
                  alt={comment.profile?.user?.name}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {comment.profile?.user?.name}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fullWidth
              placeholder="Add a comment..."
            />
            <Button variant="contained" onClick={handleAddComment}>
              Post
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Reels;

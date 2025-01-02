// src/components/VideoPopup/VideoPopup.jsx
import React from 'react';
import { Box, IconButton, Typography, Avatar, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import dayjs from 'dayjs';

const VideoPopup = ({ open, onClose, video, handleLike, setError }) => {
    if (!open || !video) return null;

    const isLiked = video.likes.includes(video.userId); // Replace with actual user logic
    const handleAddComment = () => {
        // Logic to handle adding a comment
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 1300,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            {/* Close Button */}
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: '#fff',
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Popup Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '90%',
                    maxWidth: '1100px',
                    maxHeight: '95%',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: 24,
                }}
            >
                {/* Left Section: Video */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#000',
                        maxHeight: '100%',
                    }}
                >
                    <video
                        src={video.videoUrl}
                        controls
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </Box>

                {/* Right Section: Details */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px',
                        overflowY: 'auto',
                    }}
                >
                    {/* User Info */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        <Avatar
                            src={video.profile?.profilePicture} // Placeholder for user's profile picture
                            alt={video.profile?.user?.name}
                            sx={{ marginRight: '8px' }}
                        />
                        <Typography variant="subtitle1" fontWeight="bold">
                            {video.profile?.user?.name}
                        </Typography>
                    </Box>

                    {/* Comments Section */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            marginBottom: '16px',
                        }}
                    >
                        {video.comments.map((comment, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    marginBottom: '12px',
                                }}
                            >
                                <Avatar
                                    src={comment.profile?.profilePicture}
                                    alt={comment.profile?.user?.name}
                                    sx={{ width: 32, height: 32, marginRight: '8px' }}
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

                    {/* Actions and Likes */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        <IconButton
                            onClick={() => handleLike(video._id)}
                            sx={{ marginRight: '8px' }}
                        >
                            {isLiked ? (
                                <FavoriteIcon color="error" />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>
                        <Typography variant="body2">{video.likes.length} likes</Typography>
                        <IconButton sx={{ marginLeft: 'auto' }}>
                            <ChatBubbleOutlineIcon />
                        </IconButton>
                    </Box>

                    {/* Add Comment */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderTop: '1px solid #ccc',
                            paddingTop: '8px',
                        }}
                    >
                        <TextField
                            placeholder="Add a comment..."
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ marginRight: '8px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleAddComment}
                        >
                            Post
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default VideoPopup;
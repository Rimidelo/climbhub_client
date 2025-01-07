import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import { getVideosByGym } from "../../API/api"; // Import the new API call
import VideoPopup from "../VideoPopup/VideoPopup";

const GymVideos = () => {
  const { gymId } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosData = await getVideosByGym(gymId); // Use the new API call
        setVideos(videosData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [gymId]);

  const filteredVideos = videos.filter((video) =>
    video.difficultyLevel.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Videos
      </Typography>
      <TextField
        select
        label="Filter by Grade"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ marginBottom: 2, width: "200px" }}
      >
        <MenuItem value="">All</MenuItem>
        {["V0", "V1", "V2", "V3", "V4", "V5"].map((grade) => (
          <MenuItem key={grade} value={grade}>
            {grade}
          </MenuItem>
        ))}
      </TextField>
      <Grid container spacing={2}>
        {filteredVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <Box
              sx={{
                position: "relative",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => setSelectedVideo(video)}
            >
              <video
                src={video.videoUrl}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                muted
                playsInline
              />
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  padding: "5px",
                  borderRadius: "4px",
                }}
              >
                {video.difficultyLevel}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      {selectedVideo && (
        <VideoPopup
          open={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          video={selectedVideo}
        />
      )}
    </Box>
  );
};

export default GymVideos;

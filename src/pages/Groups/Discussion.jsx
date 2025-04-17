import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Typography,
  Box,
  Container,
  Paper,
  Divider,
  Button,
  TextField,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Menu,
  MenuItem,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import LoaddingSpinner from "../../components/tools/LoaddingSpinner";
import { ThumbUp, Edit, Delete, Send, MoreVert } from "@mui/icons-material";
import {
  ThumbUpOutlined,
  ThumbUpRounded,
  SendRounded,
  CommentOutlined,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import backendURL from "../../config";
import EgroupURL from "../../config2";

const GroupDiscussionPage = () => {
  const { slug } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.auth);
  const userId = currentUser?.userInfo?.id;

  const email = currentUser?.userInfo?.email;
  const username = currentUser?.userInfo?.name;
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReplyId, setSelectedReplyId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyToDeleteId, setReplyToDeleteId] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const safeFormatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  const handleLikeDiscussion = async () => {
    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/likeDiscussion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            discussionId: discussion._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like/unlike discussion");
      }

      const data = await response.json();

      setDiscussion((prevDiscussion) => ({
        ...prevDiscussion,
        likes: data.likes, // Update likes array from backend response
      }));

      showAlertMessage(data.message, "success");
    } catch (error) {
      console.error("Error liking/unliking discussion:", error);
      showAlertMessage("Failed to like/unlike discussion.", "destructive");
    }
  };

  const fetchDiscussion = async () => {
    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/getDiscussionBySlug/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch discussion");
      }
      const data = await response.json();
      setDiscussion(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching discussion:", err);
      showAlertMessage("Error fetching discussion:.", "destructive");
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussionComments = async () => {
    if (!discussion || !discussion._id) return;

    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/getDiscussionComments/${discussion._id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch discussion comments");
      }
      const data = await response.json();
      setReplies(data.comments);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [slug]);

  useEffect(() => {
    if (discussion) {
      fetchDiscussionComments();
    }
  }, [discussion]);

  const handleCreateComment = async () => {
    console.log("Button Clicked!");
    try {
      const replyData = {
        content: newReply,
        email: email,
        username: username,
        likes: [],
      };

      const response = await fetch(
        `${EgroupURL}/api/discussions/Createcomment/${discussion._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(replyData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create reply");
      }

      const { comment } = await response.json();

      // Update the local state with the new reply
      setReplies((prevReplies) => [...prevReplies, comment]);

      // Fetch updated discussion data to reflect the new comment count
      await fetchDiscussion();

      setNewReply("");
      showAlertMessage("Reply submitted successfully", "success");
    } catch (error) {
      console.error("Error submitting reply:", error);
      showAlertMessage("Failed to submit reply", "destructive");
    }
  };

  const handleCommentEdit = async (replyId, newContent) => {
    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/${discussion._id}/comments/${replyId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newContent,
            userId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit reply");
      }

      await fetchDiscussion();

      setEditingReplyId(null);
      setEditedReplyContent("");
      showAlertMessage("Reply edited successfully!", "success");
    } catch (error) {
      console.error("Error editing reply:", error);
      showAlertMessage(
        "Failed to edit reply. Please try again.",
        "destructive"
      );
    }
  };

  const handleCommentDelete = async (replyId) => {
    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/delete/${discussion._id}/comments/${replyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reply");
      }

      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply._id !== replyId)
      );

      showAlertMessage("Reply deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting reply:", error);
      showAlertMessage(
        "Failed to delete reply. Please try again.",
        "destructive"
      );
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      if (!userId) {
        showAlertMessage("User ID is missing", "destructive");
        return;
      }

      const comment = replies.find((reply) => reply._id === commentId);
      if (!comment) return;

      const response = await fetch(
        `${EgroupURL}/api/discussions/${discussion._id}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }), // Send email instead of userId
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like/unlike comment");
      }

      const updatedComment = await response.json();

      // Update the local state with the new likes array
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === commentId
            ? { ...reply, likes: updatedComment.likes }
            : reply
        )
      );

      showAlertMessage(updatedComment.message, "success");
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      showAlertMessage("Failed to like comment", "destructive");
    }
  };

  const handleMenuOpen = (event, replyId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReplyId(replyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReplyId(null);
  };

  const handleEditClick = (reply) => {
    setEditingReplyId(reply._id);
    setEditedReplyContent(reply.content);
    handleMenuClose();
  };

  const handleDeleteClick = (replyId) => {
    setReplyToDeleteId(replyId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (replyToDeleteId) {
      handleCommentDelete(replyToDeleteId);
      setDeleteDialogOpen(false);
      setReplyToDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setReplyToDeleteId(null);
  };

  const renderDiscussionHeader = () => (
    <Paper
      elevation={3}
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 2,
        background: "linear-gradient(145deg, #f0f4f8 0%, #ffffff 100%)",
      }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#1a2732",
              mb: 2,
            }}>
            {discussion.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={`${discussion?.image}`}
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                border: "2px solid #e0e0e0",
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                }}>
                {discussion?.username || "Anonymous"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posted{" "}
                {safeFormatDate(new Date(discussion.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={
              discussion.likes.includes(email) ? (
                <ThumbUpRounded />
              ) : (
                <ThumbUpOutlined />
              )
            }
            onClick={handleLikeDiscussion}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}>
            {discussion.likes.length} Likes
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body1"
        sx={{
          color: "#34495e",
          lineHeight: 1.6,
        }}>
        {discussion.content}
      </Typography>
    </Paper>
  );

  const renderCommentInput = () => (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "none",
      }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#2c3e50",
          }}>
          <CommentOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
          Add a Comment
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Share your thoughts..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          endIcon={<SendRounded />}
          onClick={handleCreateComment}
          disabled={!newReply.trim()}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}>
          Post Comment
        </Button>
      </CardContent>
    </Card>
  );

  const renderComments = () => (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: "#2c3e50",
        }}>
        Discussion ({replies.length} Comments)
      </Typography>

      {replies.map((reply) => (
        <Card
          key={reply._id}
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: "none",
          }}>
          {editingReplyId === reply._id ? (
            <CardContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editedReplyContent}
                onChange={(e) => setEditedReplyContent(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() =>
                    handleCommentEdit(reply._id, editedReplyContent)
                  }
                  className="bg-red-500 text-white text-sm px-2 py-1 rounded-md transition duration-300 hover:bg-red-600 mr-2">
                  Save
                </button>
                <button
                  onClick={() => setEditingReplyId(null)}
                  className="bg-gray-600 text-white text-sm px-2 py-1 rounded-md transition duration-300 hover:bg-red-900 mr-2">
                  Cancel
                </button>
              </Box>
            </CardContent>
          ) : (
            <>
              <CardHeader
                avatar={
                  <Avatar
                    src={`${reply?.image}`}
                    sx={{
                      width: 35,
                      height: 35,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                }
                title={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#2c3e50",
                    }}>
                    {reply?.username || "Anonymous"}
                  </Typography>
                }
                subheader={
                  <Typography variant="caption" color="text.secondary">
                    {safeFormatDate(reply.createdAt)}
                  </Typography>
                }
                action={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      size="small"
                      color={
                        reply.likes?.includes(userId) ? "primary" : "default"
                      }
                      onClick={() => handleLikeComment(reply._id)}>
                      {reply.likes?.includes(userId) ? (
                        <ThumbUpRounded />
                      ) : (
                        <ThumbUpOutlined />
                      )}
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {reply.likes?.length || 0}
                      </Typography>
                    </IconButton>
                    {email === reply?.email && (
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, reply._id)}>
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {reply.content}
                </Typography>
              </CardContent>
            </>
          )}
        </Card>
      ))}

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            const replyToEdit = replies.find((r) => r._id === selectedReplyId);
            handleEditClick(replyToEdit);
          }}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedReplyId)}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  if (loading) return <LoaddingSpinner />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!discussion) return <Typography>Discussion not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {renderDiscussionHeader()}
      {renderCommentInput()}
      {renderComments()}
      {/* Alert Component */}
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}
    </Container>
  );
};

export default GroupDiscussionPage;

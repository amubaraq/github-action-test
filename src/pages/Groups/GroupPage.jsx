import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { Button } from "@mui/material";
import {
  Users,
  MessageSquare,
  Calendar,
  Plus,
  X,
  Search,
  BookOpen,
  AlertCircle,
  ArrowRight,
  ScrollText,
  LogOut,
} from "lucide-react";
import axios from "axios";
import backendURL from "../../config";
import EgroupURL from "../../config2";
import LoaddingSpinner from "../../components/tools/LoaddingSpinner";

const EGroup = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [groupData, setGroupData] = useState(null);
  const [allDiscussions, setAllDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [openNewDiscussion, setOpenNewDiscussion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const groupId = groupData?.id;
  const userId = userInfo?.id;
  const email = userInfo?.email;
  const name = userInfo?.name;
  console.log(userId);
  console.log(email);
  console.log(name);
  const itemsPerPage = 5;

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const fetchGroupData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${EgroupURL}/api/groups/getGroupBySlug/${slug}`
      );
      setGroupData(response.data);
      setNewDiscussion((prev) => ({
        ...prev,
        category: response.data.category,
      }));
    } catch (error) {
      console.error("Error fetching group data:", error);
      showAlertMessage(
        "Error loading group data. Please try again.",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async () => {
    if (!groupId) {
      console.error("Group ID is missing, skipping fetch.");
      return; // Prevent the request if groupId is undefined
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${EgroupURL}/api/groups/getDiscussionsByGroup/${groupId}`
      );

      // Ensure response is an array
      const discussions = Array.isArray(response.data) ? response.data : [];
      console.log(discussions, "discussions");

      setAllDiscussions(discussions);
      setFilteredDiscussions(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      showAlertMessage(
        "Error loading discussion data. Please try again.",
        "destructive"
      );

      // Set empty arrays on error
      setAllDiscussions([]);
      setFilteredDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!allDiscussions) return;

    const filtered = allDiscussions.filter(
      (discussion) =>
        discussion?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === "All" || discussion?.category === filterCategory)
    );
    setFilteredDiscussions(filtered || []);
    setPage(1);
  }, [searchTerm, filterCategory, allDiscussions]);

  const checkMembership = async () => {
    if (!groupId || !email) return;

    try {
      const response = await axios.post(
        `${EgroupURL}/api/groups/members/${groupId}`,
        { email }
      );
      setIsGroupMember(response.data.isMember);
    } catch (error) {
      console.error("Error checking membership:", error);
      showAlertMessage("Error checking membership status.", "destructive");
    }
  };

  useEffect(() => {
    fetchGroupData();
    fetchDiscussions();
  }, [groupId]);

  useEffect(() => {
    if (groupId && email) {
      checkMembership();
    }
  }, [groupId, email]);

  useEffect(() => {
    const filtered = allDiscussions.filter(
      (discussion) =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === "All" || discussion.category === filterCategory)
    );
    setFilteredDiscussions(filtered);
    setPage(1);
  }, [searchTerm, filterCategory, allDiscussions]);

  const handleJoinGroup = async () => {
    if (!userInfo) {
      showAlertMessage("Please login to join this group.", "destructive");
      return;
    }

    setMembershipLoading(true);
    try {
      // await axios.post(`${EgroupURL}/api/groups/join/${groupId}`, {
      //   userInfo: { user: userInfo.user },
      // });
      await axios.post(`${EgroupURL}/api/groups/join/${groupId}`, {
        email: email,
        id: userId,
        name: name,
      });
      setIsGroupMember(true);
      showAlertMessage("Successfully joined the group!", "success");
      fetchGroupData();
    } catch (error) {
      console.error("Error joining group:", error);
      showAlertMessage(
        error.response?.data?.error || "Error joining group. Please try again.",
        "destructive"
      );
    } finally {
      setMembershipLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!userInfo || !isGroupMember) return;

    setMembershipLoading(true);
    try {
      await axios.post(`${EgroupURL}/api/groups/leave/${groupId}`, {
        email: email,
        id: userId,
        name: name,
      });
      setIsGroupMember(false);
      showAlertMessage("Successfully left the group.", "success");
      fetchGroupData();
    } catch (error) {
      console.error("Error leaving group:", error);
      const errorMessage =
        error.response?.data?.error === "Group creator cannot leave the group"
          ? "Group creators cannot leave their own groups."
          : "Error leaving group. Please try again.";
      showAlertMessage(errorMessage, "destructive");
    } finally {
      setMembershipLoading(false);
    }
  };

  const handleNewDiscussion = () => {
    setOpenNewDiscussion(true);
  };

  const handleCloseNewDiscussion = () => {
    setOpenNewDiscussion(false);
    setNewDiscussion({
      title: "",
      content: "",
      category: groupData?.category || "",
    });
  };

  const handleDiscussionSubmit = async () => {
    if (
      !newDiscussion.title.trim() ||
      !newDiscussion.content.trim() ||
      !newDiscussion.category
    ) {
      showAlertMessage("Please fill in all required fields.", "destructive");
      return;
    }

    try {
      const response = await axios.post(
        `${EgroupURL}/api/discussions/createDiscussion`,
        {
          title: newDiscussion.title,
          content: newDiscussion.content,
          category: newDiscussion.category,
          email: userInfo?.email,
          username: userInfo?.name,
          groupId,
        }
      );

      setAllDiscussions([response.data, ...allDiscussions]);
      console.log(response.data, "response.data");
      handleCloseNewDiscussion();
      showAlertMessage("Discussion created successfully!", "success");
    } catch (error) {
      console.error("Error creating discussion:", error);
      showAlertMessage(
        error.response?.data?.message ||
          "Failed to create discussion. Please try again.",
        "destructive"
      );
    }
  };

  const MembershipButton = () => {
    if (!userInfo) {
      return (
        <Button
          variant="default"
          onClick={() => navigate("/login")}
          className="w-full bg-red-600 hover:bg-red-700">
          Login to Join
          <Users className="ml-2 w-5 h-5" />
        </Button>
      );
    }

    if (isGroupMember) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Member
          </span>
          {groupData?.creator?.email !== userInfo.email && (
            <Button
              onClick={handleLeaveGroup}
              disabled={membershipLoading}
              className="text-sm bg-red-600 hover:bg-red-700">
              {membershipLoading ? "Leaving..." : "Leave Group"}
              <LogOut className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      );
    }

    return (
      <Button
        onClick={handleJoinGroup}
        disabled={membershipLoading}
        className="w-full bg-red-600 hover:bg-red-700">
        {membershipLoading ? "Joining..." : "Join Group"}
        <Users className="ml-2 w-5 h-5" />
      </Button>
    );
  };

  if (loading) {
    return (
      <>
        <LoaddingSpinner />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Group Header Section */}
      <div className="bg-gradient-to-r from-blue-200 to-red-200 rounded-xl text-black shadow-lg mb-8">
        <div className="p-6 md:p-8">
          <div className="flex justify-between">
            <span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {groupData?.Groupname}
              </h1>
            </span>
            <span>
              <MembershipButton />
            </span>
          </div>
          <div className="prose prose-invert max-w-none mb-6 text-lg mid:text-md">
            <div dangerouslySetInnerHTML={{ __html: groupData?.description }} />
          </div>
          <span className="inline-block bg-red-500/40 px-4 py-2 rounded-br-2xl rounded-tl-2xl text-sm font-medium">
            {groupData?.category}
          </span>
        </div>

        {/* Stats Section */}
        <div className="bg-white/40 backdrop-blur-sm p-4 rounded-b-xl border">
          <div className="flex flex-col md:flex-row justify-around items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{groupData?.members?.length || 0} members</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>{allDiscussions?.length || 0} discussions</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                Created {new Date(groupData?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content Section */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ScrollText className="w-6 h-6 text-purple-600" />
                Discussions
              </h2>

              <button
                onClick={handleNewDiscussion}
                disabled={!isGroupMember}
                className="flex items-center text-sm bg-red-600 text-white rounded-lg px-2 py-2 transition-transform duration-300 ease-in-out hover:bg-red-800 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-3 h-3 mr-2" />
                New Discussion
              </button>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
              {!loading && filteredDiscussions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No discussions found
                </div>
              ) : (
                Array.isArray(filteredDiscussions) &&
                filteredDiscussions
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((discussion) => (
                    <div
                      key={discussion?._id || Math.random()}
                      onClick={() =>
                        navigate(`/discussion/${discussion?.slug}`)
                      }
                      className="group p-4 border border-gray-600 rounded-xl hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-medium">
                            {discussion?.author?.name?.[0] || "A"}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-1 group-hover:text-purple-700">
                            {discussion?.title || "Untitled Discussion"}
                          </h3>
                          <div className="text-sm text-gray-600 flex items-center gap-4">
                            <span className="font-medium">
                              {discussion?.username || "Anonymous"}
                            </span>
                            <span>
                              {discussion?.comments?.length || 0} replies
                            </span>
                            <span>
                              {discussion?.comments?.length || 0} likes
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Update pagination to check for array */}
            {Array.isArray(filteredDiscussions) &&
              filteredDiscussions.length > itemsPerPage && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-1">
                    {[
                      ...Array(
                        Math.ceil(filteredDiscussions.length / itemsPerPage)
                      ),
                    ].map((_, i) => (
                      <Button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        variant={page === i + 1 ? "default" : "outline"}
                        className="w-10 h-10 p-0">
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              About the Group
            </h2>
            <p className="text-gray-600 mb-6">
              Dive deep into {groupData?.category} discussions, share knowledge,
              and connect with enthusiasts. Let's build a vibrant community
              together!
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Be respectful and kind to others</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Keep discussions relevant and constructive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>No spam or self-promotion</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleJoinGroup}
              disabled={isGroupMember || !userInfo}
              className="w-auto bg-red-600 hover:bg-red-800 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isGroupMember ? (
                <>
                  <span>Joined</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>Join Group</span>
                  <Users className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* New Discussion Modal */}
      {openNewDiscussion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Start New Discussion</h3>
              <button
                onClick={handleCloseNewDiscussion}
                className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Content
                </label>
                <textarea
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      content: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={newDiscussion.category}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value={newDiscussion.category}>
                    {newDiscussion.category}
                  </option>
                  <option value="General">General</option>
                  <option value="Technology">Technology</option>
                  <option value="Security">Security</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseNewDiscussion}
                className="flex items-center text-sm bg-gray-800 text-white rounded-lg px-2 py-2 transition-transform duration-300 ease-in-out hover:bg-red-800 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>

              <button
                onClick={handleDiscussionSubmit}
                className="flex items-center text-sm bg-red-600 text-white rounded-lg px-2 py-2 transition-transform duration-300 ease-in-out hover:bg-red-800 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                {/* <Plus className="w-3 h-3 mr-2" /> */}
                Publish Discussion
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default EGroup;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaSearch,
  FaUserEdit,
  FaEye,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Added for delete con
  const [deleteId, setDeleteId] = useState(null); // ID of user to delete
  const [showAlert, setShowAlert] = useState(false);
  const { userInfo, token } = useSelector((state) => state.auth);

  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${backendURL}/api/lists/all/users?page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.status === "success") {
          // Assuming API returns user data with a status field (e.g., "active", "inactive")
          setUsers(data.users.data);
          setFilteredUsers(data.users.data);
          setCurrentPage(data.users.current_page);
          setTotalPages(data.users.last_page);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, token]);

  // Search and filter functionality
  useEffect(() => {
    let result = [...users];
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.status &&
            user.status.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Sorting state and function
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Simulate API call for deletion
      const response = await fetch(`${backendURL}/api/users/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== deleteId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== deleteId));
        showAlertMessage(
          `User ID: ${deleteId} deleted successfully!`,
          "success"
        );
      } else {
        showAlertMessage("Failed to delete user", "destructive");
      }
    } catch (err) {
      showAlertMessage("Error deleting user", "destructive");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Alert function
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  // Error handling
  useEffect(() => {
    if (error) {
      showAlertMessage(error, "destructive");
    }
  }, [error]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-gray-100 text-gray-800">
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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-4xl font-extrabold text-center mb-4">
          All Users Management
        </h1>
        <p className="text-center text-lg">
          Manage and monitor all registered users with ease.
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">Verified Users</h3>
          <p className="text-3xl font-bold text-green-600">
            {users.filter((u) => u.is_verified).length}
          </p>
        </div>
        <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold">Unverified Users</h3>
          <p className="text-3xl font-bold text-red-600">
            {users.filter((u) => !u.is_verified).length}
          </p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <div className="flex items-center w-full sm:w-auto">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name, email, role, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 w-full bg-white border-gray-300"
          />
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <FaFilter className="text-gray-500 mr-2" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded p-2 w-full bg-white border-gray-300">
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <FaFilter className="text-gray-500 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2 w-full bg-white border-gray-300">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        className="bg-white/80 rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4">User List</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/90">
                <thead>
                  <tr className="bg-gray-200/50">
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Role",
                      "Status",
                      "Verified",
                      "Email Verified Date",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:bg-gray-300/50"
                        onClick={() =>
                          handleSort(header.toLowerCase().replace(" ", "_"))
                        }>
                        {header}
                        {sortConfig.key ===
                          header.toLowerCase().replace(" ", "_") && (
                          <span>
                            {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-100/50 transition-colors duration-200 even:bg-gray-50/50">
                      <td className="py-2 px-4 border-b">{user.id}</td>
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b  first-letter:uppercase">
                        {user.role}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.status || "N/A"}{" "}
                        {/* Assuming status might not exist */}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.is_verified ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.email_verified_at
                          ? new Date(
                              user.email_verified_at
                            ).toLocaleDateString()
                          : "Not Verified"}
                      </td>

                      <td className="py-2 px-4 border-b flex space-x-2">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-200`}>
                <FaChevronLeft className="mr-2" /> Previous
              </button>
              <span className="text-lg">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-200`}>
                Next <FaChevronRight className="ml-2" />
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;

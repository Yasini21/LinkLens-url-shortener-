import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown, FiChevronUp, FiBarChart2, FiTrash2 } from "react-icons/fi";
import API from "../services/api";

function UrlTable({ urls, fetchUrls }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("clicks");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/url/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUrls();
    } catch (error) {
      console.log(error);
    }
  };

  const getStatus = (url) => {
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return "Expired";
    }
    return "Active";
  };

  const filteredUrls = useMemo(() => {
    const query = searchTerm.toLowerCase();
    const base = urls.filter((url) => {
      const matchesSearch =
        url.originalUrl.toLowerCase().includes(query) ||
        url.shortCode.toLowerCase().includes(query);
      const status = getStatus(url);
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return base.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortBy === "clicks") {
        return (a.clicks - b.clicks) * direction;
      }
      if (sortBy === "createdAt") {
        return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
      }
      if (sortBy === "shortCode") {
        return a.shortCode.localeCompare(b.shortCode) * direction;
      }
      return 0;
    });
  }, [urls, searchTerm, statusFilter, sortBy, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filteredUrls.length / pageSize));
  const pageUrls = filteredUrls.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changeSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="table-container">
      <div className="table-header-row">
        <div>
          <h2>Link Performance</h2>
          <p>Search, filter, and review your active links with confidence.</p>
        </div>
        <div className="table-controls">
          <div className="search-field">
            <FiSearch />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by URL or code"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All</option>
            <option>Active</option>
            <option>Expired</option>
          </select>
        </div>
      </div>

      <div className="table-viewport">
        <table>
          <thead>
            <tr>
              <th>Original URL</th>
              <th className="sortable" onClick={() => changeSort("shortCode")}>Short URL {sortBy === "shortCode" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}</th>
              <th>Status</th>
              <th className="sortable" onClick={() => changeSort("createdAt")}>Created Date {sortBy === "createdAt" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}</th>
            
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageUrls.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  <h3>Nothing matched</h3>
                  <p>Adjust your query or filter to reveal more links.</p>
                </td>
              </tr>
            ) : (
              pageUrls.map((url) => {
                const status = getStatus(url);
                return (
                  <tr key={url._id}>
                    <td className="url-cell">
                      <a href={url.originalUrl} target="_blank" rel="noreferrer" title={url.originalUrl}>
                        {url.originalUrl}
                      </a>
                    </td>
                    <td>
                      <a
                        className="short-link"
                       href={`https://linklens-url-shortener-backend.onrender.com/${url.shortCode}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`https://linklens-url-shortener-backend.onrender.com/${url.shortCode}`}
                      >
                        {url.shortCode}
                      </a>
                    </td>
                    <td>
                      <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                    </td>
                    <td>{new Date(url.createdAt).toLocaleDateString()}</td>
                    
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          className="analytics-btn"
                          onClick={() => navigate(`/analytics/${url._id}`)}
                          aria-label={`View analytics for ${url.shortCode}`}
                        >
                          <FiBarChart2 /> View
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(url._id)}
                          aria-label={`Delete short link ${url.shortCode}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-row">
        <span>{filteredUrls.length} total links</span>
        <div className="pagination-buttons">
          <button disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
            Previous
          </button>
          <span>{currentPage} / {pageCount}</span>
          <button disabled={currentPage >= pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UrlTable;

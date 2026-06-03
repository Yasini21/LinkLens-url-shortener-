import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../pages/dashboard.css";
import UrlForm from "../components/UrlForm";
import UrlTable from "../components/UrlTable";
import { FiLink, FiBarChart2 } from "react-icons/fi";

function Dashboard() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Dashboard Loaded");
  }, []);
  const fetchUrls = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const response = await API.get(
      "/url",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUrls(response.data);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }
};
useEffect(() => {

  fetchUrls();

}, []);
    const topLink =
  urls.length > 0
    ? urls.reduce(
        (best, current) =>
          current.clicks > best.clicks
            ? current
            : best
      )
    : null;

if (loading) {

  return (

    <div className="spinner-container">

      <div className="spinner"></div>

    </div>

  );

}

  return (
  <div>

    <Navbar />

<div className="dashboard-container">

  <div className="hero-section">

    <div>
      <h1>
        Track every click with precision
      </h1>

      <p>
        Create, manage and analyze
        your shortened URLs from
        one dashboard.
      </p>
    </div>

    <button className="secondary-button" onClick={() => navigate("/analytics")}>View Analytics Overview</button>

  </div>

  <div className="stats-container">

    <div className="card">
      <FiLink className="card-icon" />
      <h3>Total URLs</h3>
      <p>{urls.length}</p>
    </div>

    <div className="card">
      <FiBarChart2 className="card-icon" />
      <h3>Total Clicks</h3>
      <p>
        {
          urls.reduce(
            (sum, url) => sum + url.clicks,
            0
          )
        }
      </p>
    </div>
    <div className="card">

  <h3>
    🏆 Top Link
  </h3>

  {
    topLink ? (
      <>
        <p>
          {topLink.shortCode}
        </p>

        <span>
          {topLink.clicks} clicks
        </span>
      </>
    ) : (
      <p>No Data</p>
    )
  }

</div>

  </div>

 <div className="form-card">

  <div className="section-header">

    <h2>Create New Short Link</h2>

    <p>
      Generate trackable short links
      in seconds.
    </p>

  </div>

  <UrlForm fetchUrls={fetchUrls} />

</div>

  <UrlTable
    urls={urls}
    fetchUrls={fetchUrls}
  />

</div>

  </div>
);
}

export default Dashboard;
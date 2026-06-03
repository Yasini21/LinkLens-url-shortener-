import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../pages/dashboard.css";
import UrlForm from "../components/UrlForm";
import UrlTable from "../components/UrlTable";

function Dashboard() {

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

  return (
  <div>

    <Navbar />

    <div className="dashboard-container">

      <div className="stats-container">

        <div className="card">
          <h3>Total URLs</h3>
          <p>{urls.length}</p>
        </div>

        <div className="card">
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

      </div>
<UrlForm fetchUrls={fetchUrls} />
<UrlTable
  urls={urls}
  fetchUrls={fetchUrls}
/>
    </div>

  </div>
);
}

export default Dashboard;
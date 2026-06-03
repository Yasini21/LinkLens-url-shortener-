import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Analytics() {

  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await API.get(
        `/url/${id}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  if (!data) {

    return <h2>Loading...</h2>;

  }

  return (
    <div>

      <h1>Analytics</h1>

      <p>
        Original URL:
        {data.originalUrl}
      </p>

      <p>
        Short Code:
        {data.shortCode}
      </p>

      <p>
        Total Clicks:
        {data.totalClicks}
      </p>

      <p>
        Last Visited:
        {
          data.lastVisited
            ? new Date(
                data.lastVisited
              ).toLocaleString()
            : "Never"
        }
      </p>
      <h3>Recent Visits</h3>

{
  data.recentVisits.length === 0
  ? (
      <p>No Visits Yet</p>
    )
  : (
      <ul>

        {
          data.recentVisits.map(
            (visit) => (

              <li key={visit._id}>

                {
                  new Date(
                    visit.createdAt
                  ).toLocaleString()
                }

              </li>

            )
          )
        }

      </ul>
    )
}

    </div>
  );
}

export default Analytics;
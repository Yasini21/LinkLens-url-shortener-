import API from "../services/api";
import { useNavigate } from "react-router-dom";

function UrlTable({ urls, fetchUrls }) {

  const navigate = useNavigate();

  const handleDelete = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await API.delete(
        `/url/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUrls();

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="table-container">

      <h2>My URLs</h2>

      <table>

        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short Code</th>
            <th>Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {urls.map((url) => (

            <tr key={url._id}>

              <td>{url.originalUrl}</td>

              <td>{url.shortCode}</td>

              <td>{url.clicks}</td>

              <td>

                <button
                  onClick={() =>
                    navigate(
                      `/analytics/${url._id}`
                    )
                  }
                >
                  Analytics
                </button>

                <button
                  onClick={() =>
                    handleDelete(url._id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default UrlTable;
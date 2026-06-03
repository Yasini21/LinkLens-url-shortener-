import { useState } from "react";
import API from "../services/api";

function UrlForm({ fetchUrls }) {

  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await API.post(
  "/url/create",
  {
    originalUrl,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
setShortUrl(
  `http://localhost:5000/${response.data.shortCode}`
);
      setOriginalUrl("");

      fetchUrls();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div>
    <form
      onSubmit={handleSubmit}
      className="url-form"
    >

      <input
        type="text"
        placeholder="Enter URL..."
        value={originalUrl}
        onChange={(e) =>
          setOriginalUrl(e.target.value)
        }
      />

      <button type="submit">

        {
          loading
            ? "Creating..."
            : "Create"
        }

      </button>

    </form>
    {
  shortUrl && (

    <div className="success-card">

      <h3>
        URL Created Successfully 🎉
      </h3>

      <p>
        {shortUrl}
      </p>

      <button
        onClick={() =>
          navigator.clipboard.writeText(
            shortUrl
          )
        }
      >
        Copy
      </button>

    </div>

  )
}
</div>
  );
}

export default UrlForm;
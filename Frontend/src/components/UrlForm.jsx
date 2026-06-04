import { useState } from "react";
import API from "../services/api";
import { FiCopy } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";

function UrlForm({ fetchUrls }) {

  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [customAlias,setCustomAlias] = useState("");
  const [copied,setCopied] = useState(false);

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
    customAlias
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
setShortUrl(
  `https://linklens-url-shortener-backend.onrender.com/${response.data.shortCode}`
);
      setOriginalUrl("");
      setCustomAlias("");

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
          setOriginalUrl(
            e.target.value
          )
        }
      />

      <input
        type="text"
        placeholder="Custom Alias (Optional)"
        value={customAlias}
        onChange={(e) =>
          setCustomAlias(
            e.target.value
          )
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

          <div className="success-row">

            <p>
              {shortUrl}
            </p>

            <button
              type="button"
              className="copy-btn"
              onClick={() => {

                navigator.clipboard.writeText(
                  shortUrl
                );

                setCopied(true);

                setTimeout(() => {
                  setCopied(false);
                }, 2000);

              }}
            >

              {
                copied
                  ? <FiCheck />
                  : <FiCopy />
              }

            </button>

          </div>

          <div className="qr-section">

            <h4>
              Scan QR Code
            </h4>

            <QRCodeCanvas
              value={shortUrl}
              size={140}
            />

          </div>

        </div>

      )
    }

  </div>
);
}

export default UrlForm;
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./AnalyticsPage.css";
import Navbar from "../components/Navbar";
import { FiCopy, FiCheck, FiArrowLeft } from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ["#2563eb", "#0ea5e9", "#22c55e", "#f97316", "#ec4899", "#f43f5e"];

function Analytics() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [copiedField, setCopiedField] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAnalytics();
    }
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/url/${id}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data);
    } catch (error) {
      console.error("Analytics fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBrowser = (userAgent) => {
    const ua = (userAgent || "").toLowerCase();
    if (/edg\//i.test(ua)) return "Edge";
    if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
    if (/chrome|crios|chromium/i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
    if (/firefox|fxios/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua) && !/chrome|crios|chromium/i.test(ua)) return "Safari";
    return "Other";
  };

  const formatDevice = (userAgent) => {
    const ua = (userAgent || "").toLowerCase();
    if (/mobile|iphone|android|blackberry|iemobile|opera mini/i.test(ua)) return "Mobile";
    if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
    return "Desktop";
  };

  const recentVisits = data?.recentVisits || [];
  const shortUrl = `http://localhost:5000/${data?.shortCode || ""}`;

  const analyticsSummary = useMemo(() => {
    const browserCounts = {};
    const deviceCounts = {};
    const referrerCounts = {};
    const regionCounts = {};
    const uniqueVisitors = new Set();

    recentVisits.forEach((visit) => {
      const browser = formatBrowser(visit.userAgent);
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;

      const device = formatDevice(visit.userAgent);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;

      const referrer = visit.referrer?.trim() || "Direct";
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;

      const region = visit.ipAddress?.trim() || "Unknown";
      regionCounts[region] = (regionCounts[region] || 0) + 1;

      uniqueVisitors.add(visit.ipAddress || visit.userAgent || visit._id);
    });

    const sortByCount = (counts) =>
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value }));

    return {
      browserCounts,
      deviceCounts,
      referrerCounts,
      regionCounts,
      uniqueVisitors: uniqueVisitors.size,
      browserData: sortByCount(browserCounts).slice(0, 5),
      deviceData: sortByCount(deviceCounts),
      referrerData: sortByCount(referrerCounts).slice(0, 5),
      regionData: sortByCount(regionCounts).slice(0, 5),
    };
  }, [recentVisits]);

  const trendData = useMemo(() => {
    const grouped = {};
    recentVisits
      .slice()
      .reverse()
      .forEach((visit) => {
        const date = new Date(visit.createdAt);
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        grouped[label] = (grouped[label] || 0) + 1;
      });

    return Object.entries(grouped).map(([date, clicks]) => ({ date, clicks }));
  }, [recentVisits]);

  const copyToClipboard = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => {
      setCopiedField("");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="analytics-page__loader">
        <div className="analytics-page__loader-box">
          <div className="analytics-page__loader-dot"></div>
          <div className="analytics-page__loader-dot"></div>
          <div className="analytics-page__loader-dot"></div>
        </div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="analytics-page">
        <section className="analytics-page__hero">
          <button type="button" className="analytics-page__back" onClick={() => navigate("/dashboard")}> 
            <FiArrowLeft size={16} /> Back to dashboard
          </button>

          <div className="analytics-page__hero-copy">
            <span className="analytics-page__eyebrow">Analytics dashboard</span>
            <h1 className="analytics-page__title">Deep link performance for your shortened URL</h1>
            <p className="analytics-page__subtitle">
              Explore real-time metrics, traffic sources, device mix, and visitor behavior with a premium analytics experience built for SaaS workflows.
            </p>
          </div>
        </section>

        <section className="analytics-page__kpis">
          <article className="analytics-page__kpi-card">
            <div className="analytics-page__kpi-top">
              <span>Total clicks</span>
              <span className="analytics-page__kpi-badge">Lifetime</span>
            </div>
            <strong>{data.totalClicks ?? 0}</strong>
            <p>{recentVisits.length > 0 ? `Last click ${new Date(data.lastVisited || recentVisits[0]?.createdAt).toLocaleString()}` : "No clicks recorded yet."}</p>
          </article>

          <article className="analytics-page__kpi-card">
            <div className="analytics-page__kpi-top">
              <span>Recent visits</span>
              <span className="analytics-page__kpi-badge">Sample</span>
            </div>
            <strong>{recentVisits.length}</strong>
            <p>{analyticsSummary.referrerData.length} top referrers driving page views.</p>
          </article>

          <article className="analytics-page__kpi-card">
            <div className="analytics-page__kpi-top">
              <span>Traffic sources</span>
              <span className="analytics-page__kpi-badge">Referrers</span>
            </div>
            <strong>{Object.keys(analyticsSummary.referrerCounts).length}</strong>
            <p>Unique click origins captured in this analytics snapshot.</p>
          </article>

          <article className="analytics-page__kpi-card">
            <div className="analytics-page__kpi-top">
              <span>Visitor devices</span>
              <span className="analytics-page__kpi-badge">Breakdown</span>
            </div>
            <strong>{Object.keys(analyticsSummary.deviceCounts).length}</strong>
            <p>Desktop, mobile and tablet traffic segments detected.</p>
          </article>
        </section>

        <section className="analytics-page__summary-grid">
          <article className="analytics-page__card analytics-page__link-card">
            <div className="analytics-page__card-heading">
              <span>Original URL</span>
              <button
                type="button"
                className="analytics-page__copy-btn"
                onClick={() => copyToClipboard(data.originalUrl, "original")}
                aria-label="Copy original URL"
              >
                {copiedField === "original" ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
            <p className="analytics-page__link-text">{data.originalUrl}</p>
          </article>

          <article className="analytics-page__card analytics-page__link-card">
            <div className="analytics-page__card-heading">
              <span>Short URL</span>
              <button
                type="button"
                className="analytics-page__copy-btn"
                onClick={() => copyToClipboard(shortUrl, "short")}
                aria-label="Copy short URL"
              >
                {copiedField === "short" ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
            <p className="analytics-page__link-text">{shortUrl}</p>
          </article>
        </section>

        <section className="analytics-page__main-grid">
          <article className="analytics-page__card analytics-page__trend-card">
            <div className="analytics-page__card-heading">
              <span>Click trends</span>
              <span className="analytics-page__context">Recent activity</span>
            </div>
            <div className="analytics-page__chart-container">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 20, right: 6, left: 0, bottom: 6 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="4 6" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} padding={{ left: 4, right: 4 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} width={34} />
                    <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                    <Line type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="analytics-page__empty-state">
                  <p>No click trend data is available yet.</p>
                </div>
              )}
            </div>
          </article>

          <div className="analytics-page__mini-stack">
            <article className="analytics-page__card analytics-page__chart-card">
              <div className="analytics-page__card-heading">
                <span>Browser distribution</span>
                <span className="analytics-page__context">Visitor browsers</span>
              </div>
              <div className="analytics-page__chart-container analytics-page__chart-box">
                {analyticsSummary.browserData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={analyticsSummary.browserData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} stroke="transparent" paddingAngle={5}>
                        {analyticsSummary.browserData.map((entry, index) => (
                          <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                      <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="analytics-page__empty-state">
                    <p>No browser data available yet.</p>
                  </div>
                )}
              </div>
            </article>

            <article className="analytics-page__card analytics-page__chart-card">
              <div className="analytics-page__card-heading">
                <span>Device distribution</span>
                <span className="analytics-page__context">Device traffic</span>
              </div>
              <div className="analytics-page__chart-container analytics-page__chart-box">
                {analyticsSummary.deviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={analyticsSummary.deviceData} layout="vertical" margin={{ top: 8, right: 10, left: 0, bottom: 6 }}>
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} width={90} />
                      <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                      <Bar dataKey="value" radius={[8, 8, 8, 8]} fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="analytics-page__empty-state">
                    <p>No device data available yet.</p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>

        <section className="analytics-page__secondary-grid">
          <article className="analytics-page__card analytics-page__bar-card">
            <div className="analytics-page__card-heading">
              <span>Top referrers</span>
              <span className="analytics-page__context">Where users came from</span>
            </div>
            <div className="analytics-page__chart-container analytics-page__chart-box">
              {analyticsSummary.referrerData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analyticsSummary.referrerData} layout="vertical" margin={{ top: 8, right: 10, left: 0, bottom: 6 }}>
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} width={120} />
                    <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]} fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="analytics-page__empty-state">
                  <p>No referrer information has been captured.</p>
                </div>
              )}
            </div>
          </article>

          <article className="analytics-page__card analytics-page__list-card">
            <div className="analytics-page__card-heading">
              <span>Geographic traffic</span>
              <span className="analytics-page__context">Top source regions</span>
            </div>
            <div className="analytics-page__list-grid">
              {analyticsSummary.regionData.length > 0 ? (
                analyticsSummary.regionData.map((region, index) => (
                  <div key={region.name} className="analytics-page__list-item">
                    <div>
                      <span className="analytics-page__list-name">{region.name}</span>
                      <span className="analytics-page__list-note">{region.value} visits</span>
                    </div>
                    <div className="analytics-page__progress-bar">
                      <div className="analytics-page__progress-fill" style={{ width: `${Math.min((region.value / (analyticsSummary.regionData[0]?.value || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="analytics-page__empty-state">
                  <p>No geographic traffic detected yet.</p>
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="analytics-page__visits-card analytics-page__card">
          <div className="analytics-page__card-heading">
            <span>Recent visits</span>
            <span className="analytics-page__context">Latest visitor activity</span>
          </div>

          {recentVisits.length > 0 ? (
            <div className="analytics-page__visits-list">
              {recentVisits.map((visit) => (
                <div key={visit._id} className="analytics-page__visit-row">
                  <div className="analytics-page__visit-meta">
                    <span className="analytics-page__visit-time">{new Date(visit.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                    <span className="analytics-page__visit-referrer">{visit.referrer?.trim() || "Direct"}</span>
                  </div>
                  <span className="analytics-page__visit-tag">{formatBrowser(visit.userAgent)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="analytics-page__empty-state analytics-page__empty-state--large">
              <p>No visit events have been recorded yet.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Analytics;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../pages/Analytics.css";
import {
  FiBarChart2,
  FiTrendingUp,
  FiZap,
  FiExternalLink,
  FiCopy,
  FiArrowRight,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
} from "recharts";

const KPI_DEFINITIONS = [
  {
    key: "totalLinks",
    title: "Total links",
    label: "Created",
    icon: FiBarChart2,
  },
  {
    key: "totalClicks",
    title: "Total clicks",
    label: "Across all links",
    icon: FiTrendingUp,
  },
  {
    key: "activeLinks",
    title: "Active links",
    label: "Live links",
    icon: FiZap,
  },
  {
    key: "qrCodesGenerated",
    title: "QR codes",
    label: "Generated",
    icon: FiExternalLink,
  },
];

const SOURCE_COLORS = ["#2563eb", "#0ea5e9", "#22c55e", "#f97316"];
const DEVICE_COLORS = ["#38bdf8", "#f59e0b", "#22c55e", "#94a3b8"];

const truncateUrl = (url, maxLength = 40) => {
  if (!url) return "";
  if (url.length <= maxLength) return url;
  const prefix = url.slice(0, 24);
  const suffix = url.slice(-12);
  return `${prefix}...${suffix}`;
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (value) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function OverallAnalytics() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [activeRange, setActiveRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/url/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOverview(response.data);
    } catch (error) {
      console.error("Overview analytics fetch failed", error);
      setError(error.response?.data?.msg || error.message || "Failed to load analytics overview.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (value, id) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(""), 2200);
  };

  const trendData = useMemo(() => {
    if (!overview) return [];
    return activeRange === "7d" ? overview.clickTrend7 : overview.clickTrend30;
  }, [overview, activeRange]);

  const activeKpis = useMemo(() => {
    if (!overview) return [];
    return KPI_DEFINITIONS.map((item) => ({
      ...item,
      value: overview[item.key],
      growth: overview.growth?.[item.key] ?? 0,
    }));
  }, [overview]);

  const baseUrl = window.location.origin;

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-loading">
        <div className="empty-panel">
          <h2>Analytics unavailable</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={fetchOverview}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="analytics-container analytics-dashboard-container">
        <div className="analytics-header analytics-overview-header">
          <div>
            <p className="eyebrow">Analytics</p>
            <h1>Performance dashboard</h1>
            <p className="analytics-description">
              Track your links, clicks, traffic sources, device mix, and top conversions in one clean SaaS dashboard.
            </p>
          </div>
          <button className="primary-button" onClick={() => navigate("/dashboard")}>Back to dashboard</button>
        </div>

        <div className="analytics-kpi-grid analytics-dashboard-kpis">
          {activeKpis.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.growth >= 0;
            return (
              <div key={kpi.key} className="kpi-card kpi-card-dashboard">
                <div className="kpi-card-top">
                  <span className="kpi-icon-wrapper">
                    <Icon />
                  </span>
                  <span className="kpi-badge">{kpi.label}</span>
                </div>
                <div className="kpi-card-body">
                  <h2>{kpi.value ?? 0}</h2>
                  <p>{kpi.title}</p>
                </div>
                <div className={`kpi-growth ${isPositive ? "positive" : "negative"}`}>
                  <span>{isPositive ? "+" : ""}{kpi.growth}%</span>
                  <small>{kpi.growth >= 0 ? "vs last week" : "since last week"}</small>
                </div>
              </div>
            );
          })}
        </div>

        <div className="analytics-panels">
          <section className="panel card-panel trend-panel">
            <div className="panel-header">
              <div>
                <h2>Click trends</h2>
                <p>Live visit growth for the last {activeRange === "7d" ? "7" : "30"} days.</p>
              </div>
              <div className="range-toggle">
                <button
                  type="button"
                  className={activeRange === "7d" ? "active" : ""}
                  onClick={() => setActiveRange("7d")}
                >
                  7 days
                </button>
                <button
                  type="button"
                  className={activeRange === "30d" ? "active" : ""}
                  onClick={() => setActiveRange("30d")}
                >
                  30 days
                </button>
              </div>
            </div>
            <div className="chart-card chart-card-large">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={trendData} margin={{ top: 18, right: 16, left: -10, bottom: 6 }}>
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.24} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 6" stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--text-soft)", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-soft)", fontSize: 12 }} />
                    <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
                    <Area type="monotone" dataKey="value" stroke="none" fill="url(#trendGradient)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-panel">No trend data available yet.</div>
              )}
            </div>
          </section>

          <aside className="aside-panels">
            <section className="panel chart-card source-panel">
              <div className="panel-header">
                <div>
                  <h3>Traffic sources</h3>
                  <p>Where your clicks are coming from.</p>
                </div>
              </div>
              <div className="chart-card chart-card-small">
                {overview.trafficSources?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={overview.trafficSources}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                      >
                        {overview.trafficSources.map((entry, index) => (
                          <Cell key={entry.name} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-panel">No traffic source data yet.</div>
                )}
              </div>
            </section>

            <section className="panel chart-card device-panel">
              <div className="panel-header">
                <div>
                  <h3>Device distribution</h3>
                  <p>How visitors access your links.</p>
                </div>
              </div>
              <div className="chart-card chart-card-small">
                {overview.deviceDistribution?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={overview.deviceDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={56}
                        outerRadius={88}
                        paddingAngle={4}
                      >
                        {overview.deviceDistribution.map((entry, index) => (
                          <Cell key={entry.name} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-panel">Device metrics unavailable yet.</div>
                )}
              </div>
            </section>
          </aside>
        </div>

        <div className="analytics-bottom-grid">
          <section className="panel bar-panel">
            <div className="panel-header">
              <div>
                <h2>Top performing links</h2>
                <p>Highest click activity from your most engaged URLs.</p>
              </div>
            </div>
            <div className="chart-card chart-card-bar">
              {overview.topLinks?.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    layout="vertical"
                    data={overview.topLinks}
                    margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
                  >
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 6" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "var(--text-soft)", fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="shortCode"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--text)", fontSize: 12 }}
                      width={120}
                    />
                    <Tooltip wrapperStyle={{ borderRadius: 16, borderColor: "rgba(148,163,184,0.18)" }} />
                    <Bar dataKey="clicks" radius={[10, 10, 10, 10]} fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-panel">Top links are not available yet.</div>
              )}
            </div>
          </section>

          <aside className="panel activity-panel">
            <div className="activity-section">
              <div className="panel-header">
                <div>
                  <h3>Top links</h3>
                  <p>Quick access to your strongest performers.</p>
                </div>
              </div>
              <div className="top-links-grid">
                {overview.topLinks?.map((link) => {
                  const shortUrl = `${baseUrl}/${link.shortCode}`;
                  return (
                    <div key={link._id} className="link-card">
                      <div className="link-card-header">
                        <div>
                          <p className="link-card-label">{link.shortCode}</p>
                          <h4 title={link.originalUrl}>{truncateUrl(link.originalUrl)}</h4>
                        </div>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label="Copy link"
                          onClick={() => copyText(shortUrl, link._id)}
                        >
                          <FiCopy />
                        </button>
                      </div>
                      <div className="link-card-meta">
                        <span>{link.clicks} clicks</span>
                        <span>{formatDate(link.createdAt)}</span>
                      </div>
                      <button
                        type="button"
                        className="link-action-button"
                        onClick={() => navigate(`/analytics/${link._id}`)}
                      >
                        View analytics
                        <FiArrowRight />
                      </button>
                      {copiedId === link._id && <p className="copy-feedback">Copied short link</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="activity-section timeline-section">
              <div className="panel-header">
                <div>
                  <h3>Recent activity</h3>
                  <p>Latest link creation and click events.</p>
                </div>
              </div>
              <ul className="activity-list">
                {overview.recentActivity?.length > 0 ? (
                  overview.recentActivity.map((event, index) => (
                    <li key={`${event.type}-${index}`} className="activity-item">
                      <span className={`activity-dot activity-${event.type}`} />
                      <div className="activity-copy">
                        <p>
                          {event.type === "created" ? "Link created" : "Link clicked"}
                          <span title={event.originalUrl}>/{event.shortCode}</span>
                        </p>
                        <small>{formatTime(event.date)}</small>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="empty-panel">No recent activity yet.</li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default OverallAnalytics;

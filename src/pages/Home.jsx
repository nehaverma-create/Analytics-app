import GetStarted from "../components/GetStarted";
import logo from "../assets/logo.png";
import track from "../assets/track.png";
import svg2 from "../assets/svg2.png";
import svg3 from "../assets/svg3.png";
import svg4 from "../assets/svg4.png";
const Home = () => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-nav">
          <div className="home-logoBox">
            <img src={logo}  className="home-logoIcon" />

            <span className="home-logoText">
              <p>Track Analytics</p>
            </span>
          </div>

          <GetStarted variant="link" isShowProfile />
        </div>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <h1 className="home-heroTitle">
          Powerful Analytics for <br />
          <span className="home-gradientText">Your Websites</span>
        </h1>

        <p className="home-heroDesc">
          Track visitor behavior, understand user journeys, and make
          data-driven decisions. Real-time analytics that help you grow your
          business.
        </p>

        <GetStarted />
      </section>

      {/* Features */}
      <section className="home-featuresSection">
        <h2 className="home-sectionTitle">
          Everything you need to understand your audience
        </h2>

        <p className="home-sectionSubtitle">
          Comprehensive analytics features designed for modern websites
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">
          <img src={track}/></div>
            <h3 className="feature-title">Real-Time Tracking</h3>

            <p className="feature-desc">
              Monitor active visitors and page views as they happen in
              real-time
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">
            <img src={svg2}/></div>
            <h3 className="feature-title">Detailed Reports</h3>

            <p className="feature-desc">
              Comprehensive analytics with visitor counts, sessions, and page
              views
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">
            <img src={svg3}/></div>
            <h3 className="feature-title">Advanced Filters</h3>

            <p className="feature-desc">
              Filter by device type, browser, country, and time ranges
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">
            <img src={svg4}/></div>
            <h3 className="feature-title">Time Series Data</h3>

            <p className="feature-desc">
              Visualize trends with daily, weekly, and monthly analytics charts
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="home-stepsSection">
        <div className="home-stepsBox">
          <h2 className="home-sectionTitle">
            Simple setup, powerful insights
          </h2>

          <p className="home-sectionSubtitle">
            Get started in minutes. Add our lightweight tracking script to your
            website and start collecting valuable analytics data immediately.
          </p>

          <div className="home-stepsGrid">
            <div className="home-stepItem">
              <div className="home-stepNumber">1</div>

              <h3 className="home-stepTitle">Create Account</h3>

              <p className="home-stepDesc">
                Sign up for free and create your first website project
              </p>
            </div>

            <div className="home-stepItem">
              <div className="home-stepNumber">2</div>

              <h3 className="home-stepTitle">Add Tracking Code</h3>

              <p className="home-stepDesc">
                Copy and paste our tracking script into your website
              </p>
            </div>

            <div className="home-stepItem">
              <div className="home-stepNumber">3</div>

              <h3 className="home-stepTitle">View Analytics</h3>

              <p className="home-stepDesc">
                Start tracking visitors and analyzing your website performance
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
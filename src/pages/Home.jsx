import {
  Activity,
  BarChart3,
  DollarSign,
  LayoutGrid,
} from "lucide-react";
import logo from "../assets/logo.png";
import GetStarted from "../components/GetStarted";

const features = [
  {
    icon: Activity,
    title: "Real-Time Tracking",
    desc: "Monitor active visitors and page views as they happen in real-time",
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    desc: "Comprehensive analytics with visitor counts, sessions, and page views",
  },
  {
    icon: DollarSign,
    title: "Advanced Filters",
    desc: "Filter by device type, browser, country, and time ranges",
  },
  {
    icon: LayoutGrid,
    title: "Time Series Data",
    desc: "Visualize trends with daily, weekly, and monthly analytics charts",
  },
];

const Home = () => {
  return (
    <div className="home-container">

      {/* header */}
      <header className="home-header">
        <div className="home-nav">
          <div className="home-logoBox">
            <img src={logo} className="home-logoIcon" />
            <span className="home-logoText">
              <h2 style={{ fontWeight: 500 }}>Track Analytics</h2>
            </span>
          </div>

          <GetStarted variant="link" isShowProfile />
        </div>
      </header>

      {/* //hero */}
      <section
        className="home-hero">
        <h1 className="home-heroTitle">
          Powerful Analytics for{" "}<br/>
          <span className="home-gradientText">Your Websites</span>
        </h1>

        <p className="home-heroDesc">
          Track visitor behavior, understand user journeys, and make data-driven decisions. Real-time analytics that help you grow your business.
        </p>

        <GetStarted />
      </section>

     {/* //Features */}
      <section className="home-featuresSection">
        <h2 className="home-sectionTitle">
          Everything you need to understand your audience
        </h2>

        <p className="home-sectionSubtitle">
          Comprehensive analytics features designed for modern websites
        </p>

        <div className="home-featuresGrid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div className="home-card" key={feature.title}>
                <div className="home-cardIcon">
                  <Icon size={28} />
                </div>

                <h3 className="home-cardTitle">{feature.title}</h3>
                <p className="home-cardDesc">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

     {/* //Steps */}
      <section className="home-stepsSection">
        <div className="home-stepsBox">
          <h2 className="home-sectionTitle">
            Simple setup, powerful insights
          </h2>

          <p className="home-sectionSubtitle"> 
            Get started in minutes. Add our lightweight tracking script to your website and start collecting valuable analytics data immediately.
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
             <p className="home-stepDesc"> Start tracking visitors and analyzing your website performance </p> 
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
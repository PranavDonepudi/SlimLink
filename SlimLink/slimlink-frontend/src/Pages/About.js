import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import Pranav from './About_png/Pranav.png'
import Anusha from './About_png/Anusha.png'
import Jiahui from './About_png/Jiahui.png'
import Dom from './About_png/Dom.png'

const teamMembers = [
  {
    name: "Pranav Donepudi",
    title: "Programmer, Front-End Developer",
    imageUrl: Pranav,
    bio: "Pranav Donepudi is a Master of Computer Science student at Rice University, set to graduate in December 2024. He has a robust foundation in software engineering and experience across various technologies, including Python, Java, JavaScript, and cloud platforms. Pranav has developed projects in areas such as data analysis, web development, and AI integration. His technical skills are complemented by hands-on experience in roles that emphasize problem-solving, system validation, and efficient application design.",
  },
  {
    name: "Anusha Mishra",
    title: "Programmer, Back-End Developer",
    imageUrl: Anusha,
    bio: "Anusha's bio goes right there.",
  },
  {
    name: "Jiahui Li",
    title: "Programmer, Back-End & Cloud Developer",
    imageUrl: Jiahui,
    bio: "Jiahui's bio goes right here.",
  },
  {
    name: "Dominique Dulièpre",
    title: "Programmer, Front-End & Cloud Developer",
    imageUrl: Dom,
    bio: ":)",
  },

];

const About = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    window.scrollTo(0, 0);
    navigate('/');
  };

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>About SlimLink</h1>
        <p>Making every link slimmer, simpler, and smarter.</p>
      </section>

      {/* Our Story Section */}
      <section className="story-section">
        <h2>Our Story</h2>
        <p>
          SlimLink started with a simple idea: to create the slimmest, most effective way to share links.
          We believe that links are powerful tools for connection, and our mission is to make them
          short, impactful, and memorable. Today, SlimLink is trusted by users around the world to
          create, share, and track links that deliver results.
        </p>
      </section>

      {/* Mission and Vision Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>To simplify connections by providing tools that make links shorter, smarter, and more secure.</p>

        <h2>Our Vision</h2>
        <p>
          We envision a world where links aren’t just text – they’re impactful, insightful connections
          that help people navigate information easily and effectively.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why SlimLink?</h2>
        <ul>
          <li><strong>Customizable Links:</strong> Brand your links for better recognition and trust.</li>
          <li><strong>Advanced Analytics:</strong> Track your link performance and understand your audience.</li>
          <li><strong>Security First:</strong> Built with SSL encryption to keep your links safe.</li>
          <li><strong>Scalability:</strong> From personal use to enterprise-level needs, SlimLink scales with you.</li>
        </ul>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet the Leadership Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img src={member.imageUrl} alt={member.name} className="team-member-photo" />
              <h3>{member.name}</h3>
              <p>{member.title}</p>
              <button className="show-bio-button" onClick={() => alert(member.bio)}>Show Bio</button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Get Started with SlimLink</h2>
        <p>Join thousands of others who are making their links work smarter</p>
        
        <button className="cta-button" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </section>


    </div>
  );
};

export default About;

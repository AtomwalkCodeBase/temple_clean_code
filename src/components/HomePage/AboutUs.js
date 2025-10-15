import React, { useState } from "react";

// Replace these with your actual high-quality temple images
import templeHero from "../../assets/img/testimonial_01.png";
import templeBooking from "../../assets/img/temple_01.png";
import templePuja from "../../assets/img/Hall_03.jpg";
import templePolicy from "../../assets/img/pricing.webp";

const AboutUs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const styles = {
    container: {
      fontFamily: '"Crimson Text", "Times New Roman", serif',
      background: "#faf7f2",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      color: "#2c1810",
    },
    hero: {
      padding: "140px 20px 100px",
      textAlign: "center",
      position: "relative",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url(${templeHero})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "#fff",
      marginBottom: "80px",
    },
    heroTitle: {
      fontSize: "clamp(2.8rem, 6.5vw, 4.5rem)",
      fontWeight: "700",
      marginBottom: "24px",
      letterSpacing: "1px",
      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    },
    heroSubtitle: {
      fontSize: "1.3rem",
      maxWidth: "760px",
      margin: "0 auto",
      lineHeight: "1.7",
      fontWeight: "300",
    },
    mainContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px 100px",
      position: "relative",
    },
    sectionGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      marginBottom: "64px",
    },
    card: {
      display: "flex",
      background: "linear-gradient(135deg, #FFFDF8 0%, #FFF7E6 100%)",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 8px 28px rgba(255, 153, 51, 0.12)",
      transition: "all 0.4s ease",
      height: "300px",
      position: "relative",
    },
    cardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    },
    imageContainer: {
      flex: "0 0 42%",
      position: "relative",
      overflow: "hidden",
      minWidth: "40%",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.8s ease",
    },
    imageHover: {
      transform: "scale(1.05)",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(45deg, rgba(255, 153, 51, 0.08), rgba(218, 165, 32, 0.06))",
      opacity: 0,
      transition: "opacity 0.4s ease",
    },
    imageOverlayHover: {
      opacity: 1,
    },
    cardContent: {
      flex: "1 1 58%",
      padding: "28px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "10px",
      position: "relative",
    },
    cardIcon: { display: "none" },
    cardTitle: {
      fontSize: "1.75rem",
      fontWeight: "700",
      marginBottom: "8px",
      color: "#8b4500",
      lineHeight: "1.25",
    },
    cardText: {
      fontSize: "1.05rem",
      lineHeight: "1.65",
      color: "#6a4420",
      marginBottom: "0",
      maxWidth: "56ch",
    },
    decorativeElement: {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      width: "44px",
      height: "44px",
      background: "linear-gradient(135deg, #FF9933, #DAA520)",
      borderRadius: "50%",
      opacity: "0.22",
    },
    leftAccent: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "6px",
      height: "100%",
      background: "linear-gradient(180deg, #FF9933, #DAA520)",
    },
    featuresSection: {
      background: "linear-gradient(180deg, #FFFFFF 0%, #FFF9F0 100%)",
      borderRadius: "16px",
      padding: "70px 40px",
      boxShadow: "0 8px 28px rgba(255, 153, 51, 0.12)",
      marginTop: "40px",
      border: "1px solid rgba(255, 153, 51, 0.15)",
    },
    featuresTitle: {
      fontSize: "2.4rem",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "60px",
      color: "#2c1810",
      position: "relative",
      paddingBottom: "20px",
    },
    titleUnderline: {
      position: "absolute",
      bottom: "0",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "3px",
      background: "linear-gradient(to right, #8b5a2b, #d9a566)",
      borderRadius: "2px",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "35px",
    },
    featureCard: {
      background: "linear-gradient(135deg, #FFF7E6 0%, #FFFFFF 100%)",
      borderRadius: "16px",
      padding: "35px 25px",
      textAlign: "center",
      transition: "all 0.3s ease",
      border: "1px solid rgba(255, 153, 51, 0.18)",
      boxShadow: "0 8px 20px rgba(255, 153, 51, 0.08)",
      position: "relative",
      overflow: "hidden",
    },
    featureCardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 18px 36px rgba(255, 153, 51, 0.18)",
      background: "linear-gradient(135deg, #FFF2DA 0%, #FFFFFF 100%)",
    },
    featureIcon: {
      display: "none",
    },
    featureIconHover: {
      transform: "scale(1.1)",
    },
    featureTitle: {
      fontSize: "1.35rem",
      fontWeight: "600",
      marginBottom: "15px",
      color: "#2c1810",
    },
    featureText: {
      color: "#5e4229",
      lineHeight: "1.7",
      fontSize: "1.05rem",
    },
    featureDecoration: {
      position: "absolute",
      top: "-18px",
      right: "-18px",
      width: "62px",
      height: "62px",
      background: "linear-gradient(135deg, #FF9933, #DAA520)",
      borderRadius: "50%",
      opacity: "0.08",
    },
    floatingOrb: {
      position: "absolute",
      width: "300px",
      height: "300px",
      background:
        "radial-gradient(circle, rgba(139,90,43,0.15) 0%, rgba(217,165,102,0) 70%)",
      borderRadius: "50%",
      top: "-150px",
      right: "-150px",
      zIndex: "0",
    },
    floatingOrb2: {
      position: "absolute",
      width: "200px",
      height: "200px",
      background:
        "radial-gradient(circle, rgba(139,90,43,0.1) 0%, rgba(217,165,102,0) 70%)",
      borderRadius: "50%",
      bottom: "50px",
      left: "-100px",
      zIndex: "0",
    },
  };

  const sections = [
    {
      title: "Discover Temples with Ease",
      content:
        "Browse temple details, offerings, and images in one clean view. Find what matters quickly and plan your visit with confidence.",
      icon: "🛕",
      image: templeBooking,
    },
    {
      title: "Book Pujas and Halls",
      content:
        "Check availability, pick a time slot, and confirm your seva or hall booking without hassle or confusion.",
      icon: "🗓️",
      image: templePuja,
    },
    {
      title: "Policies, Pricing, and Priests",
      content:
        "Clear advance and refund policies, transparent pricing and packages, and coordinated priest assignments for smooth rituals.",
      icon: "📜",
      image: templePolicy,
    },
  ];

  const features = [
    {
      icon: "📿",
      title: "Puja & Seva Booking",
      desc: "Book sevas with real-time availability",
    },
    {
      icon: "🏛️",
      title: "Hall Reservations",
      desc: "Reserve temple halls for your events",
    },
    {
      icon: "🕰️",
      title: "Time Slot Management",
      desc: "Pick suitable timings with clarity",
    },
    {
      icon: "👨‍🦳",
      title: "Priest Coordination",
      desc: "Rituals conducted on time and with care",
    },
    {
      icon: "📦",
      title: "Packages & Pricing",
      desc: "Transparent packages and final pricing",
    },
    {
      icon: "🧾",
      title: "Policies & Refunds",
      desc: "Clear advance and refund policies",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.floatingOrb}></div>
      <div style={styles.floatingOrb2}></div>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>About Us</h1>
        <p style={styles.heroSubtitle}>
          Agamandira where ancient devotion meets tomorrow's technology—crafting
          spiritual experiences beyond imagination
        </p>
      </section>

      <main style={styles.mainContent}>
        <div style={styles.sectionGrid}>
          {sections.map((section, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                ...(hoveredCard === index ? styles.cardHover : {}),
                flexDirection: index % 2 === 1 ? "row-reverse" : "row",
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.imageContainer}>
                <img
                  src={section.image}
                  alt={section.title}
                  style={{
                    ...styles.cardImage,
                    ...(hoveredCard === index ? styles.imageHover : {}),
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    ...styles.imageOverlay,
                    ...(hoveredCard === index ? styles.imageOverlayHover : {}),
                  }}
                ></div>
                <div style={styles.leftAccent}></div>
              </div>

              <div style={styles.cardContent}>
                <div style={styles.decorativeElement}></div>
                {/* icon removed as requested */}
                <h2 style={styles.cardTitle}>{section.title}</h2>
                <p style={styles.cardText}>{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        <section style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>
            Sacred Services
            <div style={styles.titleUnderline}></div>
          </h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.featureCard,
                  ...(hoveredFeature === idx ? styles.featureCardHover : {}),
                }}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={styles.featureDecoration}></div>
                {/* icon removed as requested */}
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureText}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;

"use client";
import styled from "styled-components";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IndiaMap from "../../assets/img/India.png";
import { gettemplist } from "../../services/productServices";

const TemplesContainer = styled.div`
  min-height: 100vh;
  padding-top: 100px;

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.background},
    rgba(255, 153, 51, 0.1)
  );
  text-align: center;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 0.5rem;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 2.1rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 1.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.darkGray};
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    max-width: 100%;
  }
`;

const TemplesGrid = styled.section`
  padding: 1rem 0;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px 20px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 0 8px 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    padding: 0 6px 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 4px 8px;
  }
`;

const TempleCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.white};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    border-radius: 12px;

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const TempleImageContainer = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

const TempleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TempleInfo = styled.div`
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.2rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const TempleName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }
`;

const TempleLocation = styled.p`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.6rem;
  }
`;

const TempleDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  gap: 0.4rem;

  @media (max-width: 768px) {
    margin-bottom: 0.6rem;
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
    gap: 0.25rem;
  }
`;

const DetailLabel = styled.span`
  color: ${(props) => props.theme.colors.darkGray};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const DetailValue = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-top: 1.2rem;
  }

  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-top: 1rem;
    flex-direction: column;
  }
`;

const ViewDetailsButton = styled(motion.button)`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  background: transparent;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 153, 51, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.7rem;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const BookSevaButton = styled(motion.button)`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.7rem;
    font-size: 0.85rem;

    &:hover {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &.primary {
    background: ${(props) => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${(props) => props.theme.colors.gold};
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: transparent;
    color: ${(props) => props.theme.colors.primary};
    border: 2px solid ${(props) => props.theme.colors.primary};

    &:hover {
      background: ${(props) => props.theme.colors.primary};
      color: white;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;

    &.primary:hover,
    &.secondary:hover {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const locations = [
  { name: "All", image: IndiaMap },
  {
    name: "Ayodhya",
    image:
      "https://imgs.search.brave.com/zS0HKW7iNh0nSlY3OeRWSghw0Vi4GTC9seiFCaXkL9k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTk0/MDkyNjg2Ny9waG90/by9hLWdlbmVyYWwt/dmlldy1vZi1hLXRl/bXBsZS10by1oaW5k/dS1kZWl0eS1yYW0t/b24tdGhlLWV2ZS1v/Zi1pdHMtY29uc2Vj/cmF0aW9uLWNlcmVt/b255LWluLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz0zZU5W/YlNLeTNFUEJRZFdO/T0g0TXE5QlFtVTdy/aVRoMmtsZVNXMDR1/SFhVPQ",
  },
  {
    name: "Varanasi",
    image:
      "https://imgs.search.brave.com/vtLuEF9ewiI7j5wACfx1hG85Hfd2iMI9uf6Am0t-TOY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODIz/ODU4MjY4L3Bob3Rv/L21hbmlrYXJuaWth/LWdoYXQtaW4tdmFy/YW5hc2ktaW5kaWEu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PU40ajg4U2hzS3B1/anNzN1V3dl8ycUVG/ckVOdy1hZ185c2Fl/LTl0cWI0MzQ9",
  },
  {
    name: "Andhra pradesh",
    image:
      "https://imgs.search.brave.com/45u5nMGwZQRxHkFDlGaIEogjQe3M86of3p3a3-Q_rKA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMudHJhdmVsdHJp/YW5nbGUuY29tL2Js/b2cvd3AtY29udGVu/dC91cGxvYWRzLzIw/MTkvMTIvVmVua2F0/ZXN3YXJhLVRlbXBs/ZS10aXJ1cGF0aS5q/cGc",
  },
  {
    name: "Mathura",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/Vishram_Ghat.jpg",
  },
  {
    name: "Vrindavan",
    image:
      "https://imgs.search.brave.com/B7br7Q6Rj7kjAg_riOnoaCGdBsJBXVJcTGCB11RkGo0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcm9w/YWNpdHkuY29tL2Js/b2dzL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI0LzA2L1ByZW0t/TWFuZGlyLTIuanBn",
  },
  {
    name: "Odisha",
    image:
      "https://imgs.search.brave.com/KdvZBl6XFP-z5-8FMlxDWzjwaFXgd52N4k1N9dLkp8s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy81/LzU1L0phZ2FubmF0/aF9UZW1wbGUsX1B1/cmkuanBn",
  },
  {
    name: "Punjab",
    image:
      "https://imgs.search.brave.com/ZH796PCB-gq0b1ozv7bj4gxTPzmkRWA0iXQGlU5Bkng/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdHls/ZXNhdGxpZmUuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE5/LzAyL0R1cmdpYW5h/LVRlbXBsZS1pbi1B/bXJpdHNhci5qcGc",
  },
  {
    name: "Haridwar",
    image:
      "https://imgs.search.brave.com/XYNxPCa-qD_sVc20pMRQqbqhuJjxvXYvvd0z6qPor70/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aGFyaWR3YXJyaXNo/aWtlc2h0b3VyaXNt/LmNvbS9oYXJpZHdh/ci1waG90b3MvMTIu/anBn",
  },
  {
    name: "Uttarakhand",
    image:
      "https://imgs.search.brave.com/jQbZOAxouTz0S95i2q3RqmzqLVkxK1wqZjJoWPklQmc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zN2Fw/MS5zY2VuZTcuY29t/L2lzL2ltYWdlL2lu/Y3JlZGlibGVpbmRp/YS90cmF5YW1iYWtl/c2h3YXItdGVtcGxl/LXJpc2hpa2VzaC11/dHRyYWtoYW5kLWF0/dHItbmVhcmJ5P3Fs/dD04MiZ0cz0xNzI2/NjQ2MjcxODc4",
  },
  {
    name: "Tamil Nadu",
    image:
      "https://i.natgeofe.com/n/b9e9b8d1-fa08-4b90-96bb-310cace03847/meenakshi-amman-temple-india.jpg",
  },
];

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0 1rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f3f3f3;
  background: transparent;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 1.5rem;
    padding: 1.5rem 0 1rem 0;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem 0 0.8rem 0;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
    padding: 0.8rem 0 0.6rem 0;
    margin-bottom: 0.8rem;
  }
`;

const FilterItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  min-width: 80px;

  @media (max-width: 768px) {
    min-width: 70px;
  }

  @media (max-width: 480px) {
    min-width: 60px;
  }
`;

const FilterImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border-radius: 50%;
  border: 3px solid transparent;
  transition: border 0.2s, box-shadow 0.2s;

  &.active {
    border-color: #ab353d;
    box-shadow: 0 0 0 4px #f3e3e5;
  }

  &:hover {
    border-color: #e67c1c;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    margin-bottom: 0.4rem;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    margin-bottom: 0.3rem;
  }
`;

const FilterLabel = styled.span`
  font-size: 1rem;
  color: #888;
  font-weight: 500;
  transition: color 0.2s, font-weight 0.2s;
  text-align: center;

  &.active {
    color: #ab353d;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const HeroFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 1024px) {
    gap: 1.5rem;
    padding: 0 0.8rem;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    gap: 0.8rem;
  }
`;

const HeroLeft = styled.div`
  flex: 1.2;
  text-align: left;

  @media (max-width: 900px) {
    text-align: center;
    flex: 1;
  }

  @media (max-width: 768px) {
    order: 2;
  }
`;

const HeroRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    order: 1;
  }

  @media (max-width: 768px) {
    order: 1;
  }
`;

const MapImage = styled.img`
  width: 400px;
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: 0;

  @media (max-width: 1024px) {
    width: 350px;
  }

  @media (max-width: 900px) {
    width: 300px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    width: 250px;
  }

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const BulletList = styled.ul`
  padding: 0;
  list-style: none;
  margin: 1.5rem 0;

  @media (max-width: 768px) {
    margin: 1.2rem 0;
  }

  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const Bullet = styled.li`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  color: #888;
  margin-bottom: 1rem;

  &::before {
    content: "✔";
    color: orange;
    font-size: 1.3rem;
    margin-right: 0.8rem;
  }

  @media (max-width: 1024px) {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.6rem;

    &::before {
      font-size: 1.2rem;
      margin-right: 0.6rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;

    &::before {
      font-size: 1.1rem;
      margin-right: 0.5rem;
    }
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 1.2rem;
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-bottom: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const Temples = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const demomode = localStorage.getItem("demoMode");
  const DEFAULT_IMAGE =
    "https://www.poojn.in/wp-content/uploads/2025/02/Govindaraja-Temple-History-Architecture-and-Significance.jpeg.jpg";

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await gettemplist();
        // Determine environment
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          demomode === "true";

        // Filter based on environment
        const filteredTemples = response.data?.filter((temple) =>
          isLocal ? temple.is_live_data === false : temple.is_live_data === true
        );

        const list = Array.isArray(filteredTemples) ? filteredTemples : [];
        const mapped = list.map((t) => {
          const timingsObj = t?.additional_field_list?.temple_timings;
          let timingsText = "";
          if (Array.isArray(timingsObj?.selected_time_slots)) {
            timingsText = timingsObj.selected_time_slots
              .map(
                (slot) =>
                  `${slot.name ? slot.name + ": " : ""}${slot.start || ""} - ${
                    slot.end || ""
                  }`
              )
              .join(", ");
          }

          return {
            id: t.temple_id || t.id,
            name: t.name || "Unnamed Temple",
            location:
              t.location ||
              [t.address_line_3, t.state_code].filter(Boolean).join(", ") ||
              "",
            image: t.image || DEFAULT_IMAGE,
            // placeholders to preserve current card layout
            deity: t.mobile_number || null,
            timings: timingsText || null,
          };
        });
        setTemples(mapped);
      } catch (e) {
        setError("Failed to load temples");
        setTemples([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const handleViewDetails = (templeId) => {
    navigate(`/templeDetails/${templeId}`);
  };

  const handleBookSeva = (templeId) => {
    navigate("/customer-login", { state: { templeId } });
  };

  // const handleBookSeva = (templeId) => {
  //   navigate(`/bookPuja?temple=${templeId}`);
  // };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Filter temples based on selected location
  const filteredTemples =
    selectedLocation === "All"
      ? temples
      : temples.filter((temple) =>
          (temple.location || "")
            .toLowerCase()
            .includes(selectedLocation.toLowerCase())
        );
  return (
    <TemplesContainer>
      <HeroSection
        style={{
          background:
            "linear-gradient(to top, rgb(255, 247, 239) 0%, rgb(247, 226, 186) 100%)",
        }}
      >
        <HeroFlex>
          <HeroLeft>
            <HeroTitle
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Embark on a Sacred Journey through India's Divine Temples
            </HeroTitle>
            <HeroSubtitle
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></HeroSubtitle>
            <BulletList>
              <Bullet>
                Explore the stories, rituals, and glory of ancient shrines
              </Bullet>
              <Bullet>
                Connect with temples dedicated to your beloved deities
              </Bullet>
              <Bullet>
                Participate in holy festivals and support temple activities
              </Bullet>
            </BulletList>
            <HeroButtons>
              <ActionButton className="primary">
                Explore Temples of India
              </ActionButton>
            </HeroButtons>
          </HeroLeft>
          <HeroRight>
            <MapImage src={IndiaMap} alt="India Map" />
          </HeroRight>
        </HeroFlex>
        <FilterBar>
          {locations.map((loc) => {
            const isActive =
              selectedLocation.trim().toLowerCase() ===
              loc.name.trim().toLowerCase();
            return (
              <FilterItem
                key={loc.name}
                onClick={() => setSelectedLocation(loc.name)}
              >
                <FilterImage
                  src={loc.image}
                  alt={loc.name}
                  className={isActive ? "active" : ""}
                />
                <FilterLabel className={isActive ? "active" : ""}>
                  {loc.name}
                </FilterLabel>
              </FilterItem>
            );
          })}
        </FilterBar>
      </HeroSection>
      <TemplesGrid>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <GridContainer>
            {loading && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "2rem",
                  color: "#888",
                }}
              >
                Loading temples...
              </div>
            )}
            {!loading && error && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "2rem",
                  color: "#c00",
                }}
              >
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              filteredTemples.map((temple) => (
                <TempleCard
                  key={temple.id}
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                >
                  <TempleImageContainer>
                    <TempleImage
                      src={temple.image || DEFAULT_IMAGE}
                      alt={temple.name}
                    />
                  </TempleImageContainer>

                  <TempleInfo>
                    <TempleName>{temple.name}</TempleName>
                    <TempleLocation>📍 {temple.location}</TempleLocation>

                    <TempleDetail>
                      <span role="img" aria-label="Phone">
                        📞
                      </span>
                      <DetailLabel>contact :</DetailLabel>
                      <DetailValue>{temple.deity || "—"}</DetailValue>
                    </TempleDetail>
                    <TempleDetail>
                      <span role="img" aria-label="Clock">
                        🕒
                      </span>
                      <DetailLabel>Timings:</DetailLabel>
                      <DetailValue>{temple.timings || "—"}</DetailValue>
                    </TempleDetail>

                    <ActionButtons>
                      <ViewDetailsButton
                        onClick={() => handleViewDetails(temple.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details
                      </ViewDetailsButton>
                      <BookSevaButton
                        onClick={() => handleBookSeva(temple.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Book Seva
                      </BookSevaButton>
                    </ActionButtons>
                  </TempleInfo>
                </TempleCard>
              ))}
          </GridContainer>
        </motion.div>
      </TemplesGrid>
    </TemplesContainer>
  );
};

export default Temples;

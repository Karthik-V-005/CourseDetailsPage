import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import app from "./FirebaseAuth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import logo from "./LOGO.jpg";
import ReactPlayer from "react-player/youtube";

const db = getFirestore(app);

const userRole: string = "Student";
const isEnrolled = false;

interface VideoItem {
  title: string;
  src: string;
}

export default function MaestroHub() {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const currentVideo = videoList[currentVideoId]?.src || "";

  useEffect(() => {
    const fetchCourseData = async () => {
      const courseCollection = collection(db, "course1");
      const snapshot = await getDocs(courseCollection);

      const videos: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        // Detect course info document
        if (data.AboutInstructor) {
          setCourseInfo(data);
        } else {
          Object.entries(data).forEach(([key, value]) => {
            if (
              key.toLowerCase().includes("video") &&
              typeof value === "string"
            ) {
              videos.push({
                title: key,
                src: `https://www.youtube.com/watch?v=${value}`, // ✅ correct format
              });
            }
          });
        }
      });

      // Fill to 10 with placeholders
      const totalVideos = [...videos];
      while (totalVideos.length < 10) {
        totalVideos.push({
          title: `Placeholder ${totalVideos.length + 1}`,
          src: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder
        });
      }

      setVideoList(totalVideos);
      setCurrentVideoId(0);
    };

    fetchCourseData();
  }, []);

  return (
    <div className="container">
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        body {
          margin: 0;
          font-family: 'Montserrat', sans-serif;
          background-color: #f8f1e7;
          color: #5a4635;
        }
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .menu-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          background-color: #ffffff;
          border-bottom: 1px solid #d1bfa7;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          gap: 2rem;
        }

        .logo-img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
  object-fit: contain;
  vertical-align: middle;
  box-shadow: 0 1px 1px rgba(0,0,0,0.5);
}



        .logo-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .menu-items {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .menu-button {
        border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          color: #000;
          font-weight: 600;
          padding: 0.4rem 1rem;
        }
        .menu-button:hover {
          color: #ff6210;
        }
        .main-content {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  align-items: flex-start;
}
        .video-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid #d1bfa7;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
          .video-player-container {
  flex: 2;
}
        .video-list-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 400px;
  border: 1px solid #d1bfa7;
  border-radius: 1rem;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
  .video-list-content {
  overflow-y: auto;
  padding: 1rem;
}
        .video-list-heading {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }
          .video-section-title {
  background-color: #e0c9a6;
  font-weight: bold;
  border: none;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  cursor: pointer;
}
.video-sublist {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
}
.video-list-section {
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #d1bfa7;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  max-height: 400px;
}
.video-list-heading {
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1rem;
  border-bottom: 1px solid #d1bfa7;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 1;
}
.video-list-section > div:nth-child(n+2) {
  overflow-y: auto;
  padding: 1rem;
  flex-grow: 1;
}

        .video-list-item {
  background-color: #f8f1e7;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0.3rem 0;
  border-radius: 0.5rem;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}
       .video-list-item:hover {
  background-color: #f3e7d8;
}
        .video-list-item.active {
  background-color: #dcb57c;
  font-weight: bold;
}
        .details-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
        }
        .card {
          background: #ffffff;
          color: #000;
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid #d1bfa7;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .card h2 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .enroll {
          margin-top: 1rem;
          text-align: center;
        }
        .enroll button {
          background-color:hsl(21, 100.00%, 53.10%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 0.75rem;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .enroll button:hover {
          background-color: hsl(21, 100.00%, 48%);
        }
        .hamburger-button {
          display: none;
        }

        .course-area {
  width: 100%;
}

.course-title {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #000;
}

.course-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

ul {
list-style: none;
}

ul li {
        padding: 5px;
}

        @media (max-width: 768px) {
          .menu-bar {
            justify-content: space-between;
          }
          .menu-items {
            display: ${menuOpen ? "flex" : "none"};
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #ffffff;
            padding: 1rem;
            border-top: 1px solid #d1bfa7;
          }
          .hamburger-button {
            display: block;
          }
          .main-content, .details-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Menu Bar */}
      <div className="menu-bar">
        <Link to="/" className="logo-text">
          <img
            src={logo} // Replace with your logo file path
            alt="Maestro Hub Logo"
            className="logo-img"
          />
          <span>Maestro Hub</span>
        </Link>

        <div className="hamburger-button">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="menu-items">
          <button className="menu-button">All Courses</button>
          <button className="menu-button">My Courses</button>
          {(userRole === "Employee" || userRole === "Admin") && (
            <button className="menu-button">Add Course</button>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="course-area">
          <h2 className="course-title">{courseInfo?.CourseName || "Course"}</h2>
          <div className="course-content">
            <div className="video-player-container">
              <div className="video-player">
                <ReactPlayer
                  url={currentVideo}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            </div>

            <div
              className="video-list-section"
              aria-label="Course videos list"
              role="list"
              ref={listRef}
            >
              <div className="video-list-heading">Course Videos</div>
              <div className="video-list-content">
                {[...Array(5)].map((_, index) => {
                  const sectionNum = index + 1;
                  const isOpen = openSections[sectionNum] || false;
                  const videosInSection = videoList.slice(
                    (sectionNum - 1) * 2,
                    sectionNum * 2
                  );

                  return (
                    <div
                      key={`section-${sectionNum}`}
                      className="video-section"
                    >
                      <button
                        className="video-section-title"
                        onClick={() => toggleSection(sectionNum)}
                      >
                        Section {sectionNum}
                      </button>
                      {isOpen && (
                        <div className="video-sublist">
                          {videosInSection.map((video, idx) => (
                            <button
                              key={`${sectionNum}-${idx}`}
                              className={`video-list-item ${
                                currentVideoId === (sectionNum - 1) * 2 + idx
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                setCurrentVideoId((sectionNum - 1) * 2 + idx)
                              }
                            >
                              {`Video ${sectionNum}.${idx + 1}`} – {video.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Description & Details */}
      <div className="details-section">
        <div className="card">
          <h2>Course Description</h2>
          <p>
            {courseInfo?.CourseDesc || "A detailed course on React concepts."}
          </p>

          {!isEnrolled && (
            <div className="enroll">
              <button>Enroll Now</button>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Course Details</h2>
          <ul>
            <li>
              <strong>Difficulty:</strong> {courseInfo?.Difficulty}
            </li>
            <li>
              <strong>Duration:</strong> {courseInfo?.Duration}
            </li>
            <li>
              <strong>Ratings:</strong> ⭐⭐⭐⭐☆
            </li>
            <li>
              <strong>Instructor:</strong> {courseInfo?.Instructor}
            </li>
            <li>
              <strong>About Instructor:</strong> {courseInfo?.AboutInstructor}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

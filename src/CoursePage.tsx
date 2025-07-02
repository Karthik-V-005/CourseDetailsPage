import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import app from "./FirebaseAuth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import logo from "./LOGO.jpg";
import ReactPlayer from "react-player/youtube";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const db = getFirestore(app);

const userRole: string = "Student";

interface VideoItem {
  title: string;
  src: string;
  section: string;
  duration?: string;
  thumbnail?: string;
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
  const [enrollSuccess, setEnrollSuccess] = useState(false); // <-- NEW
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<number>>(
    new Set()
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize(); // for fullscreen confetti

  const { id } = useParams();
  const totalVideos = videoList.length;
  const progressPercent = Math.round(
    (watchedVideoIds.size / totalVideos) * 100
  );

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      // Fetch course metadata and videos
      const courseCollection = collection(db, id);
      const snapshot = await getDocs(courseCollection);

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (docSnap.id === "metadata") {
          setCourseInfo(data);

          const sectionData = data.Sections || [];
          const parsedVideos: any[] = [];

          sectionData.forEach((section: any, sectionIndex: number) => {
            const sectionTitle = section.title || `Section ${sectionIndex + 1}`;
            (section.videos || []).forEach((vid: any, vidIndex: number) => {
              parsedVideos.push({
                title: vid.title || `Video ${vidIndex + 1}`,
                section: sectionTitle,
                src: vid.videoUrl || "",
                thumbnail: vid.ThumbnailUrl,
              });
            });
          });

          setVideoList(parsedVideos);
          setCurrentVideoId(0);
        }
      });

      // 🔍 Check enrollment status
      const enrollSnap = await getDocs(collection(db, "enrollments"));
      const enrolled = enrollSnap.docs.some(
        (doc) => doc.data().courseId === id
      );
      setIsEnrolled(enrolled);
    };

    fetchCourseData();
  }, [id]);
  // ✅ re-run whenever course ID changes
  const grouped = videoList.reduce((acc, video) => {
    acc[video.section] = acc[video.section] || [];
    acc[video.section].push(video);
    return acc;
  }, {} as Record<string, VideoItem[]>);

  const handleEnroll = async () => {
    if (!id) return;
    try {
      const docRef = await addDoc(collection(db, "enrollments"), {
        courseId: id,
        isEnrolled: true,
        progress: 0,
      });
      console.log("Enrolled successfully:", docRef.id);
      setIsEnrolled(true);
      setEnrollSuccess(true); // <-- trigger message
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert("Failed to enroll. Please try again.");
    }
  };

  const markCourseAsCompleted = async () => {
    try {
      const snapshot = await getDocs(collection(db, "enrollments"));
      const match = snapshot.docs.find((doc) => doc.data().courseId === id);
      if (!match) return;

      const enrollmentRef = doc(db, "enrollments", match.id);
      await updateDoc(enrollmentRef, {
        progress: 100,
        isCompleted: true,
      });

      console.log("✅ Course marked as completed");
      setShowConfetti(true); // 🎉 trigger animation
      setTimeout(() => setShowConfetti(false), 8000); // auto-hide after 8s
    } catch (error) {
      console.error("Error marking course as completed:", error);
    }
  };

  const updateProgressInFirestore = async (progress: number) => {
    try {
      const snapshot = await getDocs(collection(db, "enrollments"));
      const match = snapshot.docs.find((doc) => doc.data().courseId === id);
      if (!match) return;

      const enrollmentRef = doc(db, "enrollments", match.id);
      await updateDoc(enrollmentRef, { progress });
      console.log(`Progress updated to ${progress}%`);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const handleVideoChange = async (index: number) => {
    setCurrentVideoId(index);

    if (!id || !isEnrolled) return;

    // Avoid duplicate counts
    setWatchedVideoIds((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.add(index);

      const newProgress = Math.round((newSet.size / totalVideos) * 100);

      // Save progress to Firestore
      updateProgressInFirestore(newProgress);

      if (newSet.size === totalVideos) {
        markCourseAsCompleted(); // ✅ New function to mark completion
      }

      return newSet;
    });
  };

  return (
    <div className="container">
      {showConfetti && <Confetti width={width} height={height} />}
      {showConfetti && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "1rem 2rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: "1.5rem",
            color: "#4CAF50",
            zIndex: 1000,
          }}
        >
          🎉 Congratulations! You completed the course!
        </div>
      )}
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
          .enroll .enrolled-button {
  background-color: #ccc !important;
  cursor: not-allowed !important;
  color: #333 !important;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
          <span>MaestroHub</span>
        </Link>

        <div className="hamburger-button">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="menu-items">
          <Link to="/" state={{ tab: "all" }} className="menu-button">
            All Courses
          </Link>
          <Link to="/" state={{ tab: "enrolled" }} className="menu-button">
            My Courses
          </Link>
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
              <div
                className="video-list-heading"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Course Videos</span>
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar
                    value={progressPercent}
                    text={`${progressPercent}%`}
                    styles={buildStyles({
                      pathColor: "#ff6210",
                      textColor: "#333",
                      trailColor: "#eee",
                      textSize: "30px",
                    })}
                  />
                </div>
              </div>

              <div className="video-list-content">
                {Object.entries(grouped).map(
                  ([sectionTitle, videos], sectionIndex) => {
                    const isOpen = openSections[sectionIndex] || false;
                    return (
                      <div key={sectionTitle} className="video-section">
                        <button
                          className="video-section-title"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          {sectionTitle}
                        </button>
                        {isOpen && (
                          <div className="video-sublist">
                            {videos.map((video, idx) => {
                              const globalIndex = videoList.findIndex(
                                (v) => v === video
                              );
                              return (
                                <button
                                  key={`${sectionIndex}-${idx}`}
                                  className={`video-list-item ${
                                    currentVideoId === globalIndex
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() => handleVideoChange(globalIndex)}
                                >
                                  {video.title}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
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
              <button onClick={handleEnroll}>Enroll Now</button>
            </div>
          )}

          {isEnrolled && (
            <div className="enroll">
              <button className="enrolled-button" disabled>
                Enrolled
              </button>
            </div>
          )}

          {enrollSuccess && (
            <p
              style={{ color: "green", textAlign: "center", marginTop: "10px" }}
            >
              ✅ You have successfully enrolled for this course!
            </p>
          )}
        </div>

        <div className="card">
          <h2>Course Details</h2>
          <ul>
            <li>
              <strong>Difficulty:</strong> {courseInfo?.Level}
            </li>
            <li>
              <strong>Duration:</strong> {courseInfo?.Duration}
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

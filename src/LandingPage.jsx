import { useState, useEffect, useRef } from "react";
import CustomAlert from "./CustomAlert";
import CustomConfirm from "./CustomConfirm";
import {
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { db } from "./FirebaseAuth";
import CoursePage from "./CoursePage";
import "./index.css";
import logo from "./LOGO.jpg"; // adjust path if it's inside a subfolder like ./assets/logo.jpg

function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCourse, setNewCourse] = useState({
    name: "",
    category: "",
    description: "",
    level: "Beginner",
    instructor: "",
    aboutInstructor: "",
    thumbnailUrl: "",
    overallDuration: "",
    sections: [
      {
        title: "",
        videos: [{ title: "", videoUrl: "" }],
      },
    ],
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const scrollContainerRef = useRef(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(() => {});

  const userRole = "Admin";

  useEffect(() => {
    const state = location.state;
    if (state && state.tab === "enrolled") {
      setActiveTab("enrolled");
    } else {
      setActiveTab("all");
    }
  }, [location.state]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeCourses = onSnapshot(
      collection(db, "allcourses"),
      (snapshot) => {
        const coursesData = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (!data || !data.id || !data.name) return null; // skip invalid
            return { id: data.id, ...data };
          })
          .filter(Boolean); // remove nulls
        setAllCourses(coursesData);
      },
      (error) => {
        console.error("Error fetching courses:", error);
      }
    );

    const unsubscribeEnrollments = onSnapshot(
      collection(db, "enrollments"),
      (snapshot) => {
        const enrollData = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (!data || !data.courseId) return null;
            return { id: doc.id, ...data };
          })
          .filter(Boolean);
        setEnrolledCourses(enrollData);
      },
      (error) => {
        console.error("Error fetching enrollments:", error);
      }
    );

    return () => {
      unsubscribeCourses();
      unsubscribeEnrollments();
    };
  }, []);

  const handleEnrollCourse = async (courseId) => {
    try {
      const docRef = await addDoc(collection(db, "enrollments"), {
        courseId,
        isEnrolled: true,
        progress: 0,
      });
      setEnrolledCourses([
        ...enrolledCourses,
        { id: docRef.id, courseId, progress: 0 },
      ]);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const handleAddCourse = async () => {
    try {
      const courseId = newCourse.name.toLowerCase().replace(/\s+/g, "_");

      // 1. Add to allcourses collection
      await addDoc(collection(db, "allcourses"), {
        id: courseId,
        name: newCourse.name,
        category: newCourse.category,
        description: newCourse.description,
        level: newCourse.level,
        instructor: newCourse.instructor,
        thumbnailUrl: newCourse.thumbnailUrl,
        isEnrolled: false,
        overallDuration: newCourse.overallDuration,
        aboutInstructor: newCourse.aboutInstructor,

        progress: 0,
      });

      // 2. Create courseId collection and add metadata doc
      await setDoc(doc(db, courseId, "metadata"), {
        CourseName: newCourse.name,
        CourseDesc: newCourse.description,
        Instructor: newCourse.instructor,
        ThumbnailUrl: newCourse.thumbnailUrl,
        Level: newCourse.level,
        Category: newCourse.category,
        Sections: newCourse.sections,
        Duration: newCourse.overallDuration,
        AboutInstructor: newCourse.aboutInstructor,
      });

      // 3. Add videos as msth_video_#
      let videoCount = 1;
      for (const section of newCourse.sections) {
        for (const video of section.videos) {
          const videoID = video.videoUrl.slice(-11);
          const videoDocId = `msth_video_${videoCount}`;
          await setDoc(doc(db, courseId, videoDocId), {
            videoID,
          });
          videoCount++;
        }
      }

      setAlertMessage("✅ Course created successfully!");
      setAlertVisible(true);

      setShowAddForm(false);
      setNewCourse({
        name: "",
        category: "",
        description: "",
        level: "Beginner",
        instructor: "",
        thumbnailUrl: "",
        overallDuration: "",
        aboutInstructor: "",
        sections: [
          {
            title: "",
            videos: [{ title: "", videoUrl: "" }],
          },
        ],
      });
    } catch (error) {
      console.error("Error adding course:", error);
      setAlertMessage("Failed to add course");
      setAlertVisible(true);
    }
  };

  const updateSectionTitle = (index, title) => {
    const updated = [...newCourse.sections];
    updated[index].title = title;
    setNewCourse({ ...newCourse, sections: updated });
  };

  const removeSection = (index) => {
    const updated = [...newCourse.sections];
    updated.splice(index, 1);
    setNewCourse({ ...newCourse, sections: updated });
  };

  const removeVideoFromSection = (sectionIndex, videoIndex) => {
    const updated = [...newCourse.sections];
    updated[sectionIndex].videos.splice(videoIndex, 1);
    setNewCourse({ ...newCourse, sections: updated });
  };

  const handleVideoUrlChange = (sectionIndex, videoIndex, url) => {
    const updated = [...newCourse.sections];
    updated[sectionIndex].videos[videoIndex].videoUrl = url;
    setNewCourse({ ...newCourse, sections: updated });
  };

  const addVideoToSection = (sectionIndex) => {
    const updated = [...newCourse.sections];
    updated[sectionIndex].videos.push({
      title: "",
      videoUrl: "",
    });
    setNewCourse({ ...newCourse, sections: updated });
  };

  const addSection = () => {
    setNewCourse({
      ...newCourse,
      sections: [...newCourse.sections, { title: "", videos: [] }],
    });
  };

  const updateProgress = async (enrollmentId, newProgress) => {
    try {
      const enrollmentRef = doc(db, "enrollments", enrollmentId);
      await updateDoc(enrollmentRef, {
        progress: newProgress,
      });
      console.log("Progress updated to", newProgress);
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleUnenrollCourse = async (courseId) => {
    try {
      const toDelete = enrolledCourses.find((e) => e.courseId === courseId);
      if (toDelete) {
        await deleteDoc(doc(db, "enrollments", toDelete.id));
        setEnrolledCourses(enrolledCourses.filter((e) => e.id !== toDelete.id));
      }
    } catch (error) {
      console.error("Error unenrolling:", error);
    }
  };

  const filteredCourses = allCourses.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      course.name.toLowerCase().includes(searchLower) ||
      (course.category && course.category.toLowerCase().includes(searchLower));

    if (activeTab === "enrolled") {
      return (
        enrolledCourses.some((ec) => ec.courseId === course.id) && matchesSearch
      );
    }
    return matchesSearch;
  });

  const isEnrolled = (courseId) => {
    return enrolledCourses.some((ec) => ec.courseId === courseId);
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleDeleteCourse = async (courseId) => {
    setConfirmCallback(() => () => handleDeleteCourse(courseId));
    setConfirmVisible(true);

    try {
      // 1. Delete from 'allcourses' collection
      const snapshot = await getDocs(collection(db, "allcourses"));
      const match = snapshot.docs.find((doc) => doc.data().id === courseId);
      if (match) {
        await deleteDoc(doc(db, "allcourses", match.id));
      }

      // 2. Delete entire course collection
      const courseCollection = await getDocs(collection(db, courseId));
      for (const docSnap of courseCollection.docs) {
        await deleteDoc(doc(db, courseId, docSnap.id));
      }

      // 3. Refresh UI
      setAlertMessage("🗑 Course deleted successfully.");
      setAlertVisible(true);

      setAllCourses(allCourses.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      setAlertMessage("Failed to Delete Course");
      setAlertVisible(true);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="learning-platform">
            {/* ⬇️ HEADER SECTION */}
            <header className="platform-header">
              <div className="header-content">
                <div className="branding">
                  <img
                    src={logo}
                    alt="Maestrominds Logo"
                    className="logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/40x40?text=MM";
                    }}
                  />
                  <div className="branding-text">
                    <h1>MaestroHub</h1>
                    <p className="subtitle">Learning Platform</p>
                  </div>
                </div>
                <div className="header-actions">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder={`Search ${
                        activeTab === "all" ? "all" : "my"
                      } courses...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="search-icon">🔍</i>
                  </div>

                  <div className="nav-tabs">
                    <button
                      className={`tab-btn ${
                        activeTab === "all" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("all")}
                    >
                      All Courses
                    </button>
                    <button
                      className={`tab-btn ${
                        activeTab === "enrolled" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("enrolled")}
                    >
                      My Courses
                    </button>
                  </div>

                  <button
                    className="add-course-btn"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    + Add Course
                  </button>
                </div>
              </div>
            </header>
            {/* ⬆️ HEADER SECTION */}

            {/* ⬇️ MAIN SECTION */}

            <main className="platform-main">
              {showAddForm && (
                <div className="course-form-container">
                  <div className="course-form">
                    <h2>Create New Course</h2>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Course Title*</label>
                        <input
                          type="text"
                          value={newCourse.name}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, name: e.target.value })
                          }
                          placeholder="e.g. Advanced React"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Instructor Name*</label>
                        <input
                          type="text"
                          value={newCourse.instructor}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              instructor: e.target.value,
                            })
                          }
                          placeholder="e.g. John Doe"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Thumbnail Image URL*</label>
                        <input
                          type="url"
                          value={newCourse.thumbnailUrl}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              thumbnailUrl: e.target.value,
                            })
                          }
                          placeholder="Paste image URL ending in .jpg or .png"
                          pattern="https://.*\.(jpg|jpeg|png|webp)"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category*</label>
                        <input
                          type="text"
                          value={newCourse.category}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              category: e.target.value,
                            })
                          }
                          placeholder="e.g. Web Development"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Level*</label>
                        <select
                          value={newCourse.level}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              level: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="form-group span-2">
                        <label>Description*</label>
                        <textarea
                          value={newCourse.description}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              description: e.target.value,
                            })
                          }
                          placeholder="Course description..."
                          rows="4"
                          required
                        />
                      </div>
                      <div className="form-group span-2">
                        <label>About Instructor*</label>
                        <textarea
                          value={newCourse.aboutInstructor}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              aboutInstructor: e.target.value,
                            })
                          }
                          placeholder="Brief details about the instructor..."
                          rows="3"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Overall Duration*</label>
                        <input
                          type="text"
                          value={newCourse.overallDuration}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              overallDuration: e.target.value,
                            })
                          }
                          placeholder="e.g. 5 hours"
                          required
                        />
                      </div>

                      <div className="form-group span-2">
                        <label>Course Sections & Videos</label>
                        <div className="sections-container">
                          {newCourse.sections.length === 0 ? (
                            <p className="no-sections">No sections added yet</p>
                          ) : (
                            newCourse.sections.map((section, sectionIndex) => (
                              <div
                                key={`section-${sectionIndex}`}
                                className="section-card"
                              >
                                <div className="section-header">
                                  <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) =>
                                      updateSectionTitle(
                                        sectionIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Section title"
                                    className="section-title-input"
                                  />
                                  <button
                                    className="section-remove-btn"
                                    onClick={() => removeSection(sectionIndex)}
                                  >
                                    Remove
                                  </button>
                                </div>

                                <div className="videos-container">
                                  {section.videos.map((video, videoIndex) => (
                                    <div
                                      key={`video-${sectionIndex}-${videoIndex}`}
                                      className="video-input-group"
                                    >
                                      <input
                                        type="text"
                                        value={video.title}
                                        onChange={(e) => {
                                          const updatedSections = [
                                            ...newCourse.sections,
                                          ];
                                          updatedSections[sectionIndex].videos[
                                            videoIndex
                                          ].title = e.target.value;
                                          setNewCourse({
                                            ...newCourse,
                                            sections: updatedSections,
                                          });
                                        }}
                                        placeholder={`Video ${
                                          sectionIndex + 1
                                        }.${videoIndex + 1} Title`}
                                      />

                                      <input
                                        type="url"
                                        value={video.videoUrl}
                                        onChange={(e) =>
                                          handleVideoUrlChange(
                                            sectionIndex,
                                            videoIndex,
                                            e.target.value
                                          )
                                        }
                                        placeholder="https://example.com/video"
                                        pattern="https://.*"
                                        required
                                      />

                                      <button
                                        className="remove-video-btn"
                                        onClick={() =>
                                          removeVideoFromSection(
                                            sectionIndex,
                                            videoIndex
                                          )
                                        }
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    className="add-video-btn"
                                    onClick={() =>
                                      addVideoToSection(sectionIndex)
                                    }
                                  >
                                    + Add Video
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                          <button
                            className="add-section-btn"
                            onClick={addSection}
                          >
                            + Add Section
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button
                        className="secondary-btn"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                      <button className="primary-btn" onClick={handleAddCourse}>
                        Create Course
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "all" && (
                <>
                  {searchTerm === "" &&
                    enrolledCourses.some((enrollment) =>
                      allCourses.some(
                        (course) => course.id === enrollment.courseId
                      )
                    ) && (
                      <section className="enrolled-courses-section">
                        <div className="section-header">
                          <h2>Continue Learning</h2>
                          <p>Your enrolled courses</p>
                        </div>
                        <div className="scroll-container">
                          <button
                            className="scroll-arrow left-arrow"
                            onClick={scrollLeft}
                          >
                            &lt;
                          </button>
                          <div
                            className="enrolled-courses-scroll"
                            ref={scrollContainerRef}
                          >
                            {enrolledCourses.map((enrollment) => {
                              const course = allCourses.find(
                                (c) => c.id === enrollment.courseId
                              );
                              if (!course) return null;

                              return (
                                <div
                                  key={`enrolled-${enrollment.id}`}
                                  className="enrolled-course-card"
                                >
                                  <div className="course-media">
                                    <img
                                      src={course.thumbnailUrl}
                                      alt={course.name}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "https://placehold.co/300x200?text=No+Image";
                                      }}
                                      style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                      }}
                                    />

                                    <div className="progress-container">
                                      <div className="progress-bar">
                                        <div
                                          className="progress-fill"
                                          style={{
                                            width: `${enrollment.progress}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span>
                                        {enrollment.progress}% Complete
                                      </span>
                                    </div>
                                  </div>
                                  <div className="course-details">
                                    <h3>{course.name}</h3>
                                    <p className="instructor">
                                      By {course.instructor}
                                    </p>
                                    <p className="description">
                                      {course.description}
                                    </p>
                                    <div className="course-actions">
                                      <button
                                        className="continue-btn"
                                        onClick={() =>
                                          navigate(`/course/${course.id}`)
                                        }
                                      >
                                        Continue Learning
                                      </button>
                                      <button
                                        className="unenroll-btn"
                                        onClick={() =>
                                          handleUnenrollCourse(
                                            enrollment.courseId
                                          )
                                        }
                                      >
                                        Unenroll
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            className="scroll-arrow right-arrow"
                            onClick={scrollRight}
                          >
                            &gt;
                          </button>
                        </div>
                      </section>
                    )}

                  <section className="all-courses-section">
                    <div className="section-header">
                      <h2>Explore Our Courses</h2>
                      <p>{allCourses.length} courses available</p>
                    </div>
                    <div className="courses-grid">
                      {filteredCourses.map((course) => (
                        <div
                          key={`course-${course.id}`}
                          className="course-card"
                          onClick={() => navigate(`/course/${course.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="card-media">
                            <img
                              src={course.thumbnailUrl}
                              alt={course.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/300x200?text=No+Image";
                              }}
                              style={{
                                width: "100%",
                                height: "180px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />

                            {isEnrolled(course.id) && (
                              <div className="enrolled-badge">Enrolled</div>
                            )}
                          </div>
                          <div className="card-body">
                            <div className="course-meta">
                              <span className="category">
                                {course.category || "General"}
                              </span>
                              <span className="duration">
                                {course.overallDuration}
                              </span>
                            </div>
                            <h3>{course.name}</h3>
                            <p className="description">{course.description}</p>
                            <div className="card-actions">
                              <button
                                className={`enroll-btn ${
                                  isEnrolled(course.id) ? "enrolled" : ""
                                }`}
                                onClick={() =>
                                  isEnrolled(course.id)
                                    ? null
                                    : handleEnrollCourse(course.id)
                                }
                              >
                                {isEnrolled(course.id)
                                  ? "Continue"
                                  : "Enroll Now"}
                              </button>
                              {userRole === "Admin" && (
                                <button
                                  className="delete-course-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCourse(course.id);
                                  }}
                                >
                                  Delete Course
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === "enrolled" && (
                <section className="my-courses-vertical">
                  <div className="section-header">
                    <h2>My Courses</h2>
                    <p>
                      {searchTerm
                        ? `Search results for "${searchTerm}"`
                        : `Showing ${enrolledCourses.length} enrolled courses`}
                    </p>
                  </div>
                  <div className="vertical-courses-list">
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => {
                        const enrollment = enrolledCourses.find(
                          (ec) => ec.courseId === course.id
                        );
                        if (!enrollment) return null;

                        return (
                          <div
                            key={`mycourse-${course.id}`}
                            className="vertical-course-card"
                          >
                            <div className="course-media">
                              <img
                                src={course.thumbnailUrl}
                                alt={course.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x200?text=No+Image";
                                }}
                                style={{
                                  width: "100%",
                                  height: "180px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />

                              <div className="progress-container">
                                <div className="progress-bar">
                                  <div
                                    className="progress-fill"
                                    style={{ width: `${enrollment.progress}%` }}
                                  ></div>
                                </div>
                                <span>{enrollment.progress}% Complete</span>
                              </div>
                            </div>
                            <div className="course-details">
                              <h3>{course.name}</h3>
                              <div className="course-meta">
                                <span className="instructor">
                                  By {course.instructor}
                                </span>
                                <span className="duration">
                                  {course.overallDuration}
                                </span>
                                <span className="level">{course.level}</span>
                              </div>
                              <p className="description">
                                {course.description}
                              </p>
                              <div className="card-actions">
                                <button
                                  className="continue-btn"
                                  onClick={() =>
                                    navigate(`/course/${course.id}`)
                                  }
                                >
                                  Continue Learning
                                </button>
                                <button
                                  className="unenroll-btn"
                                  onClick={() =>
                                    handleUnenrollCourse(course.id)
                                  }
                                >
                                  Unenroll
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-results">
                        {searchTerm
                          ? "No enrolled courses match your search"
                          : "You have no enrolled courses yet"}
                      </div>
                    )}
                  </div>
                </section>
              )}
              <CustomAlert
                visible={alertVisible}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
              />
              <CustomConfirm
                visible={confirmVisible}
                message="Are you sure you want to delete this course?"
                onCancel={() => setConfirmVisible(false)}
                onConfirm={() => {
                  confirmCallback();
                  setConfirmVisible(false);
                }}
              />
            </main>
          </div>
        }
      />

      <Route path="/course/:id" element={<CoursePage />} />
    </Routes>
  );
}

export default LandingPage;

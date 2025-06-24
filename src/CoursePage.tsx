import { useState } from "react";
import logo from "./images/maestrominds-300x300.jpg";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const courseData = {
  title: "Mastering Modern Web Development",
  subtitle:
    "Learn to build responsive, modern websites with React, CSS Grid, and Flexbox",
  description: `This course provides a comprehensive guide to modern web development, focusing on React, CSS Grid,
  Flexbox, and best practices for building responsive, accessible, and visually stunning websites. You'll build projects
  and get hands-on experience that empowers you to create production-ready frontends.`,
  instructor: {
    name: "Jane Doe",
    avatar:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/81347c73-365d-4909-be13-34652c658ab0.png",
    bio: "Senior Frontend Engineer with 10+ years of experience building interactive web applications in React.",
  },
  details: {
    duration: "8h 30m",
    level: "Intermediate",
    language: "English",
    lastUpdated: "June 2024",
    students: "5,432",
  },
  userName: "Jane Doe",
  rating: {
    average: 4.6,
    count: 1289,
  },
  videos: [
    {
      id: "vid1",
      title: "1.1 Introduction to Modern Web Development",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Overview of course objectives and setup.",
    },
    {
      id: "vid2",
      title: "1.2 React Fundamentals",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Core React concepts including components and JSX.",
    },
    {
      id: "vid3",
      title: "1.3 CSS Grid and Flexbox",
      url: "https://www.w3schools.com/html/movie.mp4",
      description: "Learn layout techniques with CSS Grid and Flexbox.",
    },
    {
      id: "vid4",
      title: "1.4 Accessibility and Best Practices",
      url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      description: "Building accessible components and design.",
    },
    {
      id: "vid5",
      title: "1.5 State Management in React",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      description:
        "Explore useState, useReducer, and context for managing state in React apps.",
    },
    {
      id: "vid6",
      title: "1.6 Routing with React Router",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description:
        "Implement client-side routing and navigation using React Router.",
    },
    {
      id: "vid7",
      title: "1.7 Deploying Your Web App",
      url: "https://www.w3schools.com/html/movie.mp4",
      description: "Learn how to deploy your React application to production.",
    },
    {
      id: "vid8",
      title: "1.8 Testing React Components",
      url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      description:
        "Introduction to testing React components with popular tools.",
    },
    {
      id: "vid9",
      title: "1.9 Performance Optimization",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      description:
        "Tips and techniques for optimizing the performance of your React apps.",
    },
  ],
};

const iconSvg = (pathData: string, title: string) => (
  <svg
    role="img"
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    style={{ flexShrink: 0, marginRight: 8, color: "#6b7280" }}
  >
    <title>{title}</title>
    <path d={pathData} />
  </svg>
);

const detailItems = [
  {
    label: "Duration",
    value: courseData.details.duration,
    icon: "M12 1v22M5 7h14M5 17h14", // Clock simplified icon shape
  },
  {
    label: "Level",
    value: courseData.details.level,
    icon: "M12 2l9 21H3L12 2z", // Badge style icon
  },
  {
    label: "Language",
    value: courseData.details.language,
    icon: "M2 12h20M12 2l7 20M12 2L5 22", // Globe style icon
  },
  {
    label: "Last Updated",
    value: courseData.details.lastUpdated,
    icon: "M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zm9-4v5l3 3", // Clock with hands icon
  },
  {
    label: "Students",
    value: courseData.details.students,
    icon: "M7 20h10M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", // Group icon simplified
  },
];

type StarRatingProps = {
  rating: number;
  count: number;
};
const StarRating = ({ rating, count }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div
      className="star-rating"
      aria-label={`Course rating ${rating} out of 5, based on ${count} reviews`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={"full-" + i}
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="#a0522d"
          stroke="none"
        >
          <path d="M12 .587l3.668 7.568L24 9.423l-6 5.855L19.335 24 12 20.328 4.665 24 6 15.278 0 9.423l8.332-1.268z" />
        </svg>
      ))}
      {halfStar && (
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a0522d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#a0522d" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGrad)"
            d="M12 .587l3.668 7.568L24 9.423l-6 5.855L19.335 24 12 20.328 4.665 24 6 15.278 0 9.423l8.332-1.268z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={"empty-" + i}
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d1bfa1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 .587l3.668 7.568L24 9.423l-6 5.855L19.335 24 12 20.328 4.665 24 6 15.278 0 9.423l8.332-1.268z" />
        </svg>
      ))}
      <span className="rating-count">({count})</span>
    </div>
  );
};

type TopMenuBarProps = {
  userName: string;
};
const TopMenuBar = (_props: TopMenuBarProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <header
        className={`topmenu ${menuOpen ? "menu-visible" : "menu-hidden"}`}
      >
        {/* Left spacer for sidebar button */}
        <div className="menu-side-placeholder" />

        {/* Centered content */}
        <div className="topmenu-center">
          
            <div className="logo">
              <img src={logo} alt="Logo" className="logo-img" />
              <div className="logo-text-container">
                <div className="logo-text-line1">Maestrominds Learning Hub</div>
              </div>
            </div>

            {/* <div className="search-bar-container">
              <input
                type="search"
                className="search-bar"
                placeholder="🔍 Search"
              />
            </div> */}
          

          <div className="nav-buttons">
            <button
              className="nav-button"
              onClick={() => navigate("/all-courses")}
            >
              All Courses
            </button>
            <button className="nav-button">My Courses</button>
            <button className="nav-button add-course"> + Add Course</button>
          </div>
        </div>

        {/* Right spacer for profile button */}
        <div className="menu-side-placeholder" />
      </header>
    </>
  );
};

export default function CoursePage() {
  const { id } = useParams();
  console.log("Course ID from URL:", id);

  const [currentVideoId, setCurrentVideoId] = useState(courseData.videos[0].id);

  const currentVideo = courseData.videos.find((v) => v.id === currentVideoId)!;

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

/* ===== Base Reset ===== */
* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #f8f1e7;
  color: #5a381e;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== Typography ===== */
h1, h2, h3 {
  margin: 0;
  line-height: 1.2;
  font-weight: 700;
  color: #5a381e;
}

p {
  margin: 0;
  line-height: 1.6;
  color: #6e4c2e;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover, a:focus {
  text-decoration: underline;
  outline: none;
}

/* ===== Layout ===== */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 80px;
}

main {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ===== Top Menu ===== */
.topmenu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  min-height: 80px;
  background-color: #f3e7d3;
  border-bottom: 1px solid #d9cabb;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  z-index: 110;
  font-weight: 600;
  font-size: 1rem;
  color: #5a381e;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.menu-side-placeholder {
  width: 40px;
  height: 1px;
  flex-shrink: 0;
}

.topmenu-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  gap: 16px;
  flex-wrap: wrap;
  min-width: 0;
}

.branding-search {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  flex: 1;
  min-width: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  white-space: nowrap;
  margin-right: auto;
}

.logo-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  background: #fff4e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(90, 56, 30, 0.1);
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  max-width: none;
}

.logo-text-line1 {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.1;
  white-space: nowrap;
}

.logo-text-line2 {
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.1;
  color: #865c30;
  white-space: nowrap;
}

/* .search-bar-container {
  flex: 0 1 200px;
  max-width: 250px;
  display: flex;
  justify-content: center;
}

.search-bar {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9cabb;
  border-radius: 8px;
  font-size: 1rem;
  color: #5a381e;
  background-color: #fcf6e9;
  transition: border-color 0.3s ease;
}

.search-bar::placeholder {
  color: #a37c4c;
}

.search-bar:focus {
  outline: none;
  border-color: #bc6c25;
  box-shadow: 0 0 0 3px rgba(188, 108, 37, 0.3);
  background-color: #fff9f0;
} */

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #bc6c25;
  font-weight: 700;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 8px;
  white-space: nowrap;
  transition: background-color 0.3s ease;
}

.nav-button:hover,
.nav-button:focus {
  background-color: #ffe6b3;
  outline: none;
}

.nav-button.add-course {
  background-color: #bc6c25;
  color: #fff4e6;
  border: none;
}

.nav-button.add-course:hover,
.nav-button.add-course:focus {
  background-color: #a05818;
  outline: none;
}

.hamburger-btn {
  display: none;
}

@media (max-width: 768px) {
  .topmenu {
    /* Adjust topmenu for mobile */
    flex-direction: column; /* Stack items vertically */
    align-items: center; /* Center items horizontally */
    padding: 12px 30px 50px; /* Add some padding */
    min-height: auto; /* Allow height to adjust */
    justify-content: flex-start; /* Align content to the start */
    /* Ensure it's always a flex container for its direct children */
    display: flex;
  }

  /* This div is the direct child of .topmenu that contains logo/text and nav buttons */
  .topmenu-center {
    flex-direction: column; /* Default to column for stacking */
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    word-break: break-word;
    width: 100%; /* Take full width */
    /* Ensure it's always a flex container */
    display: flex;
  }

  /* The .logo element itself contains the image and the text container */
  .logo {
    display: flex; /* Always display logo and text side-by-side */
    flex-direction: row; /* Keep logo image and text in a row */
    align-items: center;
    justify-content: center; /* Center logo and text within their container */
    flex-wrap: nowrap; /* Prevent wrapping for logo and text */
    white-space: nowrap;
    margin: 0; /* Remove auto margin that might push it */
    width: 100%; /* Ensure it takes available width to center */
  }

  .logo-text-container {
    display: flex; /* ALWAYS display the text container in mobile */
    flex-direction: column; /* Stack text lines */
    align-items: flex-start; /* Align text to the start within its container */
    margin-left: 8px; /* Space between logo image and text */
  }

  .logo-text-line1 {
    font-size: 1rem; /* Ensure readable size */
    white-space: nowrap; /* Keep text on one line if possible */
    text-align: left; /* Align text to the left */
  }

  /* Hide nav buttons when menu is hidden */
  .menu-hidden .nav-buttons {
    display: none;
  }

  /* Show nav buttons when menu is visible */
  .menu-visible .nav-buttons {
    display: flex;
    flex-direction: column; /* Stack buttons vertically */
    width: 100%; /* Take full width */
    gap: 8px; /* Space between buttons */
    margin-top: 12px; /* Add some space above buttons when expanded */
  }

  .nav-button {
    width: 100%;
    text-align: center;
  }

  .hamburger-btn {
    display: block;
    position: absolute; /* Position relative to topmenu */
    top: 16px;
    right: 16px;
    z-index: 999; /* Ensure it's above other content */
    font-size: 1.5rem;
    background: none;
    border: none; 
    color: #5a381e;
  }

  /* Adjust topmenu height based on menu state */
  .topmenu.menu-hidden {
    height: 80px; /* Fixed height for minimized state (logo + padding) */
    overflow: hidden; /* Hide overflowing content */
    /* Ensure topmenu-center is centered vertically within the fixed height */
    justify-content: center;
  }

  .topmenu.menu-visible {
    height: auto; /* Auto height for expanded state */
    overflow: visible; /* Show all content */
    justify-content: flex-start; /* Align content to the start */
  }

  /* Ensure the .topmenu-center correctly positions its children */
  .menu-hidden .topmenu-center {
    flex-direction: row; /* Keep logo and text in a row */
    justify-content: center; /* Center logo and text */
    align-items: center;
    height: 100%; /* Take full height of the minimized topmenu */
  }

  .menu-visible .topmenu-center {
    flex-direction: column; /* Stack logo/text and nav buttons */
    justify-content: flex-start; /* Align content to the start */
    align-items: center;
  }

  /* Remove the display:none from logo-text-container that was previously here */
  /* .logo-text-container { display: none; } */
  /* .menu-visible .logo-text-container { display: flex; } */

  /* Remove the redundant media query at the very end if it exists */
  /*
  @media (max-width: 768px) {
    .menu-hidden .search-bar-container,
    .menu-hidden .nav-buttons {
      display: none;
    }

    .menu-visible {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .menu-visible .topmenu-left,
    .menu-visible .search-bar-container,
    .menu-visible .nav-buttons {
      display: flex;
    }
  }
  */
}



/* Retain your other section styles (videos, course info, etc.) as they were. */

/* ===== Video Section ===== */
.video-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 16px;
}

.video-description {
  margin-top: 8px;
  font-size: 1rem;
  color: #6e4c2e;
  font-weight: 600;
  background: #fff4e6;
  padding: 8px 16px;
  border-radius: 12px;
  user-select: none;
}

/* (Remaining styles stay unchanged) */


/* ===== Video List ===== */
.video-list-section {
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: #fff4e6;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.video-list-heading {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: #5a381e;
  user-select: none;
}

.video-list-item {
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #5a381e;
  background-color: transparent;
  transition: background-color 0.25s;
  text-align: left;
  border: none;
  outline: none;
  user-select: none;
}

.video-list-item:hover,
.video-list-item:focus {
  background-color: #bc6c2580;
}

.video-list-item.active {
  background-color: #bc6c25;
  color: #fff4e6;
  cursor: default;
}

/* ===== Course Info & Details ===== */
.course-info-details-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-bottom: 32px;
}

.course-info {
  width: 100%;
  margin-bottom: 16px;
  padding: 0 16px;
}

.course-title {
  font-size: 1.75rem;
}

.course-subtitle {
  font-weight: 600;
  font-size: 1.125rem;
  color: #865c30;
  margin-bottom: 12px;
  padding-top: 12px;
}

.course-description {
  font-size: 1rem;
  color: #6e4c2e;
  line-height: 1.5;
  text-align: justify;
  margin-bottom: 24px;
  padding: 0 16px;
}

.details-card {
  background: #fff4e6;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding-left: 16px;
  padding-right: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #6e4c2e;
  gap: 8px;
}

.detail-label {
  font-weight: 600;
  width: 90px;
  color: #a37c4c;
}

/* ===== Instructor Card ===== */
.instructor-card {
  background: #fff4e6;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  margin-top: 24px;
  padding-left: 16px;
  padding-right: 16px;
}

.instructor-photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #a97449;
  box-shadow: 0 4px 10px rgba(169, 116, 73, 0.4);
}

.instructor-name {
  font-weight: 700;
  font-size: 1.25rem;
  color: #5a381e;
}

.instructor-bio {
  font-size: 0.95rem;
  color: #865c30;
  max-width: 320px;
}

/* ===== Enroll Button ===== */
.enroll-btn {
  background: #bc6c25;
  color: #fff4e6;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin-top: 16px;
  margin-bottom: 32px;
  transition: background-color 0.3s ease;
  align-self: center;
  width: 100%;
  max-width: 320px;
}

.enroll-btn:hover,
.enroll-btn:focus {
  background-color: #a05818;
  outline: none;
  box-shadow: 0 0 0 3px rgba(188, 108, 37, 0.6);
}


/* ===== Responsive Breakpoints ===== */
@media (max-width: 1024px) {
  main {
    flex-direction: column;
    padding: 32px 16px;
  }

  .video-wrapper,
  .video-description,
  .course-info-details-container,
  .video-list-section {
    width: 100% !important;
    max-width: 100% !important;
  }

  .video-list-section {
    max-height: 300px;
  }

  .enroll-btn {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .logo-text {
    max-width: 120px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .logo {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    text-align: center;
  }

  .logo-img {
    margin-right: 0;
  }

  .logo-text {
    white-space: normal;
    max-width: 100%;
    font-size: 0.95rem;
  }
}
  @media (max-width: 768px) {
  .menu-hidden .search-bar-container,
  .menu-hidden .nav-buttons {
    display: none;
  }

  .menu-visible {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .menu-visible .topmenu-left,
  .menu-visible .search-bar-container,
  .menu-visible .nav-buttons {
    display: flex;
  }
}
      `}</style>
      <div className="page-wrapper">
        <TopMenuBar userName={courseData.userName} />
        <main>
          <div
            className="video-wrapper"
            aria-label={`Video player: ${currentVideo.title}`}
          >
            <video
              key={currentVideo.id}
              controls
              src={currentVideo.url}
              preload="metadata"
              aria-describedby="video-description"
            >
              Sorry, your browser does not support embedded videos.
            </video>
            <div
              id="video-description"
              className="video-description"
              aria-live="polite"
            >
              {currentVideo.description}
            </div>
          </div>

          <div
            className="video-list-section"
            aria-label="Course videos list"
            role="list"
          >
            {/* Add a progress meter here to indicate course completion */}
            <div className="video-list-heading">Course Videos</div>
            {courseData.videos.map((video) => (
              <button
                key={video.id}
                className={`video-list-item ${
                  video.id === currentVideoId ? "active" : ""
                }`}
                onClick={() => setCurrentVideoId(video.id)}
                role="listitem"
                aria-current={video.id === currentVideoId}
              >
                {video.title}
              </button>
            ))}
          </div>
        </main>
        <section
          className="course-info-details-container"
          aria-label="Course info and details"
        >
          <article className="course-info" aria-labelledby="course-title">
            <h1 id="course-title" className="course-title">
              {courseData.title}
            </h1>
            <h2 className="course-subtitle">{courseData.subtitle}</h2>
            <p className="course-description">{courseData.description}</p>
            <StarRating
              rating={courseData.rating.average}
              count={courseData.rating.count}
            />
          </article>

          <section className="details-card" aria-label="Course details">
            {detailItems.map(({ label, value, icon }) => (
              <div key={label} className="detail-row">
                {iconSvg(icon, label)}
                <span className="detail-label">{label}:</span>
                <span>{value}</span>
              </div>
            ))}

            <button
              className="enroll-btn"
              type="button"
              aria-label={`Enroll in ${courseData.title} course`}
            >
              Enroll Now
            </button>
          </section>

          <section className="instructor-card" aria-label="Instructor details">
            <img
              src={courseData.instructor.avatar}
              alt={`Avatar of instructor ${courseData.instructor.name}`}
              className="instructor-photo"
              width={96}
              height={96}
              loading="lazy"
            />
            <h3 className="instructor-name">{courseData.instructor.name}</h3>
            <p className="instructor-bio">{courseData.instructor.bio}</p>
          </section>
        </section>
      </div>
    </>
  );
}

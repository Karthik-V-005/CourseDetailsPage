import { useState } from "react";
import logo from "./images/maestrominds-300x300.jpg";

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
      title: "Introduction to Modern Web Development",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Overview of course objectives and setup.",
    },
    {
      id: "vid2",
      title: "React Fundamentals",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Core React concepts including components and JSX.",
    },
    {
      id: "vid3",
      title: "CSS Grid and Flexbox",
      url: "https://www.w3schools.com/html/movie.mp4",
      description: "Learn layout techniques with CSS Grid and Flexbox.",
    },
    {
      id: "vid4",
      title: "Accessibility and Best Practices",
      url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      description: "Building accessible components and design.",
    },
    {
      id: "vid5",
      title: "State Management in React",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      description:
        "Explore useState, useReducer, and context for managing state in React apps.",
    },
    {
      id: "vid6",
      title: "Routing with React Router",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description:
        "Implement client-side routing and navigation using React Router.",
    },
    {
      id: "vid7",
      title: "Deploying Your Web App",
      url: "https://www.w3schools.com/html/movie.mp4",
      description: "Learn how to deploy your React application to production.",
    },
    {
      id: "vid8",
      title: "Testing React Components",
      url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      description:
        "Introduction to testing React components with popular tools.",
    },
    {
      id: "vid9",
      title: "Performance Optimization",
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
  return (
    <header className="topmenu" style={{ padding: "50px 50px 50px 60px" }}>
      <div className="topmenu-left">
        <div
          className="logo"
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
        <img
          src={logo}
          alt="Maestrominds logo"
          style={{
            width: 72,
            height: 72,
            marginRight: 10,
            objectFit: "cover",
            boxShadow: "0 2px 8px rgba(90,56,30,0.10)",
            background: "#fff4e6",
          }}
          loading="lazy"
          aria-hidden="true"
          tabIndex={0}
          aria-label="Maestrominds Learning Hub"
        />
            <span
            style={{
              fontWeight: 700,
              fontSize: "1.3rem",
              fontFamily: "'Poppins', sans-serif",
              color: "#5a381e",
              userSelect: "none",
              letterSpacing: "0.01em",
              maxWidth: "160px",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              display: "inline-block",
              verticalAlign: "middle",
              whiteSpace: "normal",
              lineHeight: 1.2,
            }}
            >
            Maestrominds Learning Hub
            </span>
        </div>
        <div className="search-bar-container">
          <input
            type="search"
            className="search-bar"
            placeholder="🔍 Search courses"
            aria-label="Search courses"
            
            style={{ width: "330px" }}
          />
        </div>
        <button className="nav-button" type="button" aria-label="All Courses" style={
          { marginLeft: "32px" }
        }>
          All Courses
        </button>
        <button className="nav-button" type="button" aria-label="My Courses">
          My Courses
        </button>
        <button
          className="nav-button add-course"
          type="button"
          aria-label="Add Course"
        >
          + Add Course
        </button>
      </div>
      <div className="topmenu-right"></div>
    </header>
  );
};

export default function CoursePage() {
  const [currentVideoId, setCurrentVideoId] = useState(courseData.videos[0].id);

  const currentVideo = courseData.videos.find((v) => v.id === currentVideoId)!;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
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
        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover, a:focus {
          text-decoration: underline;
          outline: none;
        }
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
        main {
          margin-left: 0;
          margin-top: 64px;
          padding: 48px 35px;
          min-height: calc(100vh - 64px);
          overflow-y: auto;
          max-width: 100%;
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .video-wrapper {
          width: 65%;
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
          max-width: 90%;
          user-select: none;
        }
        .course-info-details-container {
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 24px;
          max-width: 8000px;
          padding: 50px;
          padding-top: 4px;
        }
        .course-info {
          max-width: 100%;
        }
        .course-title {
          font-size: 2rem;
          color: #5a381e;
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
          max-width: 100%;
          text-align: justify;
        }
        .star-rating {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a37c4c;
          font-size: 0.95rem;
          user-select: none;
        }
        .rating-count {
          margin-left: 8px;
        }
        .video-list-section {
          width: 30%;
          max-height: 520px;
          overflow-y: auto;
          background: #fff4e6;
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          user-select: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 400px;
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
          user-select: none;
          text-align: left;
          border: none;
          outline: none;
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
        .details-card {
          background: #fff4e6;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 100%;
        }
        .detail-row {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: #6e4c2e;
          gap: 4px;
        }
        .detail-label {
          font-weight: 600;
          flex-grow: 0;
          width: 90px;
          color: #a37c4c;
        }
        .instructor-card {
          width: 100%;
          background: #fff4e6;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }
        .instructor-photo {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 16px auto;
          border: 3px solid #a97449;
          box-shadow: 0 4px 10px rgba(169, 116, 73, 0.4);
        }
        .instructor-name {
          font-weight: 700;
          font-size: 1.25rem;
          color: #5a381e;
          margin-bottom: 8px;
        }
        .instructor-bio {
          font-size: 0.95rem;
          color: #865c30;
          max-width: 320px;
          margin-left: auto;
          margin-right: auto;
        }
        .enroll-btn {
          background: #bc6c25;
          color: #fff4e6;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 16px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          margin-top: 24px;
          transition: background-color 0.3s ease;
          max-width: 320px;
          align-self: center;
        }
        .enroll-btn:hover, .enroll-btn:focus {
          background-color: #a05818;
          outline: none;
          box-shadow: 0 0 0 3px rgba(188, 108, 37, 0.6);
        }
        /* Top menu styles */
        .topmenu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background-color: #f3e7d3;
          border-bottom: 1px solid #d9cabb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 110;
          font-weight: 600;
          font-size: 1rem;
          color: #5a381e;
        }
        .topmenu-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .logo {
          user-select: none;
          font-weight: 700;
          font-size: 1.5rem;
          font-family: 'Poppins', sans-serif;
          color: #5a381e;
          letter-spacing: 0.05em;
        }
        .search-bar-container {
          flex: 1 1 auto;
          max-width: 300px;
        }
        .search-bar {
          width: 100%;
          padding: 8px 12px;
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
        .nav-button:hover, .nav-button:focus {
          background-color: #ffe6b3;
          outline: none;
        }
        .nav-button.add-course {
          background-color: #bc6c25;
          color: #fff4e6;
        }
        .nav-button.add-course:hover, .nav-button.add-course:focus {
          background-color: #a05818;
          outline: none;
        }
        /* Responsive */
        @media (max-width: 1024px) {
          main {
            flex-direction: column;
            padding: 32px 16px;
          }
          .video-wrapper, .video-description, .course-info-details-container, .video-list-section {
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

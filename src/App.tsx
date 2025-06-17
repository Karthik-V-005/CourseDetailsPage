import { useState, useEffect, useRef } from 'react';

const courseData = {
  title: "Mastering Modern Web Development",
  subtitle: "Learn to build responsive, modern websites with React, CSS Grid, and Flexbox",
  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
  description: `This course provides a comprehensive guide to modern web development, focusing on React, CSS Grid,
  Flexbox, and best practices for building responsive, accessible, and visually stunning websites. You'll build projects
  and get hands-on experience that empowers you to create production-ready frontends.`,
  instructor: {
    name: "Jane Doe",
    avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/81347c73-365d-4909-be13-34652c658ab0.png", // Placeholder avatar with initials
    bio: "Senior Frontend Engineer with 10+ years of experience building interactive web applications in React."
  },
  details: {
    duration: "8h 30m",
    level: "Intermediate",
    language: "English",
    lastUpdated: "June 2024",
    students: "5,432"
  },
  userName: "Jane Doe",
  rating: {
    average: 4.6,
    count: 1289
  }
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
    style={{ flexShrink: 0, marginRight: 8, color: '#6b7280' }}
  >
    <title>{title}</title>
    <path d={pathData} />
  </svg>
);

const detailItems = [
  {
    label: 'Duration',
    value: courseData.details.duration,
    icon: 'M12 1v22M5 7h14M5 17h14' // Clock simplified icon shape
  },
  {
    label: 'Level',
    value: courseData.details.level,
    icon: 'M12 2l9 21H3L12 2z' // Badge style icon
  },
  {
    label: 'Language',
    value: courseData.details.language,
    icon: 'M2 12h20M12 2l7 20M12 2L5 22' // Globe style icon
  },
  {
    label: 'Last Updated',
    value: courseData.details.lastUpdated,
    icon: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zm9-4v5l3 3' // Clock with hands icon
  },
  {
    label: 'Students',
    value: courseData.details.students,
    icon: 'M7 20h10M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' // Group icon simplified
  }
];

const categories = [
  "Development",
  "Business",
  "IT & Software",
  "Design",
  "Marketing",
  "Personal Development"
];

// Rearranged sidebar items per request: Community Home Page, Time Tracker, Project Tracker
type SidebarProps = {
  visible: boolean;
};

const Sidebar = ({ visible }: SidebarProps) => {
  return (
    <nav
      className={`sidebar ${visible ? 'visible' : 'hidden'}`}
      aria-label="Main sidebar navigation"
      aria-hidden={visible ? 'false' : 'true'}
    >
      <ul>
        <li><a href="#community-home" tabIndex={visible ? 0 : -1}>Community Home Page</a></li>
        <li><a href="#time-tracker" tabIndex={visible ? 0 : -1}>Time Tracker</a></li>
        <li><a href="#project-tracker" tabIndex={visible ? 0 : -1}>Project Tracker</a></li>
      </ul>
    </nav>
  );
};

// Simple star rating with filled and half star icons
type StarRatingProps = {
  rating: number;
  count: number;
};
const StarRating = ({ rating, count }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating" aria-label={`Course rating ${rating} out of 5, based on ${count} reviews`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={"full-" + i} aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
          <path d="M12 .587l3.668 7.568L24 9.423l-6 5.855L19.335 24 12 20.328 4.665 24 6 15.278 0 9.423l8.332-1.268z"/>
        </svg>
      ))}
      {halfStar && (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)" d="M12 .587l3.668 7.568L24 9.423l-6 5.855L19.335 24 12 20.328 4.665 24 6 15.278 0 9.423l8.332-1.268z"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={"empty-" + i} aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 .587l3.668 7.568L24 9.423l-6 5.855L19.335 24 12 20.328 4.665 24 6 15.278 0 9.423l8.332-1.268z"/>
        </svg>
      ))}
      <span className="rating-count">({count})</span>
    </div>
  );
};

type TopMenuBarProps = {
  onToggleSidebar: () => void;
  userName: string;
};
const TopMenuBar = ({ onToggleSidebar, userName }: TopMenuBarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for profile menu
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <header className="topmenu">
      <div className="topmenu-left">
        <button
          type="button"
          className="sidebar-toggle-button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="company-name" tabIndex={0} aria-label="Company Maestrominds">
          Maestrominds
        </div>
        <div className="categories-dropdown" ref={categoriesRef}>
          <button
            type="button"
            className="categories-toggle"
            aria-haspopup="listbox"
            aria-expanded={categoriesOpen}
            aria-controls="categories-list"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                setCategoriesOpen(true);
                e.preventDefault();
              }
              if (e.key === 'Escape') setCategoriesOpen(false);
            }}
          >
            Categories ▾
          </button>
          {categoriesOpen && (
            <ul
              className="categories-list"
              id="categories-list"
              role="listbox"
              tabIndex={-1}
              aria-label="Course categories"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setCategoriesOpen(false);
                }
              }}
            >
              {categories.map(cat => (
                <li key={cat} role="option" tabIndex={0} onClick={() => setCategoriesOpen(false)}>
                  <a href={`#category-${cat.toLowerCase().replace(/\s+/g, '-')}`} tabIndex={-1}>{cat}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="search-bar-container">
          <input
            type="search"
            className="search-bar"
            placeholder="Search for courses"
            aria-label="Search for courses"
          />
        </div>
      </div>
      <div className="topmenu-right">
        <button type="button" className="icon-button" aria-label="Notifications">
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"
            viewBox="0 0 24 24" aria-hidden="true"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notif-text">Alert</span>
        </button>
        <div className="profile-menu" ref={profileRef}>
          <button
            type="button"
            className="profile-button"
            aria-haspopup="true"
            aria-expanded={profileOpen}
            aria-controls="profile-menu-list"
            onClick={() => setProfileOpen(!profileOpen)}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                setProfileOpen(true);
                e.preventDefault();
              }
              if (e.key === 'Escape') setProfileOpen(false);
            }}
          >
            {userName}
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"
              viewBox="0 0 24 24" aria-hidden="true" style={{ marginLeft: 6 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {profileOpen && (
            <ul
              className="profile-menu-list"
              id="profile-menu-list"
              role="menu"
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setProfileOpen(false);
                }
              }}
            >
              <li role="menuitem" tabIndex={0}><a href="#view-profile" onClick={() => setProfileOpen(false)}>View Profile</a></li>
              <li role="menuitem" tabIndex={0}><a href="#logout" onClick={() => setProfileOpen(false)}>Logout</a></li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default function CoursePage() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

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
          background-color: #f9fafb;
          color: #111827;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        /* Make the root container a flex column to push footer */
        #root > div.page-wrapper {
          flex-direction: column;
          height: 100%;
        }
        /* Append the below style to #root > div.page-wrapper to support flex */
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
        }
        p {
          margin: 0;
          line-height: 1.6;
          color: #374151;
        }

        /* Container for content to flex-grow */
        .content-container {
          display: flex;
          flex: 1 1 auto;
          overflow: hidden;
        }

        /* Sidebar styles */
        .sidebar {
          background: #4f46e5;
          color: white;
          width: 220px;
          padding-top: 64px; /* room for topmenu */
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          z-index: 101;
          transition: transform 0.3s ease;
          transform: translateX(0);
        }
        .sidebar.hidden {
          transform: translateX(-100%);
        }
        .sidebar ul {
          list-style: none;
          padding: 0 16px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-weight: 600;
          font-size: 1rem;
          flex-grow: 1;
        }
        .sidebar ul li a {
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          display: block;
          transition: background-color 0.3s ease;
        }
        .sidebar ul li a:hover,
        .sidebar ul li a:focus {
          background-color: #4338ca;
          outline: none;
        }

        /* Main content area excluding sidebar */
        main {
          margin-left: 220px;
          max-width: calc(100% - 220px);
          margin-top: 64px; /* height of topmenu */
          padding: 48px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          min-height: calc(100vh - 64px);
          transition: margin-left 0.3s ease, max-width 0.3s ease;
          overflow-y: auto;
        }
        main.full-width {
          margin-left: 0;
          max-width: 100%;
          padding: 24px 16px;
          grid-template-columns: 1fr;
        }

        /* Video player */
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
        .course-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 16px;
        }
        .course-title {
          font-size: 2rem;
          color: #1f2937;
        }
        .course-subtitle {
          font-weight: 600;
          font-size: 1.125rem;
          color: #4b5563;
        }
        .course-description {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.5;
          max-width: 640px;
        }
        .details-card, .instructor-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .detail-row {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 0.95rem;
          color: #374151;
        }
        .detail-label {
          font-weight: 600;
          flex-grow: 0;
          width: 90px;
          color: #6b7280;
        }
        .instructor-card {
          text-align: center;
          padding-top: 32px;
          padding-bottom: 32px;
        }
        .instructor-photo {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 16px auto;
          border: 3px solid #4f46e5;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.4);
        }
        .instructor-name {
          font-weight: 700;
          font-size: 1.25rem;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .instructor-bio {
          font-size: 0.95rem;
          color: #6b7280;
          max-width: 320px;
          margin-left: auto;
          margin-right: auto;
        }
        .enroll-btn {
          background: #4f46e5;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 16px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          margin-top: 24px;
          transition: background-color 0.3s ease;
          width: 100%;
          max-width: 320px;
          align-self: center;
        }
        .enroll-btn:hover, .enroll-btn:focus {
          background: #4338ca;
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.6);
        }

        /* Rating */
        .star-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 12px;
        }
        .rating-count {
          margin-left: 8px;
          color: #6b7280;
          font-size: 0.95rem;
          user-select: none;
        }

        /* Top menu bar styles */
        .topmenu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 110;
          font-weight: 600;
          font-size: 1rem;
          color: #374151;
        }
        .topmenu-left, .topmenu-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .sidebar-toggle-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #4f46e5;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .sidebar-toggle-button:hover, .sidebar-toggle-button:focus {
          background-color: #e0e7ff;
          outline: none;
        }
        .company-name {
          font-size: 1.375rem;
          font-weight: 700;
          color: #4f46e5;
          cursor: default;
          user-select: none;
        }
        .categories-dropdown {
          position: relative;
        }
        .categories-toggle {
          background: none;
          border: none;
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.3s ease;
          white-space: nowrap;
        }
        .categories-toggle:hover, .categories-toggle:focus {
          background-color: #e0e7ff;
          outline: none;
        }
        .categories-list {
          position: absolute;
          top: 42px;
          left: 0;
          background: white;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 8px;
          list-style: none;
          margin: 0;
          padding: 8px 0;
          width: 180px;
          z-index: 120;
        }
        .categories-list li {
          padding: 8px 16px;
          cursor: pointer;
        }
        .categories-list li:hover, .categories-list li:focus {
          background-color: #4f46e5;
          color: white;
          outline: none;
        }
        .categories-list li a {
          display: block;
          width: 100%;
          color: inherit;
          text-decoration: none;
        }
        .search-bar-container {
          position: relative;
          flex: 1 1 auto;
          max-width: 560px;
        }
        .search-bar {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          color: #374151;
          transition: border-color 0.3s ease;
        }
        .search-bar::placeholder {
          color: #9ca3af;
        }
        .search-bar:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
        }

        /* Icons on the right */
        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #374151;
          padding: 8px 8px 8px 4px;
          border-radius: 8px;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          font-weight: 600;
          font-size: 1rem;
          gap: 6px;
          white-space: nowrap;
        }
        .icon-button:hover, .icon-button:focus {
          background-color: #e0e7ff;
          outline: none;
        }
        .notif-text {
          user-select: none;
        }

        /* Profile menu */
        .profile-menu {
          position: relative;
        }
        .profile-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #374151;
          padding: 8px 12px;
          border-radius: 100px;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          font-weight: 600;
          font-size: 1rem;
          gap: 6px;
          white-space: nowrap;
        }
        .profile-button:hover, .profile-button:focus {
          background-color: #e0e7ff;
          outline: none;
        }
        .profile-menu-list {
          position: absolute;
          top: 44px;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 8px;
          list-style: none;
          margin: 0;
          padding: 8px 0;
          width: 140px;
          z-index: 130;
        }
        .profile-menu-list li {
          padding: 8px 16px;
          cursor: pointer;
        }
        .profile-menu-list li:hover, .profile-menu-list li:focus {
          background-color: #4f46e5;
          color: white;
          outline: none;
        }
        .profile-menu-list li a {
          display: block;
          width: 100%;
          color: inherit;
          text-decoration: none;
        }

        /* Black bottom bar fixed at page bottom */
        footer {
          background-color: #111111;
          color: #eeeeee;
          padding: 32px 24px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          font-size: 0.95rem;
          gap: 24px;
          user-select: none;
        }
        footer .footer-section {
          flex: 1 1 180px;
          min-width: 180px;
        }
        footer h4 {
          margin-bottom: 12px;
          font-weight: 700;
          color: #fbbf24; /* Accent color */
        }
        footer a {
          color: #eeeeee;
          text-decoration: none;
        }
        footer a:hover, footer a:focus {
          text-decoration: underline;
          outline: none;
        }
        footer address {
          font-style: normal;
          line-height: 1.6;
        }
        footer .icon {
          vertical-align: middle;
          margin-right: 8px;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .sidebar {
            width: 180px;
          }
          main {
            margin-left: 180px;
            max-width: calc(100% - 180px);
          }
          .sidebar.hidden {
            transform: translateX(-100%);
          }
        }

        @media (max-width: 640px) {
          .sidebar {
            display: none !important;
          }
          main {
            margin-left: 0 !important;
            max-width: 100% !important;
            margin-top: 64px;
            padding: 24px 16px;
            grid-template-columns: 1fr !important;
          }
          .topmenu-left {
            gap: 12px;
          }
          .categories-toggle {
            font-size: 0.875rem;
          }
          .company-name {
            font-size: 1.125rem;
          }
          footer {
            flex-direction: column;
          }
        }
      `}</style>
      <div className="page-wrapper">
        <TopMenuBar onToggleSidebar={toggleSidebar} userName={courseData.userName} />
        <Sidebar visible={sidebarVisible} />
        <main className={sidebarVisible ? '' : 'full-width'}>
          <section>
            <div className="video-wrapper" aria-label="Course video player">
              <video
                controls
                src={courseData.videoUrl}
                poster="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/366394e9-b839-471a-abd9-7a0a716182aa.png"
                preload="metadata"
                aria-describedby="course-video-desc"
              >
                Sorry, your browser does not support embedded videos.
              </video>
            </div>
            <article className="course-info" aria-labelledby="course-title">
              <h1 id="course-title" className="course-title">{courseData.title}</h1>
              <h2 className="course-subtitle">{courseData.subtitle}</h2>
              <p className="course-description">{courseData.description}</p>
              <StarRating rating={courseData.rating.average} count={courseData.rating.count} />
            </article>
          </section>

          <aside>
            <section className="details-card" aria-label="Course details">
              {detailItems.map(({ label, value, icon }) => (
                <div key={label} className="detail-row">
                  {iconSvg(icon, label)}
                  <span className="detail-label">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}

              <button className="enroll-btn" type="button" aria-label={`Enroll in ${courseData.title} course`}>
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
          </aside>
        </main>

        <footer>
          <div className="footer-section">
            <h4>Contact</h4>
            <address>
              1234 Learning St.<br />
              Knowledge City, 56789<br />
              Phone: <a href="tel:+1234567890" aria-label="Phone number">+1 234 567 890</a><br />
              Email: <a href="mailto:contact@maestrominds.com" aria-label="Email address">contact@maestrominds.com</a>
            </address>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://linkedin.com/company/maestrominds" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a></li>
              <li><a href="https://maps.google.com?q=1234+Learning+St+Knowledge+City" target="_blank" rel="noopener noreferrer" aria-label="Location Map">Map</a></li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  );
}


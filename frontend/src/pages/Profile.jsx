import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser, getMyBlogs } from "../routes/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Reveal } from "../components/blog/blogUi.jsx";
import StateCard from "../components/blog/StateCard.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import ProfileTabs from "../components/profile/ProfileTabs.jsx";
import ProfileInfoCard from "../components/profile/ProfileInfoCard.jsx";
import ChangePasswordCard from "../components/profile/ChangePasswordCard.jsx";
import MyBlogsSection from "../components/profile/MyBlogsSection.jsx";
import {
  ProfileHeaderSkeleton,
  ProfileCardSkeleton,
} from "../components/profile/ProfileSkeleton.jsx";

const PAGE_LIMIT = 9;

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [tab, setTab] = useState("profile");

  const [profile, setProfile] = useState(authUser ?? null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [blogs, setBlogs] = useState({ rows: [], pagination: {} });
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await getCurrentUser();
      setProfile(res?.data?.data ?? res?.data ?? null);
    } catch (err) {
      /* fall back to the session user so the page stays usable */
      if (authUser) setProfile(authUser);
      else setProfileError(err);
    } finally {
      setProfileLoading(false);
    }
  }, [authUser]);

  const fetchBlogs = useCallback(async () => {
    setBlogsLoading(true);
    setBlogsError(null);
    try {
      const res = await getMyBlogs({
        page,
        limit: PAGE_LIMIT,
        sortBy: "createdAt",
        sortType: "desc",
      });
      const data = res?.data?.data;
      setBlogs({
        rows: data?.rows ?? (Array.isArray(data) ? data : []),
        pagination: data?.pagination ?? {},
      });
    } catch (err) {
      setBlogsError(err);
      setBlogs({ rows: [], pagination: {} });
    } finally {
      setBlogsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (authUser) fetchProfile();
  }, [authUser, fetchProfile]);

  useEffect(() => {
    if (authUser) fetchBlogs();
  }, [authUser, fetchBlogs]);

  if (!authUser) return <Navigate to="/login" replace />;

  const openBlog = (blog) => {
    if (blog?.id) navigate(`/blog/${blog.id}`);
  };

  const handlePageChange = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showProfile = tab === "profile";
  const showSecurity = tab === "security";
  const showBlogs = tab === "blogs";

  return (
    <main className="min-h-screen bg-base-200/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {profileLoading && !profile ? (
          <ProfileHeaderSkeleton />
        ) : profileError ? (
          <StateCard
            icon={faRotateRight}
            title="Unable to load your profile"
            description="Something went wrong while loading your account information."
            actionLabel="Try Again"
            onAction={fetchProfile}
          />
        ) : (
          <Reveal>
            <ProfileHeader user={profile} />
          </Reveal>
        )}

        {!profileError && (
          <>
            <div className="mt-8">
              <ProfileTabs active={tab} onChange={setTab} />
            </div>

            {(showProfile || showSecurity) && (
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {showProfile &&
                  (profileLoading && !profile ? (
                    <ProfileCardSkeleton />
                  ) : (
                    <Reveal>
                      <ProfileInfoCard user={profile} />
                    </Reveal>
                  ))}
                {showSecurity && (
                  <Reveal delay={80}>
                    <ChangePasswordCard />
                  </Reveal>
                )}
              </div>
            )}

            {showBlogs && (
              <MyBlogsSection
                blogs={blogs.rows}
                loading={blogsLoading}
                error={blogsError}
                currentPage={blogs.pagination?.currentPage ?? page}
                totalPages={blogs.pagination?.totalPages ?? 1}
                onPageChange={handlePageChange}
                onOpen={openBlog}
                onRetry={fetchBlogs}
                onStartWriting={() => navigate("/add")}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Profile;
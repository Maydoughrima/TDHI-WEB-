import { useEffect, useState } from "react";
import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import Button from "../components/UI/Button";
import TextField from "../components/UI/TextField";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===============================
     FETCH PROFILE
  =============================== */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user = JSON.parse(stored);

    fetch("/api/me", {
      headers: {
        "x-user-id": user.id,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProfile(json.data);

          // ✅ sync for TopCard
          localStorage.setItem("me", JSON.stringify(json.data));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===============================
     IMAGE PREVIEW
  =============================== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ===============================
     SAVE PROFILE IMAGE
  =============================== */
  const saveProfileImage = async () => {
    if (!imageFile || !profile) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("profile_image", imageFile);

      const res = await fetch("/api/me/profile-image", {
        method: "PUT",
        headers: {
          "x-user-id": user.id,
        },
        body: formData,
      });

      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("Server did not return JSON");
      }

      if (!json.success) {
        throw new Error(json.message || "Image upload failed");
      }

      const updatedProfile = {
        ...profile,
        profile_image: json.profile_image,
      };

      // ✅ update local state
      setProfile(updatedProfile);

      // ✅ update TopCard source of truth
      localStorage.setItem("me", JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event("profile-updated"));


      setPreview(null);
      setImageFile(null);
    } catch (err) {
      console.error("PROFILE IMAGE UPLOAD ERROR:", err);
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     LOADING STATE
  =============================== */
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="bg-bgshade min-h-screen w-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading profile…</p>
        </main>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <main className="bg-bgshade min-h-screen w-full px-2 md:px-4 overflow-x-hidden">
        <div className="container flex flex-col gap-6">
          <TopCard title="Profile" />

          <div className="bg-bg rounded-md shadow-md p-6 flex flex-col gap-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={
                    preview ||
                    profile.profile_image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile.fullname
                    )}&background=ddd&color=555`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border"
                />

                <label className="absolute bottom-0 right-0 bg-secondary text-bg text-xs px-3 py-1 rounded cursor-pointer">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-xl font-heading font-semibold text-fontc">
                  {profile.fullname}
                </h2>
                <p className="text-sm text-gray-500">
                  @{profile.username}
                </p>
                <span className="inline-block mt-2 text-xs px-3 py-1 rounded bg-gray-200 text-gray-700">
                  {profile.role}
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Full Name" value={profile.fullname} disabled />
              <TextField label="Username" value={profile.username} disabled />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <Button
                className="bg-gray-200 text-fontc"
                disabled={!imageFile || saving}
                onClick={() => {
                  setPreview(null);
                  setImageFile(null);
                }}
              >
                Cancel
              </Button>

              <Button
                className="bg-secondary text-bg"
                disabled={!imageFile || saving}
                onClick={saveProfileImage}
              >
                {saving ? "Saving..." : "Save Image"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

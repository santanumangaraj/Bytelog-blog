import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faGear, faShieldHalved, faGavel, faBell } from "@fortawesome/free-solid-svg-icons";
import { api, unwrap } from "../data/apiBridge.js";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import AdminEmptyState from "../components/AdminEmptyState.jsx";
import { AdminCardSkeleton } from "../components/AdminLoadingState.jsx";

const Field = ({ label, hint, children }) => (
  <label className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
    <span className="min-w-0">
      <span className="block text-sm font-medium text-base-content">{label}</span>
      {hint && <span className="block text-xs text-base-content/50">{hint}</span>}
    </span>
    <span className="shrink-0">{children}</span>
  </label>
);

const Toggle = ({ checked, onChange }) => (
  <input type="checkbox" className="toggle toggle-sm" checked={checked} onChange={(e) => onChange(e.target.checked)} />
);

const SettingsSection = ({ icon, title, description, children, onSave, saving, saved }) => (
  <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <FontAwesomeIcon icon={icon} className="text-sm" />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-base-content">{title}</h2>
        <p className="text-xs text-base-content/50">{description}</p>
      </div>
    </div>

    <div className="mt-2 divide-y divide-base-300">{children}</div>

    <div className="mt-4 flex items-center justify-end gap-3">
      {saved && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
          <FontAwesomeIcon icon={faCircleCheck} />
          Saved
        </span>
      )}
      <button type="button" onClick={onSave} disabled={saving} className="btn btn-sm rounded-full">
        {saving ? <span className="loading loading-spinner loading-xs" /> : null}
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  </div>
);

const useSavedFlash = () => {
  const [saved, setSaved] = useState(false);
  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return [saved, flash];
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);
  const [savedGeneral, flashGeneral] = useSavedFlash();
  const [savedSecurity, flashSecurity] = useSavedFlash();
  const [savedModeration, flashModeration] = useSavedFlash();
  const [savedNotifications, flashNotifications] = useSavedFlash();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = unwrap(await api.getAdminSettings());
      setSettings(res);
      setLoading(false);
    })();
  }, []);

  const patch = (section, values) =>
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], ...values } }));

  const save = async (section, flash) => {
    setSavingSection(section);
    try {
      await api.updateAdminSettings(section, settings[section]);
      flash();
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Settings" subtitle="Configure ByteLog platform behavior" />
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <AdminCardSkeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div>
        <AdminPageHeader title="Settings" subtitle="Configure ByteLog platform behavior" />
        <div className="mt-6">
          <AdminEmptyState
            title="Settings aren't connected yet"
            description="getAdminSettings() has no backend endpoint yet — see src/admin/MISSING.md."
            icon={faGear}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Settings" subtitle="Configure ByteLog platform behavior" />

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SettingsSection
          icon={faGear}
          title="General"
          description="Basic site identity and availability."
          onSave={() => save("general", flashGeneral)}
          saving={savingSection === "general"}
          saved={savedGeneral}
        >
          <Field label="Site name">
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => patch("general", { siteName: e.target.value })}
              className="input input-sm input-bordered w-48 rounded-lg"
            />
          </Field>
          <Field label="Site description">
            <input
              type="text"
              value={settings.general.siteDescription}
              onChange={(e) => patch("general", { siteDescription: e.target.value })}
              className="input input-sm input-bordered w-48 rounded-lg"
            />
          </Field>
          <Field label="Maintenance mode" hint="Temporarily takes the public site offline.">
            <Toggle checked={settings.general.maintenanceMode} onChange={(v) => patch("general", { maintenanceMode: v })} />
          </Field>
        </SettingsSection>

        <SettingsSection
          icon={faShieldHalved}
          title="Security"
          description="Session and login protection."
          onSave={() => save("security", flashSecurity)}
          saving={savingSection === "security"}
          saved={savedSecurity}
        >
          <Field label="Require email verification" hint="New accounts must verify before publishing.">
            <Toggle
              checked={settings.security.requireEmailVerification}
              onChange={(v) => patch("security", { requireEmailVerification: v })}
            />
          </Field>
          <Field label="Session timeout (minutes)">
            <input
              type="number"
              min={5}
              value={settings.security.sessionTimeoutMinutes}
              onChange={(e) => patch("security", { sessionTimeoutMinutes: Number(e.target.value) })}
              className="input input-sm input-bordered w-24 rounded-lg text-right"
            />
          </Field>
          <Field label="Max login attempts" hint="Before an account is temporarily locked.">
            <input
              type="number"
              min={1}
              value={settings.security.maxLoginAttempts}
              onChange={(e) => patch("security", { maxLoginAttempts: Number(e.target.value) })}
              className="input input-sm input-bordered w-24 rounded-lg text-right"
            />
          </Field>
        </SettingsSection>

        <SettingsSection
          icon={faGavel}
          title="Moderation"
          description="How new content is reviewed."
          onSave={() => save("moderation", flashModeration)}
          saving={savingSection === "moderation"}
          saved={savedModeration}
        >
          <Field label="Auto-publish" hint="Skip manual review for trusted authors.">
            <Toggle checked={settings.moderation.autoPublish} onChange={(v) => patch("moderation", { autoPublish: v })} />
          </Field>
          <Field label="Require approval for new authors">
            <Toggle
              checked={settings.moderation.requireApprovalForNewAuthors}
              onChange={(v) => patch("moderation", { requireApprovalForNewAuthors: v })}
            />
          </Field>
          <Field label="Auto-hide after N reports" hint="Hide content pending review once this many reports land.">
            <input
              type="number"
              min={1}
              value={settings.moderation.autoHideAfterReports}
              onChange={(e) => patch("moderation", { autoHideAfterReports: Number(e.target.value) })}
              className="input input-sm input-bordered w-24 rounded-lg text-right"
            />
          </Field>
        </SettingsSection>

        <SettingsSection
          icon={faBell}
          title="Notifications"
          description="Admin alerting preferences."
          onSave={() => save("notifications", flashNotifications)}
          saving={savingSection === "notifications"}
          saved={savedNotifications}
        >
          <Field label="Email on new report">
            <Toggle
              checked={settings.notifications.emailOnNewReport}
              onChange={(v) => patch("notifications", { emailOnNewReport: v })}
            />
          </Field>
          <Field label="Email on new user">
            <Toggle
              checked={settings.notifications.emailOnNewUser}
              onChange={(v) => patch("notifications", { emailOnNewUser: v })}
            />
          </Field>
          <Field label="Weekly digest">
            <Toggle checked={settings.notifications.weeklyDigest} onChange={(v) => patch("notifications", { weeklyDigest: v })} />
          </Field>
        </SettingsSection>
      </div>
    </div>
  );
};

export default AdminSettings;

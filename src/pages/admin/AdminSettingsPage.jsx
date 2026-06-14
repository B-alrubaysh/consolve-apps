import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAdminUser } from "../../components/admin/ProtectedAdminLayout";
import { requireRole, ROLES } from "../../lib/rbac";
import AccessDenied from "../../components/admin/AccessDenied";
import SiteInfoTab from "../../components/admin/settings/SiteInfoTab";
import FooterSocialTab from "../../components/admin/settings/FooterSocialTab";
import AboutPageTab from "../../components/admin/settings/AboutPageTab";
import ContactPageTab from "../../components/admin/settings/ContactPageTab";
import ProfileTab from "../../components/admin/settings/ProfileTab";
import EmailCapturesTab from "../../components/admin/settings/EmailCapturesTab";

export default function AdminSettingsPage() {
  const me = useAdminUser();
  const allowed = requireRole(me, ROLES.OWNER, ROLES.ADMIN, ROLES.WRITER, ROLES.HR);

  const role = me?.role;
  const isOwnerAdmin = role === ROLES.OWNER || role === ROLES.ADMIN;

  const tabs = useMemo(() => {
    const list = [];
    if (isOwnerAdmin) list.push({ value: "site", label: "Site Info" });
    if (isOwnerAdmin) list.push({ value: "footer", label: "Footer & Social" });
    if (isOwnerAdmin) list.push({ value: "about", label: "About Page" });
    if (isOwnerAdmin) list.push({ value: "contact", label: "Contact Page" });
    list.push({ value: "profile", label: "Profile" });
    if (isOwnerAdmin) list.push({ value: "captures", label: "Email Captures" });
    return list;
  }, [isOwnerAdmin]);

  if (!allowed) return <AccessDenied />;

  const defaultTab = tabs[0]?.value || "profile";

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/50 mt-1">Site configuration and your profile</p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="bg-white/5 border border-white/10">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {isOwnerAdmin && (
          <TabsContent value="site" className="mt-6">
            <SiteInfoTab />
          </TabsContent>
        )}
        {isOwnerAdmin && (
          <TabsContent value="footer" className="mt-6">
            <FooterSocialTab />
          </TabsContent>
        )}
        {isOwnerAdmin && (
          <TabsContent value="about" className="mt-6">
            <AboutPageTab />
          </TabsContent>
        )}
        {isOwnerAdmin && (
          <TabsContent value="contact" className="mt-6">
            <ContactPageTab />
          </TabsContent>
        )}
        <TabsContent value="profile" className="mt-6">
          <ProfileTab me={me} />
        </TabsContent>
        {isOwnerAdmin && (
          <TabsContent value="captures" className="mt-6">
            <EmailCapturesTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
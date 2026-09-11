import { useSelector } from "react-redux";
import { CalendarDays, Mail, User } from "lucide-react";

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const initials = getInitials(user?.name);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight">
              {user?.name}
            </h2>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold">Personal information</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Your basic account information.
          </p>
        </div>

        <div className="divide-y divide-border">
          <div className="flex flex-col gap-1.5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-medium">Full name</p>

                <p className="mt-0.5 text-sm text-muted-foreground">
                  {user?.name || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-medium">Email address</p>

                <p className="mt-0.5 break-all text-sm text-muted-foreground">
                  {user?.email || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold">Account</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Information about your TaskFlow account.
          </p>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium">Member since</p>

              <p className="mt-0.5 text-sm text-muted-foreground">
                {memberSince}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;

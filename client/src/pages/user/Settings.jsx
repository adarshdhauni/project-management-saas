import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold">Appearance</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Customize how TaskFlow looks.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-medium">Theme</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose how TaskFlow appears on your device.
            </p>
          </div>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-full sm:w-40 cursor-pointer">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="system" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  System
                </div>
              </SelectItem>

              <SelectItem value="light" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </div>
              </SelectItem>

              <SelectItem value="dark" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold">Security</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage your account security.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-medium">Password</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Change your account password.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer sm:w-auto"
          >
            Change password
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Settings;

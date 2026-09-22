import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const WorkspaceNotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
          <FolderKanban className="size-5 text-muted-foreground" />
        </div>

        <h1 className="text-lg font-semibold">Workspace not found</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          This workspace may have been deleted or you may no longer have access
          to it.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceNotFound;

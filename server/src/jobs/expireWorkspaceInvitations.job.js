import cron from "node-cron";
import workspaceService from "../services/workspace.service.js";

const startInvitationExpirationJob = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const count = await workspaceService.expireWorkspaceInvitations();

      if (count > 0) {
        console.log(`Expired ${count} workspace invitation(s).`);
      }
    } catch (error) {
      console.error("Failed to expire workspace invitations:", error);
    }
  });
};

export default startInvitationExpirationJob;

import app from "./app.js";
import { connectDB } from "./database/connectDB.js";
import startInvitationExpirationJob from "./jobs/expireWorkspaceInvitations.job.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    startInvitationExpirationJob();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
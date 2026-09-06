export const PLANS = [
  {
    name: "Free",
    description:
      "Everything you need to explore TaskFlow and manage real projects.",
    price: "$0",
    period: "forever",
    features: [
      "Workspaces",
      "Workspace members & invitations",
      "Projects and tasks",
      "Task comments",
      "Activity tracking",
      "Notifications",
    ],
    cta: "Get started",
    featured: false,
    comingSoon: false,
  },

  {
    name: "Pro",
    description:
      "For individuals and growing teams managing projects together.",
    price: "$9",
    period: "per user / month",
    cta: "Coming soon",
    featured: true,
    comingSoon: true,
  },

  {
    name: "Team",
    description: "A paid plan designed for teams and organizations.",
    price: "$16",
    period: "per user / month",
    cta: "Coming soon",
    featured: false,
    comingSoon: true,
  },
];

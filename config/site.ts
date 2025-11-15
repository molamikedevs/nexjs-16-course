export const siteConfig = {
  name: "Welcome to Next.js",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
  ROUTES: {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    ASK_QUESTION: "/ask-question",
    COLLECTION: "/collection",
    COMMUNITY: "/community",
    TAGS: "/tags",
    JOBS: "/jobs",
    PROFILE: (id: string) => `/profile/${id}`,
    QUESTION: (id: string) => `/questions/${id}`,
    TAG: (id: string) => `/tags/${id}`,
    SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
  },
};



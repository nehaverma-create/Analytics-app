import { createClerkClient, verifyToken } from "@clerk/backend";

const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
  throw new Error("CLERK_SECRET_KEY is required");
}

const clerkClient = createClerkClient({ secretKey });

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = header.slice(7);
    const { sub: userId } = await verifyToken(token, { secretKey });
    const user = await clerkClient.users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return res.status(401).json({ error: "User email not found" });
    }

    req.user = { userId, email };
    next();
  } catch (error) {
    console.error("Auth failed:", error.message);
    res.status(401).json({ error: "Unauthorized" });
  }
}

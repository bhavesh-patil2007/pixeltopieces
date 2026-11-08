import connectToDatabase from "@/lib/mongodb";
import AuthRateLimit from "@/models/AuthRateLimit";

const WINDOW_MS = 15 * 60 * 1000;

type RateLimitResult = {
  allowed: boolean;
  attempts: number;
  retryAfterSeconds: number;
};

/**
 * Atomically records an attempt in MongoDB. The update pipeline resets an
 * expired window and increments an active one without a read/write race.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
): Promise<RateLimitResult> {
  await connectToDatabase();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + WINDOW_MS);
  const record = await AuthRateLimit.findOneAndUpdate(
    { _id: key },
    [
      {
        $set: {
          attempts: {
            $cond: [
              { $gt: ["$expiresAt", now] },
              { $add: [{ $ifNull: ["$attempts", 0] }, 1] },
              1,
            ],
          },
          expiresAt,
        },
      },
    ],
    { upsert: true, new: true },
  );

  const attempts = record?.attempts ?? 1;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil(((record?.expiresAt?.getTime() ?? expiresAt.getTime()) - now.getTime()) / 1000),
  );

  return {
    allowed: attempts <= maxAttempts,
    attempts,
    retryAfterSeconds,
  };
}

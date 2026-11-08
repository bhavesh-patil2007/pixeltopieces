import connectToDatabase from "@/lib/mongodb";
import AuthRateLimit from "@/models/AuthRateLimit";

const WINDOW_MS = 15 * 60 * 1000;

type RateLimitResult = {
  allowed: boolean;
  attempts: number;
  retryAfterSeconds: number;
};

/** Atomically record an attempt in a fixed MongoDB rate-limit window. */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
): Promise<RateLimitResult> {
  await connectToDatabase();

  const now = new Date();
  const nextExpiry = new Date(now.getTime() + WINDOW_MS);
  const updatePipeline = [
    {
      $set: {
        attempts: {
          $cond: [
            { $gt: ["$expiresAt", now] },
            { $add: [{ $ifNull: ["$attempts", 0] }, 1] },
            1,
          ],
        },
        expiresAt: {
          $cond: [
            { $gt: ["$expiresAt", now] },
            "$expiresAt",
            nextExpiry,
          ],
        },
      },
    },
  ];

  let record;
  try {
    record = await AuthRateLimit.findOneAndUpdate(
      { _id: key },
      updatePipeline,
      { upsert: true, returnDocument: "after", updatePipeline: true },
    );
  } catch (error) {
    // Concurrent first attempts can race to create the same _id. Retry the
    // atomic update after the first request has inserted its rate-limit row.
    if (
      typeof error !== "object" ||
      error === null ||
      !("code" in error) ||
      error.code !== 11000
    ) {
      throw error;
    }

    record = await AuthRateLimit.findOneAndUpdate(
      { _id: key },
      updatePipeline,
      { returnDocument: "after", updatePipeline: true },
    );
  }

  const attempts = record?.attempts ?? 1;
  const expiresAt = record?.expiresAt ?? nextExpiry;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
  );

  return {
    allowed: attempts <= maxAttempts,
    attempts,
    retryAfterSeconds,
  };
}

// pages/api/revalidate.ts

import type { NextApiRequest, NextApiResponse } from "next";

type Data = { revalidated: true } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { path, secret } = req.query;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!path || typeof path !== "string") {
    return res.status(400).json({ message: "Invalid path" });
  }

  try {
    await res.revalidate(path);

    return res.status(200).json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ message: "Error revalidating" });
  }
}

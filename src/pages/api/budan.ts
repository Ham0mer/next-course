import { NextApiRequest, NextApiResponse } from "next";
import { budanCourse } from "@/lib/xuexitong/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      code: 0,
      msg: "课程ID不能为空",
      data: null,
    });
  }

  try {
    const result = await budanCourse(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      code: 0,
      msg: error instanceof Error ? error.message : "补单失败",
      data: null,
    });
  }
}

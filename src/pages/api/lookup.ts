import type { NextApiRequest, NextApiResponse } from "next";
import { lookupXuexitongWithCache } from "@/lib/xuexitong/client";
import { CourseRecord } from "@/lib/xuexitong/types";

type Data = {
  status: boolean;
  time: number;
  cached?: boolean;
  username?: string;
  totalCourses?: number;
  completedCourses?: number;
  inProgressCourses?: number;
  data?: CourseRecord[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { query } = req.query;

  if (!query || typeof query !== "string" || query.length === 0) {
    return res
      .status(400)
      .json({ time: -1, status: false, error: "用户名不能为空" });
  }

  const result = await lookupXuexitongWithCache(query);
  
  if (!result.status) {
    return res.status(500).json({ 
      time: result.time, 
      status: false, 
      error: result.error 
    });
  }

  return res.status(200).json({
    time: result.time,
    status: true,
    cached: result.cached,
    username: result.username,
    totalCourses: result.totalCourses,
    completedCourses: result.completedCourses,
    inProgressCourses: result.inProgressCourses,
    data: result.data,
  });
}

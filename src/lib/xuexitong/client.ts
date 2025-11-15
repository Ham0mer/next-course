import {
  XuexitongApiResponse,
  XuexitongResult,
  CourseRecord,
  BudanResponse,
} from "./types";
import { getJsonRedisValue, setJsonRedisValue } from "@/lib/server/redis";
import { COURSE_API_BASE_URL } from "@/lib/env";

const XUEXITONG_API_URL = `${COURSE_API_BASE_URL}/api.php?act=chadan`;
const BUDAN_API_URL = `${COURSE_API_BASE_URL}/api.php?act=budan`;

/**
 * 调用学习通查询 API
 */
async function queryXuexitongApi(
  username: string,
): Promise<XuexitongApiResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);

    const response = await fetch(XUEXITONG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: XuexitongApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("学习通 API 查询失败:", error);
    throw error;
  }
}

/**
 * 统计课程信息
 */
function analyzeCourses(courses: CourseRecord[]) {
  const total = courses.length;
  const completed = courses.filter((c) => c.status === "已完成").length;
  const inProgress = courses.filter((c) => c.status !== "已完成").length;

  return {
    totalCourses: total,
    completedCourses: completed,
    inProgressCourses: inProgress,
  };
}

/**
 * 查询学习通课程（带缓存）
 */
export async function lookupXuexitongWithCache(
  username: string,
): Promise<XuexitongResult> {
  const key = `xuexitong:${username}`;
  const cached = await getJsonRedisValue<XuexitongResult>(key);

  if (cached) {
    return {
      ...cached,
      time: 0,
      cached: true,
    };
  }

  const result = await lookupXuexitong(username);

  if (result.status) {
    await setJsonRedisValue<XuexitongResult>(key, result);
  }

  return {
    ...result,
    cached: false,
  };
}

/**
 * 查询学习通课程
 */
export async function lookupXuexitong(
  username: string,
): Promise<XuexitongResult> {
  const startTime = performance.now();

  try {
    const apiResponse = await queryXuexitongApi(username);

    if (apiResponse.code !== 1) {
      return {
        status: false,
        time: (performance.now() - startTime) / 1000,
        error: apiResponse.msg || "查询失败",
      };
    }

    const stats = analyzeCourses(apiResponse.data);

    return {
      status: true,
      time: (performance.now() - startTime) / 1000,
      username: username,
      data: apiResponse.data,
      ...stats,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "未知错误";

    return {
      status: false,
      time: (performance.now() - startTime) / 1000,
      error: errorMessage,
    };
  }
}

/**
 * 课程补单
 */
export async function budanCourse(courseId: string): Promise<BudanResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append("id", courseId);

    const response = await fetch(BUDAN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`补单请求失败: ${response.statusText}`);
    }

    const data: BudanResponse = await response.json();
    return data;
  } catch (error) {
    console.error("课程补单失败:", error);
    return {
      code: 0,
      msg: error instanceof Error ? error.message : "补单失败",
      data: null,
    };
  }
}

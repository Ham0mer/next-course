// 学习通课程记录
export type CourseRecord = {
  id: string;
  ptname: string;
  school: string;
  name: string;
  user: string;
  kcname: string;
  addtime: string;
  courseStartTime: string;
  courseEndTime: string;
  examStartTime: string;
  examEndTime: string;
  status: string;
  process: string;
  remarks: string;
};

// API 响应结构
export type XuexitongApiResponse = {
  code: number;
  msg: string;
  data: CourseRecord[];
};

// 查询结果（用于前端展示）
export type XuexitongResult = {
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

// 补单 API 响应
export type BudanResponse = {
  code: number;
  msg: string;
  data: null;
};

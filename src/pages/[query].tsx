import { lookupXuexitongWithCache } from "@/lib/xuexitong/client";
import { XuexitongResult, CourseRecord } from "@/lib/xuexitong/types";
import { cn, toSearchURI, useClipboard } from "@/lib/utils";
import { NextPageContext } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RiFileCopyLine,
  RiArrowLeftSLine,
  RiCheckLine,
  RiTimeLine,
  RiBookOpenLine,
  RiUserLine,
  RiCalendarLine,
  RiPercentLine,
  RiAddCircleLine,
} from "@remixicon/react";
import React, { useEffect } from "react";
import { addHistory } from "@/lib/history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ErrorArea from "@/components/items/error-area";
import { SearchBox } from "@/components/search_box";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Props = {
  data: XuexitongResult;
  username: string;
};

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context.query;
  const username: string = (query as string) || "";

  return {
    props: {
      data: await lookupXuexitongWithCache(username),
      username,
    },
  };
}

function CourseCard({ course }: { course: CourseRecord }) {
  const { t } = useTranslation();
  const [budanLoading, setBudanLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const isCompleted = course.status === "已完成";

  const handleBudan = async () => {
    setDialogOpen(false);
    setBudanLoading(true);
    try {
      const response = await fetch("/api/budan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: course.id }),
      });

      const data = await response.json();

      if (data.code === 1) {
        toast.success(t("budan_success"));
      } else {
        toast.error(data.msg || t("budan_failed"));
      }
    } catch (error) {
      toast.error(t("budan_failed"));
    } finally {
      setBudanLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <RiBookOpenLine className="w-4 h-4 text-primary" />
                {course.kcname}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {course.ptname}
              </p>
            </div>
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className={cn(
                "ml-2",
                isCompleted && "bg-green-600 hover:bg-green-700"
              )}
            >
              {course.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="flex items-center gap-2">
              <RiPercentLine className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("progress")}:</span>
              <span className="font-medium">{course.process}</span>
            </div>
            <div className="flex items-center gap-2">
              <RiCalendarLine className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("add_time")}:</span>
              <span className="font-medium">{course.addtime}</span>
            </div>
          </div>
          
          {course.remarks && (
            <div className="mb-3 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              {t("remarks")}: {course.remarks}
            </div>
          )}

          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={budanLoading}
              >
                {budanLoading ? (
                  <>
                    <RiTimeLine className="w-4 h-4 mr-2 animate-spin" />
                    {t("budan_processing")}
                  </>
                ) : (
                  <>
                    <RiAddCircleLine className="w-4 h-4 mr-2" />
                    {t("budan")}
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("budan")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("budan_confirm")}
                  <div className="mt-2 text-sm font-medium text-foreground">
                    {course.kcname}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("back")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleBudan}>
                  确认补单
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn("text-2xl font-bold mt-1", color)}>{value}</p>
          </div>
          <div className={cn("p-3 rounded-lg", `bg-${color.split("-")[1]}-100`)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function QueryPage({ data, username }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const copy = useClipboard();

  useEffect(() => {
    if (data.status) {
      addHistory(username);
    }
  }, [data.status, username]);

  const handleSearch = React.useCallback((query: string) => {
    setLoading(true);
    window.location.href = toSearchURI(query);
  }, []);

  const copyAllCourses = () => {
    if (!data.data) return;
    const text = data.data
      .map(
        (course) =>
          `${t("course")}: ${course.kcname}\n${t("platform")}: ${course.ptname}\n${t("status")}: ${course.status}\n${t("progress")}: ${course.process}\n${t("add_time")}: ${course.addtime}\n---`,
      )
      .join("\n");
    copy(text);
  };

  if (!data.status) {
    return (
      <main className="w-full min-h-screen p-4 md:p-6">
        <div className="max-w-[568px] mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <RiArrowLeftSLine className="w-4 h-4 mr-1" />
                {t("back_to_home")}
              </Button>
            </Link>
          </div>

          <SearchBox onSearch={handleSearch} loading={loading} />

          <div className="mt-6">
            <ErrorArea error={data.error || t("query_failed")} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen p-4 md:p-6">
      <div className="max-w-[568px] mx-auto">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <RiArrowLeftSLine className="w-4 h-4 mr-1" />
              {t("back_to_home")}
            </Button>
          </Link>
          
          {data.cached && (
            <Badge variant="outline" className="text-xs">
              <RiTimeLine className="w-3 h-3 mr-1" />
              {t("cached_data")}
            </Badge>
          )}
        </div>

        {/* 搜索框 */}
        <SearchBox
          initialValue={username}
          onSearch={handleSearch}
          loading={loading}
          className="mb-6"
        />

        {/* 用户信息卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiUserLine className="w-5 h-5" />
              {t("user_info")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("query_user")}</p>
                <p className="text-xl font-semibold mt-1">{username}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyAllCourses}>
                <RiFileCopyLine className="w-4 h-4 mr-2" />
                {t("copy_all_courses")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label={t("total_courses")}
            value={data.totalCourses || 0}
            icon={<RiBookOpenLine className="w-6 h-6 text-blue-600" />}
            color="text-blue-600"
          />
          <StatCard
            label={t("completed_courses")}
            value={data.completedCourses || 0}
            icon={<RiCheckLine className="w-6 h-6 text-green-600" />}
            color="text-green-600"
          />
          <StatCard
            label={t("in_progress_courses")}
            value={data.inProgressCourses || 0}
            icon={<RiTimeLine className="w-6 h-6 text-orange-600" />}
            color="text-orange-600"
          />
        </div>

        {/* 课程列表 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("course_list")}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.data && data.data.length > 0 ? (
              data.data.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {t("no_courses")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 查询时间 */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          {t("query_time")}: {data.time.toFixed(3)}s
        </div>
      </div>
    </main>
  );
}

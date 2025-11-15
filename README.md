## 📏 环境变量

### SEO
- `NEXT_PUBLIC_SITE_TITLE`: 网站标题
- `NEXT_PUBLIC_SITE_DESCRIPTION`: 网站描述
- `NEXT_PUBLIC_SITE_KEYWORDS`: 网站关键词

### 历史记录
- `NEXT_PUBLIC_HISTORY_LIMIT`: 历史记录限制 (默认: -1, 无限制)

### 缓存
- `REDIS_HOST`: Redis 主机 (为空时禁用缓存)
- `REDIS_PORT`: Redis 端口 (默认: 6379)
- `REDIS_PASSWORD`: Redis 密码 (可选)
- `REDIS_DB`: Redis 数据库 (默认: 0)
- `REDIS_CACHE_TTL`: Redis 缓存过期时间(秒) (默认: 3600)

## 📝 API 接口
`GET` `/api/lookup?query=xxxxx`

<details>
<summary><strong>成功响应</strong> OK (200)</summary>

```json
{
  "status": true,
  "time": 1.234,
  "cached": false,
  "username": "xxxxx",
  "totalCourses": 4,
  "completedCourses": 4,
  "inProgressCourses": 0,
  "data": [
    {
      "id": "518577",
      "ptname": "图图_学习通（全包）",
      "school": "自动识别无需填写",
      "name": "",
      "user": "xxxxx",
      "kcname": "药理学专业英语",
      "addtime": "2025-11-01 19:46:03",
      "status": "已完成",
      "process": "100%",
      "remarks": "不允许学生查看成绩"
    }
  ]
}
```
</details>

<details>
<summary><strong>失败响应</strong> Internal Server Error (500)</summary>

```json
{
  "status": false,
  "time": 0.456,
  "error": "查询失败"
}
```
</details>

<details>
<summary><strong>错误响应</strong> Bad Request (400)</summary>

```json
{
  "time": -1,
  "status": false,
  "error": "用户名不能为空"
}
```
</details>

## 🧠 技术栈
- Next.js 14
- Shadcn UI & Tailwind CSS
- Framer Motion
- Redis (缓存)
- 学习通查询 API

## � 联系方式
如有问题或建议，欢迎提出 Issue 或 Pull Request。

---

**Powered by Next.js + Shadcn UI** 🚀

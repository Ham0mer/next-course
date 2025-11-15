<div align="center">

<img src="/public/icons/icon-512x512.png" alt="Course Query Platform" width="64" height="64">

# 🎓 网课查询平台
🔍 综合网课课程信息查询系统

[English](/README.md) · [简体中文](/docs/README_CN.md)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Ham0mer/next-whois)

</div>

## 😎 功能特性

1. ✨ **现代 UI**: 基于 [Shadcn UI](https://ui.shadcn.com) 的现代化设计，使用体验极佳
2. 📱 **响应式**: 完美支持 移动端✅ / 平板✅ / 桌面✅，支持 PWA 应用
3. 🌈 **多主题**: 支持亮色/暗色主题，系统主题检测，随心切换
4. 🚀 **快速查询**: 基于 Next.js，支持无服务器部署和快速查询
5. 📚 **历史记录**: 历史记录本地存储，方便查看和查询历史
6. � **智能搜索**: 支持手机号和用户名查询
7. � **数据统计**: 自动统计总课程数、已完成、进行中等信息
8. 📡 **结果缓存**: 基于 Redis 的缓存机制，提升查询速度
9. 🌍 **国际化**: 多语言支持

👉 [贡献代码](https://github.com/Ham0mer/next-whois/pulls)

## 部署
#### `1` 🚀 平台部署（推荐）
[Vercel](https://vercel.com/import/project?template=https://github.com/Ham0mer/next-whois) / [Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/Ham0mer/next-whois)

#### `2` 🐳 Docker
```bash
docker run -d -p 3000:3000 your-image-name
```

#### `3` 🔨 源码部署
```bash
git clone https://github.com/Ham0mer/next-whois
cd next-whois

npm install -g pnpm
pnpm install
pnpm dev
```

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

# 构建阶段
FROM node:20 AS builder

# 设置工作目录
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --force

# 复制源代码
COPY . .
COPY env.template .env

RUN echo "DATABASE_URL: ${DATABASE_URL}"

# 构建应用
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 设置为生产环境
ENV NODE_ENV=production

# 从构建阶段复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]

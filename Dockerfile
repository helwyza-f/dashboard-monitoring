# Menggunakan Node.js sebagai base image
FROM node:22.1.0

# Set work directory
WORKDIR /app

# Salin package.json dan lock file
COPY package.json package-lock.json ./

# Instal dependencies
RUN npm ci --force --legacy-peer-deps

# Salin seluruh kode aplikasi
COPY . .

# Prisma generate
RUN npx prisma generate

# Build aplikasi
RUN npm run build

# Expose port
EXPOSE 3000

# Jalankan server Next.js
CMD ["npm", "start"]

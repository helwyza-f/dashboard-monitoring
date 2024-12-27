# Gunakan image Node.js sebagai base image
FROM node:22.1.0

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force --legacy-peer-deps

# Salin semua file ke dalam container
COPY . .

# Build aplikasi
RUN npm run build

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]

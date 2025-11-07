# Use Node 20
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy the rest of the project
COPY . .

# Expose the port your Express server uses
EXPOSE 3001

# Set environment variable
ENV NODE_ENV=development

# Run the server directly using tsx
CMD ["npm", "run", "dev"]

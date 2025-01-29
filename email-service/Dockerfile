# Use the official Node.js image as a base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app will run on
EXPOSE 6000

# Set environment variables (you can also set these in the docker-compose file)
ENV RABBITMQ_URL=amqp://rabbitmq:5672
ENV EMAIL_ID=hishammpsn@gmail.com
ENV PASS_KEY=ghmxhowpegsdumkf

# Command to start the notification service
CMD ["npm", "start"]

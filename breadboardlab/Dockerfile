# our base image (Alpine Linux with Node.js installed)
FROM node:alpine

# where all of the project's files will go
WORKDIR '/app'

# expose the React port
EXPOSE 3000

# COPY copies files from the local file system to the container image's file system
# copy over the package.json from our local directory to the container image
COPY package.json .

# RUN executes during build only
# install all of the dependencies for our project
RUN npm install

# copy everything else
COPY . . 

# CMD runs this command every time the image is started
# start the API server and the react app
CMD ["npm", "start"]

# to start this image:
# docker run -p 3000:3000 breadboard-lab

# to see running images:
# docker ps

# to get a shell to a given image, note the ID, and:
# docker exec -it <id> sh
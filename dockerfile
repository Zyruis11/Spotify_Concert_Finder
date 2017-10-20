FROM ubuntu:latest
MAINTAINER Travis Leeden N9693921
#Copy the meteor project according to the .dockerignore file
COPY . /meteorProj

RUN apt-get update && apt-get install -y \
    curl 
#Install node.js     
RUN (curl -sL https://deb.nodesource.com/setup_4.x | bash)
RUN apt-get install -y nodejs 

#Install MeteorJS and allow the use of a root user for building the application 
RUN (curl https://install.meteor.com/ | sh)
ENV METEOR_ALLOW_SUPERUSER=true

#Build, unpack, install dependencies and remove meteorJS after building 
RUN (cd meteorProj && meteor build --architecture=os.linux.x86_64 ../bundledapp)
RUN (rm /usr/local/bin/meteor && rm -rf ~/.meteor)
RUN (cd ../bundledapp && ls && tar -zxvf meteorProj.tar.gz)
RUN (cd bundledapp/bundle/programs/server && npm install)

#Set/Expose the port 
ENV PORT=3000
EXPOSE 3000

#Run the application
CMD ["node", "bundledapp/bundle/main.js"]


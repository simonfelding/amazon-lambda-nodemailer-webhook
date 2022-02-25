FROM public.ecr.aws/lambda/nodejs:latest-x86_64
COPY server.js package.json  ${LAMBDA_TASK_ROOT}
RUN npm install
CMD [ "server.handler" ] 

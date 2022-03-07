# setup
`docker build -t protonmail-webhook .`

## invoke webhook
The server is easily modified, but currently expects json in the format of:
```
body:
	name:
	cpr:
	mail:
	text:
```
Make sure to examine the docker-compose.yml for important environment settings.
Also make sure to edit the inputSchema in server.js so it fits your purpose and modify the below curl string accordingly.

`curl -XPOST "http://webhook:8080/2015-03-31/functions/function/invocations" -d '{"body": {"name":"a","cpr":"12345678-1234","mail":"a@b.dk","text":"hello world! 123 123 123 123 123 12"}}' -H 'Content-Type: application/json'`

# optional weird self-hosted lambda server setup
use docker compose and add the container with container_name: "webhook". Add the following to nginx server block. the weird path is necessary for the AWS lambda container to work. 
```
	location /mailhook {
                proxy_pass http://webhook:8080/2015-03-31/functions/function/invocations;
                proxy_buffering off;
        }
```

# test
`curl -XPOST "https://example.com/mailhook" -d '{"body": {"name":"a","cpr":"12345678-1234","mail":"a@b.dk","text":"hello world! 123 123 123 123 123 12"}}' -H 'Content-Type: application/json'`

# Advice
Don't actually store the password in the docker-compose.yml file. It's probably a bad idea for deployment (but fine if you're just testing, env variables can be securely set in the aws lambda control panel).

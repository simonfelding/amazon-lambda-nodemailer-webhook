# setup
`docker build -t protonmail-webhook .`
add the following to nginx server block
```
	location /mailhook {
                proxy_pass http://webhook:8080/2015-03-31/functions/function/invocations;
                proxy_buffering off;
        }
```

# test
curl -XPOST "https://example.com/mailhook" -d '{"body": {"name":"a","cpr":"12345678-1234","mail":"a@b.dk","text":"hello world! 123 123 123 123 123 12"}}' -H 'Content-Type: application/json'

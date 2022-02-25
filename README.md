# setup
docker build -t protonmail-webhook .

# test
curl -XPOST "https://example.com/mailhook" -d '{"body": {"name":"a","cpr":"12345678-1234","mail":"a@b.dk","text":"hello world! 123 123 123 123 123 12"}}' -H 'Content-Type: application/json'

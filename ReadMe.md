### AI thumbnail Cron job

## Prerequisites 
1. Node installed
2. Cloudflare account
3. run the command ``npm install``
4. R2 bucket (Cloudflare)

## Important commands

Deploy build ``npm run start`` \
Read logs ``wangler tail --format=pretty``

## Env variables
The env variables are listed in `wrangler.toml`. They are listed under the `[vars]` heading. \
Some of these values should not be added in `wrangler.toml`, but in cloudflare directly. They will need to be encrypted in cloudflare. 
After deploying the instance go to your cloudflare account and go to Workers & Pages → Select your worker → Settings → Variables. Add the 
secrets manually here. You will need to encrypt them by selecting the encryption button. 
                                                                        

`accessKeyId` `Do not add it here in plain text`. Will be used for the AWS R2 storage. You will need to create an R2 api key from your cloudflare account. R2 → Manage API Tokens (top right) → Create API Token. Once you create the token you will be given an access key and secret. Add the access key in cloudflare and encrypt it. 

`secretAccessKey` `Do not add it here in plain text` As explained for the `accessKeyId`, you will get this value from cloudflare after you create an api token for your R2 instance.

`accountId` `Do not add it here in plain text`. This value will be obtained from cloudflare. Select your domain and on the right you should see API → Account id.
 
`bucketName` Bucket name of the R2 instance. Configured in Cloudflare → R2. In this page you can create an R2 instance

`aiArtUrl` The url to generate AI images.

## Cron job

Every day a new thumbnail will be generated. This worker is configured to obtained the prompts from another microservice. In this case ``https://github.com/handriamanantena/daily-art-backend``.


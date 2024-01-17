### AI thumbnail Cron job (Cloudflare Worker)

## About
This cloudflare worker can be configured as an endpoint to generate AI thumbnails, or be configured to behave as a cron job and generate an AI image on a schedule. Check the ``Cron Job`` section for more info.
The images will be stored in a cloudflare R2 instance which you will configure (``bucketName``). Check the ``Env variables`` section.

## Prerequisites 
1. Node installed
2. Cloudflare account
3. run the command ``npm install``
4. R2 bucket (Cloudflare)

## Important commands

Run dev build ``npm run start`` \
Deploy production ``npm run deploy`` \
Read logs from production ``wangler tail --format=pretty``

If your project is small enough and you are not worried about testing in production, you can simply deploy in production and then read the logs. You can even create a dev build, but you will need to create a new worker instance. Please check out this [doc](https://developers.cloudflare.com/workers/configuration/environment-variables/) for more information.

## Env variables
The env variables are listed in ``wrangler.example.toml``. Rename the file to ``wrangler.toml``. They are listed under the `[vars]` heading. \
Some of these values should not be added in `wrangler.toml`, but in cloudflare directly. They will need to be encrypted in cloudflare. 
After deploying the instance go to your cloudflare account and go to Workers & Pages → Select your worker → Settings → Variables. Add the 
secrets manually here. You will need to encrypt them by selecting the encryption button. 
                                                                        

`accessKeyId` `Do not add it here in plain text`. Will be used for the AWS R2 storage. You will need to create an R2 api key from your cloudflare account. R2 → Manage API Tokens (top right) → Create API Token. Once you create the token you will be given an access key and secret. Add the access key in cloudflare and encrypt it. 

`secretAccessKey` `Do not add it here in plain text` As explained for the `accessKeyId`, you will get this value from cloudflare after you create an api token for your R2 instance.

`accountId` `Do not add it here in plain text`. This value will be obtained from cloudflare. Select your domain and on the right you should see API → Account id.
 
`bucketName` Bucket name of the R2 instance. Configured in Cloudflare → R2. In this page you can create an R2 instance

`aiArtUrl` The url to generate AI images.

## Cron job

To enable the cron job you need to configure the ``[triggers]`` section in the ``wrangler.toml`` file. Please check out [this link](https://developers.cloudflare.com/workers/configuration/cron-triggers/) on how to configure triggers/cron jobs in cloudflare.


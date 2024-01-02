/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { AwsClient } from "aws4fetch";
import { Buffer } from 'node:buffer';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {


	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		let aiResponse : any = {};
		const { searchParams } = new URL(request.url);
		let challenge = searchParams.get('challenge');
		if(challenge == undefined) {
			return new Response({status: "challenge missing"}, {
				status: 401,
				statusText: "challenge missing"
			})
		}
		challenge = decodeURIComponent(challenge);
		try {
			let token = env.getimgKey;
			let url = env.aiArtUrl;
			let body = {
				model : "dream-shaper-v8",
				prompt: challenge,
				negative_prompt: "Disfigured, cartoon, blurry, nude, word, alphabet",
				width: 512,
				height: 512,
				steps: 30,
				guidance: 9,
				seed: 0,
				scheduler: "euler",
				output_format: "jpeg"
			};
			aiResponse = await fetch(url, {
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});
		}
		catch (e) {
			console.log("could not send image");
			console.error(e);
			return new Response(e, {
				status: 500,
				statusText: "Could not send image",
			});
		}

		const r2 = new AwsClient({
			accessKeyId: env.accessKeyId,
			secretAccessKey: env.secretAccessKey,
		});
		const json = await aiResponse.json();
		const image = Buffer.from(json.image, "base64");

		const url = new URL(
			`https://${env.accountId}.r2.cloudflarestorage.com/${env.bucketName}/${encodeURIComponent(challenge)}`
		);
		// Specify a custom expiry for the presigned URL, in seconds
		url.searchParams.set("X-Amz-Expires", "3600");

		const signed = await r2.sign(
			new Request(url, {
				method: "PUT",
			}),
			{
				aws: {
					signQuery: true,
					accessKeyId: env.accessKeyId,
					secretAccessKey: env.secretAccessKey
				},
			}
		);

		// Caller can now use this URL to upload to that object.
		let response = await fetch(signed.url, {
			method: "PUT",
			body: image,
			headers: {
				"Content-Type": "jpeg"
			}
		});

		if(response.status != 201 || response.status != 200) {
			return new Response(response.text(), {status: 500});
		}

		return new Response({status: success}, {status: 200}) ;
	},
};

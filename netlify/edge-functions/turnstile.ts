import { randomUUID } from 'node:crypto'
import type { Config, Context } from '@netlify/edge-functions'

export default async function (request: Request, context: Context) {
  const body = await request.formData()
  const formData = new FormData()

  formData.append('idempotency_key', randomUUID())
  formData.append('remoteip', context.ip)
  formData.append('secret', Netlify.env.get('SECRET_KEY') as string)
  formData.append('response', body.get('cf-turnstile-response') as string)

  const result = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      body: formData,
      method: 'POST'
    }
  )

  const outcome = await result.json()

  if (!outcome.success) {
    return Response.json(
      {
        msg: 'captcha failed'
      },
      {
        status: 400
      }
    )
  }
}

export const config: Config = {
  method: 'POST',
  path: '/*'
}

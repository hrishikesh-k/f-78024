import type { Config, Context } from '@netlify/edge-functions'

export default async function (request: Request, context: Context) {
  const body = await request.clone().formData()

  const result = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      body: JSON.stringify({
        remoteip: context.ip,
        response: body.get('cf-turnstile-response'),
        secret: Netlify.env.get('SECRET_KEY')
      }),
      headers: {
        'content-Type': 'application/json'
      },
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

  return context.next(request)
}

export const config: Config = {
  method: 'POST',
  path: '/*'
}

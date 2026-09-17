import { randomId } from '@/lib/api'
import { auth } from '@/lib/auth'
import { env } from '@/lib/env'
import { getRuntimeFeatureFlags } from '@/lib/featureFlags'
import { enforceRateLimit } from '@/lib/rate-limit'
import { POST as route } from 'next-s3-upload/route'
import { NextRequest, NextResponse } from 'next/server'

const upload = route.configure({
  key(req, filename) {
    const [, extension] = filename.match(/(\.[^\.]*)$/) ?? [null, '']
    const timestamp = new Date().toISOString()
    const random = randomId()
    return `document-${timestamp}-${random}${extension.toLowerCase()}`
  },
  endpoint: env.S3_UPLOAD_ENDPOINT,
  // forcing path style is only necessary for providers other than AWS
  forcePathStyle: !!env.S3_UPLOAD_ENDPOINT,
})

export async function POST(request: NextRequest) {
  const { enableExpenseDocuments } = await getRuntimeFeatureFlags()
  if (!enableExpenseDocuments) {
    return NextResponse.json(
      { error: 'Uploads are disabled.' },
      { status: 404 },
    )
  }
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session)
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  await enforceRateLimit(`upload:${session.user.id}`, {
    limit: 30,
    windowMs: 60 * 60 * 1000,
  })
  return upload(request)
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore
import webpush from 'npm:web-push'

const VAPID_PUBLIC  = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_MAILTO  = 'mailto:gdalmas@gmail.com'

webpush.setVapidDetails(VAPID_MAILTO, VAPID_PUBLIC, VAPID_PRIVATE)

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json()
    const comunicado = payload.record

    if (!comunicado?.publicado) return new Response('ok')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('id, subscription')

    if (!subs?.length) return new Response('ok')

    const msg = JSON.stringify({
      title: '📢 ' + (comunicado.titulo || 'Nueva novedad'),
      body: comunicado.cuerpo || 'Hay una nueva novedad en el edificio',
      url: 'https://mburucuya-app-ab053.web.app'
    })

    const results = await Promise.allSettled(
      subs.map(({ subscription }) =>
        webpush.sendNotification(subscription, msg)
      )
    )

    // Eliminar suscripciones inválidas (dispositivos dados de baja)
    const caducadas = subs
      .filter((_, i) => results[i].status === 'rejected')
      .map(s => s.id)

    if (caducadas.length) {
      await supabase.from('push_subscriptions').delete().in('id', caducadas)
    }

    return new Response('ok')
  } catch (e) {
    return new Response(String(e), { status: 500 })
  }
})

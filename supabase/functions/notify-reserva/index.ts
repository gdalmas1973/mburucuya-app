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
    const reserva = payload.record
    const anterior = payload.old_record

    if (!reserva?.estado || reserva.estado === anterior?.estado) return new Response('ok')
    if (!['confirmada', 'rechazada'].includes(reserva.estado)) return new Response('ok')
    if (!reserva.solicitante_id) return new Response('ok')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('id, subscription')
      .eq('user_id', reserva.solicitante_id)

    if (!subs?.length) return new Response('ok')

    const fecha = new Date(reserva.fecha + 'T12:00:00').toLocaleDateString('es-UY', { day: 'numeric', month: 'long' })
    const confirmada = reserva.estado === 'confirmada'

    const msg = JSON.stringify({
      title: confirmada ? '✅ Reserva confirmada' : '❌ Reserva rechazada',
      body: `Tu reserva del salón para el ${fecha} fue ${confirmada ? 'confirmada' : 'rechazada'}.`,
      url: 'https://mburucuya-app-ab053.web.app'
    })

    const results = await Promise.allSettled(
      subs.map(({ subscription }) => webpush.sendNotification(subscription, msg))
    )

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

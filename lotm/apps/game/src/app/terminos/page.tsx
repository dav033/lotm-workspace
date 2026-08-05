import Link from 'next/link'

export const metadata = { title: 'Terms of Service — LOTM Card Studio' }

export default function TermsPage() {
  return (
    <main className="mist-bg min-h-screen px-4 py-16">
      <article className="mist-card mx-auto max-w-3xl rounded-xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">LOTM Card Studio</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-parchment">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-fog">Last updated: August 4, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-parchment/85">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">The service</h2>
            <p className="mt-2">
              LOTM Card Studio is a personal tool for creating, rendering, and sending card media to
              a connected TikTok account. You may use it only for content you own or are authorized to
              process.
            </p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">Your content</h2>
            <p className="mt-2">
              You remain responsible for your uploaded images, videos, captions, and any content sent
              to TikTok. You must comply with applicable law and TikTok&apos;s terms and community rules.
            </p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">TikTok connection</h2>
            <p className="mt-2">
              Connecting TikTok authorizes the service to use the permissions you approve to send media
              through TikTok&apos;s Upload API. You can disconnect the account from the Card Studio at any time.
            </p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">Availability</h2>
            <p className="mt-2">
              The service is provided as-is for personal use. Features may change or become unavailable,
              including when TikTok changes its APIs or policies.
            </p>
          </section>
        </div>

        <Link href="/privacidad" className="mt-10 inline-block text-sm text-brass underline">
          Privacy Policy
        </Link>
      </article>
    </main>
  )
}

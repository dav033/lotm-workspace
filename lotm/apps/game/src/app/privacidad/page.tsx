import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — LOTM Card Studio' }

export default function PrivacyPage() {
  return (
    <main className="mist-bg min-h-screen px-4 py-16">
      <article className="mist-card mx-auto max-w-3xl rounded-xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">LOTM Card Studio</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-parchment">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-fog">Last updated: August 4, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-parchment/85">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">What we process</h2>
            <p className="mt-2">
              Card data and media files are processed to render and manage your Card Studio projects.
              When you connect TikTok, the service receives the TikTok account identifier and basic
              profile information returned by TikTok.
            </p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">How we use it</h2>
            <p className="mt-2">
              We use this information only to provide the Card Studio, maintain the TikTok connection,
              send media through TikTok&apos;s Upload API, and show upload status. We do not sell personal data.
            </p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">Tokens and deletion</h2>
            <p className="mt-2">
              TikTok access and refresh tokens are stored encrypted on the server. Disconnecting TikTok
              removes the stored connection from the Card Studio. You may also remove your project media
              through the editor.
            </p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-brass">Third parties</h2>
            <p className="mt-2">
              TikTok receives the media and permissions required for the action you request. TikTok&apos;s
              own privacy policy governs its handling of that information.
            </p>
          </section>
        </div>

        <Link href="/terminos" className="mt-10 inline-block text-sm text-brass underline">
          Terms of Service
        </Link>
      </article>
    </main>
  )
}

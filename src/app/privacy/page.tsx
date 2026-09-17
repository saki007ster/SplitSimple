import Link from 'next/link'

export const metadata = { title: 'Privacy policy' }

export default function PrivacyPage() {
  const supportEmail = process.env.SUPPORT_EMAIL
  return (
    <main className="prose prose-slate dark:prose-invert mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1>Privacy policy</h1>
      <p className="lead">Effective September 17, 2026</p>
      <p>
        SplitSimple is a beta expense-sharing service. This policy explains the
        information the service processes and the choices available to you.
      </p>
      <h2>Information we process</h2>
      <p>
        We store account details (name, email address, password hash, and
        sessions), group membership and permissions, participant names,
        expenses, balances, notes, activity history, invitations, and technical
        security logs such as IP address and browser information. Receipt files
        are processed only when that feature is enabled.
      </p>
      <h2>How we use information</h2>
      <p>
        We use it to provide the service, enforce access permissions, prevent
        abuse, diagnose failures, and protect accounts. We do not sell personal
        information or use expense data for advertising.
      </p>
      <h2>Sharing and processors</h2>
      <p>
        Data is available to members of each group according to their role.
        Infrastructure and monitoring providers may process limited data on our
        behalf. The current deployment uses Railway for hosting and may use
        Sentry for error monitoring when configured. Receipt extraction
        providers are used only when that optional feature is enabled.
      </p>
      <h2>Retention and deletion</h2>
      <p>
        Data remains while an account or group is active and for a limited
        period in operational backups. You can permanently delete your account
        from <Link href="/account">Account</Link>. Deleting an owner account
        also deletes groups that account owns. Other members may retain
        information they previously exported. Content you added to a group owned
        by someone else remains part of that shared group until its owner
        changes or deletes it.
      </p>
      <h2>Security and limitations</h2>
      <p>
        We use account sessions, role-based access, rate limiting, and encrypted
        network connections. No internet service is risk-free. Do not enter
        payment-card numbers, bank credentials, government identifiers, or other
        highly sensitive information.
      </p>
      <h2>Your choices</h2>
      <p>
        You may request access, correction, or deletion of your information.{' '}
        {supportEmail ? (
          <>
            Contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
          </>
        ) : (
          <>Contact the administrator who shared this beta with you.</>
        )}
      </p>
      <p>
        <Link href="/terms">Read the Terms of Service</Link>.
      </p>
    </main>
  )
}

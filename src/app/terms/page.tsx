import Link from 'next/link'

export const metadata = { title: 'Terms of service' }

export default function TermsPage() {
  const supportEmail = process.env.SUPPORT_EMAIL
  return (
    <main className="prose prose-slate dark:prose-invert mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1>Terms of service</h1>
      <p className="lead">Effective September 17, 2026</p>
      <p>
        These terms apply to your use of the SplitSimple beta. By creating an
        account or accepting an invitation, you agree to them.
      </p>
      <h2>Beta service</h2>
      <p>
        The service is provided for testing and may change, experience outages,
        or contain errors. Keep independent records for important expenses.
        SplitSimple is not a bank, payment service, accountant, or source of
        financial advice.
      </p>
      <h2>Your responsibilities</h2>
      <p>
        Provide accurate account information, protect your password and
        invitation links, grant the minimum access people need, and use the
        service only for lawful purposes. You are responsible for content you
        enter and must have permission to share it.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not attempt unauthorized access, probe or disrupt the service, evade
        limits, upload malicious content, automate abusive traffic, impersonate
        others, or use SplitSimple to facilitate fraud or illegal activity.
        Access may be limited or suspended to protect the service and its users.
      </p>
      <h2>Group ownership</h2>
      <p>
        Owners control invitations and group access. Editors can change group
        and expense data. Viewers have read-only access. Deleting an owner
        account permanently deletes the groups it owns and their associated
        data.
      </p>
      <h2>No warranty and limitation</h2>
      <p>
        To the extent permitted by law, the service is provided “as is” without
        warranties. SplitSimple is not liable for decisions, payments, disputes,
        lost records, or indirect damages arising from use of this beta.
      </p>
      <h2>Changes and contact</h2>
      <p>
        We may update these terms as the beta evolves. Material changes will be
        reflected by a new effective date.{' '}
        {supportEmail ? (
          <>
            Questions may be sent to{' '}
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
          </>
        ) : (
          <>Contact the administrator who shared this beta with you.</>
        )}
      </p>
      <p>
        <Link href="/privacy">Read the Privacy Policy</Link>.
      </p>
    </main>
  )
}

import { motion } from 'framer-motion';
import access from '../content/appAccess.json';

const cardClassName =
  'rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 md:p-10 shadow-xl text-slate-700 dark:text-slate-300 leading-relaxed space-y-6';

const AppAccess = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            App Access for <span className="text-[#9c27b0]">Reviewers</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated {access.lastUpdated}
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${cardClassName} mb-8`}
        >
          {access.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reviewer login credentials</h2>
            <dl className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-700">
                <dt className="font-semibold text-slate-500 dark:text-slate-400">Username</dt>
                <dd className="mt-1 font-mono text-slate-900 dark:text-white break-all">{access.credentials.username}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-700">
                <dt className="font-semibold text-slate-500 dark:text-slate-400">Password</dt>
                <dd className="mt-1 font-mono text-slate-900 dark:text-white break-all">{access.credentials.password}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-700">
                <dt className="font-semibold text-slate-500 dark:text-slate-400">Company code</dt>
                <dd className="mt-1 font-mono text-slate-900 dark:text-white">{access.credentials.companyCode}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-700">
                <dt className="font-semibold text-slate-500 dark:text-slate-400">Company name</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{access.credentials.companyName}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Server connection (Android)</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Host: {access.server.host}</li>
              <li>Port: {access.server.port}</li>
              <li>Protocol: {access.server.protocol}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Android sign-in steps</h2>
            <ol className="list-decimal pl-6 space-y-2 mt-3">
              {access.androidSteps.map((step) => (
                <li key={step.slice(0, 48)}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Web sign-in steps</h2>
            <ol className="list-decimal pl-6 space-y-2 mt-3">
              {access.webSteps.map((step) => (
                <li key={step.slice(0, 48)}>{step}</li>
              ))}
            </ol>
          </section>

          <p>
            If you cannot sign in, contact{' '}
            <a href={`mailto:${access.supportEmail}`}>{access.supportEmail}</a> or{' '}
            <a href={`mailto:${access.contactEmail}`}>{access.contactEmail}</a>.
          </p>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${cardClassName} border-[#1976d2]/30`}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Google Play Console declaration</h2>
          <p>Copy the following into Play Console &gt; App content &gt; App access:</p>
          <pre className="text-xs sm:text-sm whitespace-pre-wrap rounded-xl bg-slate-900 text-slate-100 p-4 overflow-x-auto">
            {access.playConsoleInstructions.join('\n')}
          </pre>
        </motion.aside>
      </div>
    </div>
  );
};

export default AppAccess;

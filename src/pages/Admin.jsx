import { useEffect, useMemo, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import Seo from '../components/ui/Seo'
import { firebaseApp } from '../lib/firebase'

// Initialized here (not in the shared firebase module) so the auth SDK and its
// iframe handshake load only inside the CRM chunk, keeping public pages fast.
const auth = getAuth(firebaseApp)
import AdminSelect from '../components/admin/AdminSelect'
import {
  deleteLead,
  leadStatuses,
  leadTypes,
  subscribeLeads,
  updateLeadStatus,
} from '../lib/leads'
import DessertsManager from '../components/admin/DessertsManager'
import MasterclassesManager from '../components/admin/MasterclassesManager'
import AdminTools from '../components/admin/AdminTools'
import ConfirmDialog from '../components/admin/ConfirmDialog'

const statusLabel = (status) =>
  leadStatuses.find((item) => item.id === status)?.label || 'Нова'
const crmSections = ['leads', 'desserts', 'masterclasses', 'admin']
const getInitialSection = () => {
  if (typeof window === 'undefined') return 'leads'

  const section = new URLSearchParams(window.location.search).get('section')
  return crmSections.includes(section) ? section : 'leads'
}

const formatDate = (value) => {
  const date = value?.toDate?.()
  if (!date) return 'без дати'
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const text = (value) => String(value || '').toLowerCase()
const reloadCrm = () => {
  window.setTimeout(() => window.location.reload(), 250)
}

export default function Admin() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [leads, setLeads] = useState([])
  const [leadsError, setLeadsError] = useState('')
  const [section, setSection] = useState(getInitialSection)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [leadDeletePrompt, setLeadDeletePrompt] = useState(null)
  const [deletingLead, setDeletingLead] = useState(false)
  const [sitePromptOpen, setSitePromptOpen] = useState(false)
  const [logoutPromptOpen, setLogoutPromptOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthReady(true)
    })
  }, [])

  useEffect(() => {
    if (!user) {
      setLeads([])
      return undefined
    }

    setLeadsError('')
    return subscribeLeads(setLeads, (err) => {
      console.error(err)
      setLeadsError('Не вдалося завантажити заявки. Перевірте Firestore rules')
    })
  }, [user])

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchStatus = filter === 'all' || (lead.status || 'new') === filter
      const haystack = [
        lead.name,
        lead.phone,
        lead.product,
        lead.classTitle,
        lead.note,
      ]
        .map(text)
        .join(' ')
      return matchStatus && (!q || haystack.includes(q))
    })
  }, [leads, filter, query])

  const totals = useMemo(() => {
    return leadStatuses.reduce(
      (acc, status) => ({
        ...acc,
        [status.id]: leads.filter((lead) => (lead.status || 'new') === status.id).length,
      }),
      { all: leads.length },
    )
  }, [leads])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setPassword('')
    } catch (err) {
      console.error(err)
      setLoginError('Не вдалося увійти. Перевірте email, пароль і Firebase Auth')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)

    try {
      await signOut(auth)
      setLogoutPromptOpen(false)
    } finally {
      setLogoutLoading(false)
    }
  }

  const handleOpenSite = () => {
    window.location.assign('/')
  }

  const changeSection = (nextSection) => {
    setSection(nextSection)

    const url = new URL(window.location.href)
    if (nextSection === 'leads') {
      url.searchParams.delete('section')
    } else {
      url.searchParams.set('section', nextSection)
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const requestLeadDelete = (lead) => {
    const serviceName = leadTypes[lead.type] || 'Заявка'
    const clientName = lead.name || 'Без імені'

    setLeadDeletePrompt({
      lead,
      title: 'Видалити заявку?',
      description: `Заявка “${serviceName}” від “${clientName}” буде повністю видалена з CRM`,
      confirmLabel: 'Видалити',
    })
  }

  const confirmLeadDelete = async () => {
    if (!leadDeletePrompt?.lead?.id) return

    const leadId = leadDeletePrompt.lead.id
    setLeadDeletePrompt(null)
    setDeletingLead(true)
    setLeadsError('')

    try {
      await deleteLead(leadId)
      reloadCrm()
    } catch (err) {
      console.error(err)
      setLeadsError('Не вдалося видалити заявку. Перевірте права Firestore')
    } finally {
      setDeletingLead(false)
    }
  }

  if (!authReady) {
    return (
      <div className="min-h-dvh grid place-items-center bg-ink text-cream">
        <p className="font-display text-3xl italic text-blood-400">VelvetCake CRM</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-dvh bg-ink px-5 py-10 text-cream">
        <Seo title="CRM" description="Вхід у CRM VelvetCake" path="/admin" />
        <section className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-md items-center">
          <div className="w-full rounded-2xl border border-blood-400/15 bg-ink-800 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blood-400">
              VelvetCake
            </p>
            <h1 className="mt-4 font-display text-4xl text-cream">Вхід у CRM</h1>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Увійдіть через email і пароль адміна
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label htmlFor="crm-email" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">
                  Email
                </label>
                <input
                  id="crm-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@velvetcake.ua"
                  required
                  autoComplete="email"
                  className="w-full rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30"
                />
              </div>
              <div>
                <label htmlFor="crm-password" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">
                  Пароль
                </label>
                <input
                  id="crm-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ваш пароль"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30"
                />
              </div>

              {loginError && (
                <p className="rounded-md border border-blood-400/40 bg-blood/10 px-4 py-3 text-sm text-blood-400">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="focus-ring w-full rounded-full bg-blood px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-blood-400 disabled:pointer-events-none disabled:opacity-60"
              >
                {loginLoading ? 'Входимо…' : 'Увійти'}
              </button>
            </form>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-ink px-4 py-6 text-cream sm:px-6 lg:px-8">
      <Seo title="CRM" description="CRM VelvetCake" path="/admin" />
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-cream/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blood-400">
              VelvetCake CRM
            </p>
            <h1 className="mt-3 font-display text-4xl text-cream md:text-5xl">
              {section === 'leads'
                ? 'Заявки клієнтів'
                : section === 'desserts'
                  ? 'Редагування меню'
                  : section === 'masterclasses'
                    ? 'Майстер-класи'
                    : 'Для розробника'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">
              {section === 'leads'
                ? 'Тут збираються форми замовлення десертів і бронювання майстер-класів'
                : section === 'desserts'
                  ? 'Тут можна міняти товари, ціни, описи, фото та видимість у каталозі'
                  : section === 'masterclasses'
                    ? 'Тут можна редагувати теми оформлення — назви, тривалість, місця, ціни та видимість'
                    : 'Системні дії для демо, портфоліо і повернення контенту до базового стану'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSitePromptOpen(true)}
              className="focus-ring rounded-full border border-cream/20 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:border-blood-400 hover:text-blood-400"
            >
              На сайт
            </button>
            <button
              type="button"
              onClick={() => setLogoutPromptOpen(true)}
              className="focus-ring rounded-full bg-cream px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-blood-400 hover:text-cream"
            >
              Вийти
            </button>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label="CRM розділи">
          {[
            { id: 'leads', label: 'Заявки' },
            { id: 'desserts', label: 'Меню' },
            { id: 'masterclasses', label: 'Майстер-класи' },
            { id: 'admin', label: 'Для розробника' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeSection(item.id)}
              className={`rounded-full border px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                item.id === 'admin' ? 'sm:ml-auto' : ''
              } ${
                section === item.id
                  ? 'border-blood bg-blood text-cream'
                  : 'border-cream/20 text-mute hover:border-blood-400 hover:text-blood-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {section === 'leads' ? (
          <>
            <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
              {[{ id: 'all', label: 'Усі' }, ...leadStatuses].map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setFilter(status.id)}
                  className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                    filter === status.id
                      ? 'border-blood-400 bg-blood/15'
                      : 'border-wine-700/55 bg-ink-800 hover:border-blood-400/50'
                  }`}
                >
                  <span className="block text-2xl font-semibold text-cream">
                    {totals[status.id] || 0}
                  </span>
                  <span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-mute">
                    {status.label}
                  </span>
                </button>
              ))}
            </section>

            <section className="mt-6 rounded-2xl border border-blood-400/15 bg-ink-800 p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Пошук за імʼям, телефоном, товаром…"
                  className="w-full rounded-full border border-wine-700/70 bg-ink px-4 py-3 text-sm text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30 md:max-w-md"
                />
                <p className="text-sm text-mute">
                  Показано {filteredLeads.length} із {leads.length}
                </p>
              </div>

              {leadsError && (
                <p className="mt-4 rounded-md border border-blood-400/40 bg-blood/10 px-4 py-3 text-sm text-blood-400">
                  {leadsError}
                </p>
              )}

              <div className="mt-5 overflow-hidden rounded-xl border border-cream/10">
                {filteredLeads.length === 0 ? (
                  <div className="grid min-h-60 place-items-center bg-ink px-5 py-16 text-center">
                    <div>
                      <p className="font-display text-3xl italic text-cream">Заявок ще немає</p>
                      <p className="mt-3 text-sm text-mute">
                        Нові заявки з форм сайту зʼявляться тут автоматично
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-cream/10">
                    {filteredLeads.map((lead) => (
                      <article
                        key={lead.id}
                        className="grid gap-4 bg-ink px-4 py-5 transition-colors hover:bg-ink-800/80 lg:grid-cols-[1.1fr_1fr_0.8fr_auto]"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blood/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blood-400">
                              {leadTypes[lead.type] || 'Заявка'}
                            </span>
                            <span className="text-xs text-mute">{formatDate(lead.createdAt)}</span>
                          </div>
                          <h2 className="mt-3 font-display text-2xl text-cream">
                            {lead.name || 'Без імені'}
                          </h2>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone.replace(/\s/g, '')}`}
                              className="mt-1 inline-block text-sm text-blood-400 hover:underline"
                            >
                              {lead.phone}
                            </a>
                          )}
                        </div>

                        <div className="text-sm leading-relaxed text-mute">
                          {lead.product && (
                            <p>
                              <span className="text-cream/80">Десерт:</span> {lead.product}
                            </p>
                          )}
                          {lead.classTitle && (
                            <p>
                              <span className="text-cream/80">Майстер-клас:</span> {lead.classTitle}
                            </p>
                          )}
                          {lead.seats && (
                            <p>
                              <span className="text-cream/80">Місць:</span> {lead.seats}
                            </p>
                          )}
                          {lead.preferredDate && (
                            <p>
                              <span className="text-cream/80">Дата:</span> {lead.preferredDate}
                            </p>
                          )}
                        </div>

                        <p className="text-sm leading-relaxed text-mute">
                          {lead.note || 'Без коментаря'}
                        </p>

                        <div className="flex flex-col items-start gap-2 lg:items-end">
                          <AdminSelect
                            value={lead.status || 'new'}
                            options={leadStatuses}
                            align="right"
                            className="w-44"
                            ariaLabel={`Статус: ${statusLabel(lead.status)}`}
                            onChange={async (nextStatus) => {
                              try {
                                await updateLeadStatus(lead.id, nextStatus)
                              } catch (err) {
                                console.error(err)
                                setLeadsError('Не вдалося змінити статус. Перевірте права Firestore')
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => requestLeadDelete(lead)}
                            disabled={deletingLead}
                            className="focus-ring w-44 rounded-full border border-blood-400/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:bg-blood hover:text-cream disabled:pointer-events-none disabled:opacity-60"
                          >
                            Видалити
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        ) : section === 'desserts' ? (
          <DessertsManager />
        ) : section === 'masterclasses' ? (
          <MasterclassesManager />
        ) : (
          <AdminTools />
        )}
      </div>

      <ConfirmDialog
        open={sitePromptOpen}
        title="Перейти на сайт?"
        description="Ви вийдете з робочої панелі CRM, але акаунт залишиться активним"
        confirmLabel="Перейти"
        onCancel={() => setSitePromptOpen(false)}
        onConfirm={handleOpenSite}
      />

      <ConfirmDialog
        open={Boolean(leadDeletePrompt)}
        title={leadDeletePrompt?.title}
        description={leadDeletePrompt?.description}
        confirmLabel={leadDeletePrompt?.confirmLabel}
        loading={deletingLead}
        onCancel={() => setLeadDeletePrompt(null)}
        onConfirm={confirmLeadDelete}
      />

      <ConfirmDialog
        open={logoutPromptOpen}
        title="Вийти з CRM?"
        description="Після виходу потрібно буде знову увійти через email і пароль"
        confirmLabel="Вийти"
        loading={logoutLoading}
        onCancel={() => setLogoutPromptOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  )
}

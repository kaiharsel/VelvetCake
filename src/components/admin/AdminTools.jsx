import { useState } from 'react'
import { resyncDessertsFromCode } from '../../lib/cms'
import { resyncMasterclassesFromCode } from '../../lib/masterclassesCms'
import { resyncDemoLeads } from '../../lib/leads'
import ConfirmDialog from './ConfirmDialog'

const setSectionBeforeReload = (section) => {
  if (!section) return

  const url = new URL(window.location.href)
  if (section === 'leads') {
    url.searchParams.delete('section')
  } else {
    url.searchParams.set('section', section)
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

const reloadCrm = () => {
  window.location.reload()
}

export default function AdminTools() {
  const [syncingAll, setSyncingAll] = useState(false)
  const [syncingLeads, setSyncingLeads] = useState(false)
  const [syncingDesserts, setSyncingDesserts] = useState(false)
  const [syncingMc, setSyncingMc] = useState(false)
  const [error, setError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)

  const runAction = ({ title, message, confirmLabel, action, setLoading, redirectSection }) => {
    setPendingAction({
      title,
      message,
      confirmLabel,
      action,
      setLoading,
      redirectSection,
    })
  }

  const confirmAction = async () => {
    if (!pendingAction) return

    const nextAction = pendingAction
    setPendingAction(null)

    nextAction.setLoading(true)
    setError('')

    try {
      await nextAction.action()
      setSectionBeforeReload(nextAction.redirectSection)
      reloadCrm()
    } catch (err) {
      console.error(err)
      setError('Не вдалося виконати дію. Перевірте Firebase rules і права доступу')
    } finally {
      nextAction.setLoading(false)
    }
  }

  const resetEverything = async () => {
    await resyncDessertsFromCode()
    await resyncMasterclassesFromCode()
    await resyncDemoLeads()
  }

  return (
    <>
      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="rounded-2xl border border-cream/10 bg-ink-800 p-5 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blood-400">
          Системні дії
        </p>
        <h2 className="mt-3 font-display text-4xl text-cream">Повернення демо-стану</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-mute">
          Ця вкладка потрібна для демо-показу. Тут можна швидко повернути сайт
          до початкового вигляду після тестів клієнта або презентації
        </p>

        {error && (
          <p
            className="mt-6 rounded-md border border-blood-400/40 bg-blood/10 px-4 py-3 text-sm text-blood-400"
          >
            {error}
          </p>
        )}

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <ToolCard
            title="Весь демо-стан"
            text="Повертає до початкового вигляду і товари, і заявки. Найшвидший варіант перед новою презентацією"
            buttonLabel={syncingAll ? 'Відкатуємо…' : 'Відкотити все'}
            disabled={syncingAll || syncingDesserts || syncingLeads || syncingMc}
            featured
            onClick={() =>
              runAction({
                title: 'Відкотити все?',
                message:
                  'Усі зміни в товарах, завантажені фото і поточні заявки будуть видалені. Сайт і CRM повернуться до початкового демо-стану. Продовжити?',
                confirmLabel: 'Відкотити все',
                action: resetEverything,
                setLoading: setSyncingAll,
              })
            }
          />
          <ToolCard
            title="Товари меню"
            text="Повертає товари до початкового вигляду. Ціни, описи, фото, порядок і видимість стануть такими, як у базовій демо-версії"
            buttonLabel={syncingDesserts ? 'Відкатуємо…' : 'Відкотити товари'}
            disabled={syncingDesserts}
            onClick={() =>
              runAction({
                title: 'Відкотити товари?',
                message:
                  'Усі зміни в товарах і завантажені фото будуть видалені. Меню повернеться до початкової демо-версії. Продовжити?',
                confirmLabel: 'Відкотити',
                action: resyncDessertsFromCode,
                setLoading: setSyncingDesserts,
                redirectSection: 'desserts',
              })
            }
          />
          <ToolCard
            title="Майстер-класи"
            text="Повертає теми оформлення майстер-класів до початкового списку з коду. Назви, ціни, тривалість, порядок і видимість стануть базовими"
            buttonLabel={syncingMc ? 'Відкатуємо…' : 'Відкотити теми'}
            disabled={syncingMc}
            onClick={() =>
              runAction({
                title: 'Скинути майстер-класи?',
                message:
                  'Усі зміни в майстер-класах будуть замінені початковим списком із коду. Продовжити?',
                confirmLabel: 'Відкотити',
                action: resyncMasterclassesFromCode,
                setLoading: setSyncingMc,
                redirectSection: 'masterclasses',
              })
            }
          />
          <ToolCard
            title="Демо-заявки"
            text="Очищає поточні заявки і повертає тестові заявки для красивого показу CRM"
            buttonLabel={syncingLeads ? 'Оновлюємо…' : 'Відкотити заявки'}
            disabled={syncingLeads}
            onClick={() =>
              runAction({
                title: 'Відкотити заявки?',
                message:
                  'Поточні заявки будуть видалені, а CRM отримає тестові заявки для демо-показу. Продовжити?',
                confirmLabel: 'Відкотити',
                action: resyncDemoLeads,
                setLoading: setSyncingLeads,
                redirectSection: 'leads',
              })
            }
          />
        </div>
      </div>

      <aside className="rounded-2xl border border-cream/10 bg-ink-800 p-5">
        <h3 className="font-display text-3xl text-cream">Що важливо</h3>
        <ul className="mt-5 space-y-4 text-sm leading-relaxed text-mute">
          <li>
            <span className="text-cream">Відкотити все</span> повертає одразу
            товари і заявки до початкового стану
          </li>
          <li>
            <span className="text-cream">Відкат товарів</span> повертає меню до
            початкового вигляду і прибирає фото, які завантажили під час тестів
          </li>
          <li>
            <span className="text-cream">Відкат заявок</span> потрібен, щоб
            швидко підготувати CRM до нової демонстрації
          </li>
          <li>
            Ці дії не для щоденної роботи. Вони потрібні саме для портфоліо,
            тестів і повернення чистого демо-стану
          </li>
        </ul>
      </aside>
      </section>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.title}
        description={pendingAction?.message}
        confirmLabel={pendingAction?.confirmLabel}
        loading={syncingAll || syncingLeads || syncingDesserts || syncingMc}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmAction}
      />
    </>
  )
}

function ToolCard({ title, text, buttonLabel, disabled, featured = false, onClick }) {
  return (
    <article
      className={`rounded-xl border bg-ink p-5 ${
        featured
          ? 'border-blood-400/35 md:col-span-2'
          : 'border-cream/10'
      }`}
    >
      <h3 className="font-display text-2xl text-cream">{title}</h3>
      <p className="mt-3 min-h-20 text-sm leading-relaxed text-mute">{text}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="focus-ring mt-5 rounded-full border border-blood-400/50 bg-blood/10 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:bg-blood hover:text-cream disabled:pointer-events-none disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </article>
  )
}

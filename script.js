const g = e => document.getElementById(e)
const q = e => document.querySelectorAll(e)

function acc () {
  q('.accordion-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling
      const icon = button.querySelector('svg, i')
      const isExpanded = content.style.maxHeight

      q('.accordion-content').forEach(el => {
        el.style.maxHeight = null
      })
      q('.accordion-toggle svg, .accordion-toggle i').forEach(el => {
        el.style.transform = 'rotate(0deg)'
      })

      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px'
        icon.style.transform = 'rotate(180deg)'
      }
    })
  })
}

function getSignups () {
  fetch('https://haven.hackclub.com/api/signups')
    .then(e => e.json())
    .then(e => {
      e.events.forEach(d => {
        const x = g(d.slug + '-signup')
        if (x) {
          x.innerText =
            d.signups + '/' + Math.floor((d.signups - 1) / 100 + 1) + '00'
          if (
            (d.signups % 100 > 90 || d.signups % 100 === 0) &&
            d.signups !== 0
          ) {
            x.parentElement.style.color = '#ff3939' // make red when abt to fill
          }
        }
      })
    })
}

function create (tag, className, innerHTML = '', props = {}) {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (innerHTML) el.innerHTML = innerHTML
  if (props) {
    el.href = props.href
    el.target = props.target
  }
  return el
}

function saturate (events) {
  const container = q('.grid')[0]
  container.innerHTML = ''
  events.forEach(event => {
    const card = create('div', 'card')
    card.appendChild(
      create('h2', 'text-2xl font-bold text-white mb-3', event.name)
    )
    const infoContainer = create(
      'div',
      'flex flex-col gap-0 mb-4 text-sm font-medium'
    )
    infoContainer.appendChild(
      create(
        'a',
        'flex items-center gap-2.5 text-gray-300 dont',
        `<i class="ph ph-users flex items-center justify-center w-5"></i> 
       <span class="leading-none" id="${event.slug}-signup">0/100</span>`,
        {
          href: 'https://daven.haven.hackclub.com/' + event.slug,
          target: '_blank'
        }
      )
    )
    infoContainer.appendChild(
      create(
        event.venueUrl ? 'a' : 'div',
        'flex items-center gap-2.5 text-gray-300 dont',
        `<i class="ph ph-map-pin flex items-center justify-center w-5"></i> 
       <span class="leading-none">${event.venue || 'Unconfirmed'}</span>`,
        event.venueUrl
          ? {
              href: 'https://' + event.venueUrl,
              target: '_blank'
            }
          : null
      )
    )
    card.appendChild(infoContainer)
    const signUpBtn = create('a', 'btn-primary', 'Sign Up Now')
    signUpBtn.href = `https://forms.hackclub.com/haven-signup?event=${event.id}`
    signUpBtn.target = '_blank'
    card.appendChild(signUpBtn)
    card.appendChild(
      create(
        'button',
        'accordion-toggle accordion-btn',
        `<span class="font-semibold text-sm leading-none">Show More</span>
       <i class="fa-solid fa-angle-down text-lg flex items-center justify-center leading-none transition-transform duration-300"></i>`
      )
    )
    const accContent = create(
      'div',
      'accordion-content overflow-hidden max-h-0 transition-all duration-300'
    )
    const linksGrid = create(
      'div',
      'pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2'
    )
    const addLink = (href, icon, text) => {
      if (!href) return
      const link = create(
        'a',
        'btn-social',
        `<i class="${icon}"></i><span>${text}</span>`
      )
      link.href = href
      linksGrid.appendChild(link)
    }
    addLink(`https://haven.hackclub.com/${event.slug}`, 'ph ph-globe', 'Page')
    if (event.insta)
      addLink(
        `https://instagram.com/${event.insta}`,
        'ph ph-instagram-logo',
        'Instagram'
      )
    if (event.slack) {
      const slackUrl = `https://hackclub.enterprise.slack.com/archives/${event.slack}`
      const link = create(
        'a',
        'btn-social cursor-pointer',
        `<i class="ph ph-slack-logo"></i><span>Slack</span>`
      )
      link.addEventListener('click', e => {
        e.preventDefault()
        openSlock(`haven-${event.slug}`, slackUrl)
      })
      linksGrid.appendChild(link)
    }
    addLink(
      `mailto:${event.slug}@haven.hackclub.com`,
      'ph ph-envelope-simple',
      'Email'
    )
    if (event.wa)
      addLink(`https://wa.me/${event.wa}`, 'ph ph-whatsapp-logo', 'WhatsApp')
    if (event.custom) {
      for (const [key, value] of Object.entries(event.custom)) {
        addLink(
          value,
          'ph ph-' + (key == 'Organize' ? 'clipboard' : 'info'),
          key
        )
      }
    }
    accContent.appendChild(linksGrid)
    card.appendChild(accContent)
    container.appendChild(card)
  })
  acc()
  getSignups()
}

fetch('/events.txt')
  .then(e => e.text())
  .then(e => {
    const eventsText = e.split('#')[1].trim().split(';')
    let out = []
    eventsText.forEach(d => {
      if (!d.trim()) return
      let j = {}
      const s = d.replaceAll('\n', '').split(',')
      j.slug = s[0].trim()
      j.name = j.slug.charAt(0).toUpperCase() + j.slug.slice(1)
      j.venue = s[1]?.trim()
      j.venueUrl = s[2]?.trim()
      j.id = s[3]?.trim()
      j.insta = s[4]?.trim()
      j.slack = s[5]?.trim()
      j.wa = s[6]?.trim()
      j.custom = {}

      for (let i = 7; i < s.length; i++) {
        if (!s[i].trim()) continue
        const k = s[i].split('=')
        if (k.length === 2) j.custom[k[0].trim()] = k[1].trim()
      }
      out.push(j)
    })
    saturate(out)
  })

const start = new Date('2026-11-14T10:00:00+05:00')

let tmt = 2682060
let tls = tmt * 1000

const timer = () => {
  const now = new Date()
  const tml = start - now
  const t = 0.1
  tls = (1 - t) * tls + t * tml
  if (tls <= 0) {
    clearInterval(timer)
    g('clock').textContent = "It's started chat"
    return
  }
  const days = Math.floor(tls / (1000 * 60 * 60 * 24))
  const hours = Math.floor((tls % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((tls % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((tls % (1000 * 60)) / 1000)
  const pad = num => String(num).padStart(2, '0')

  g('clock').textContent = `
    ${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}
  `
  requestAnimationFrame(timer)
}
timer()

function openSlock (slug, channel) {
  g('mod-h').innerText = 'Open #' + slug
  g('si-btn').href = channel
  g('s-modal').classList.remove('opacity-0', 'pointer-events-none')
}

const close = () =>
  g('s-modal').classList.add('opacity-0', 'pointer-events-none')

g('close-mod')?.addEventListener('click', close)
g('s-modal')?.addEventListener('click', e => {
  if (e.target.id === 's-modal') close()
})

setInterval(() => {
  fetch('https://live.alimad.co/ping?app=havens-pk')
    .then(e => e.text())
    .then(d => (g('spec').textContent = d))
}, 20000)

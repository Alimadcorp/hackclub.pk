function acc () {
  document.querySelectorAll('.accordion-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling
      const icon = button.querySelector('svg, i')
      const isExpanded = content.style.maxHeight

      document.querySelectorAll('.accordion-content').forEach(el => {
        el.style.maxHeight = null
      })
      document
        .querySelectorAll('.accordion-toggle svg, .accordion-toggle i')
        .forEach(el => {
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
        const x = document.getElementById(d.slug + '-signup')
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

function createEl (tag, className, innerHTML = '') {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (innerHTML) el.innerHTML = innerHTML
  return el
}

function saturate (events) {
  const container = document.querySelector('.grid')
  container.innerHTML = ''
  events.forEach(event => {
    const card = createEl('div', 'card')
    card.appendChild(
      createEl('h2', 'text-2xl font-bold text-white mb-3', event.name)
    )
    const infoContainer = createEl(
      'div',
      'flex flex-col gap-0 mb-4 text-sm font-medium'
    )
    infoContainer.appendChild(
      createEl(
        'div',
        'flex items-center gap-2.5 text-gray-300',
        `<i class="ph ph-users flex items-center justify-center w-5"></i> 
       <span class="leading-none" id="${event.slug}-signup">0/100</span>`
      )
    )
    infoContainer.appendChild(
      createEl(
        'div',
        'flex items-center gap-2.5 text-gray-300',
        `<i class="ph ph-map-pin flex items-center justify-center w-5"></i> 
       <span class="leading-none">${event.venue || 'Unconfirmed'}</span>`
      )
    )
    card.appendChild(infoContainer)
    const signUpBtn = createEl('a', 'btn-primary', 'Sign Up Now')
    signUpBtn.href = `https://forms.hackclub.com/haven-signup?event=${event.id}`
    signUpBtn.target = '_blank'
    card.appendChild(signUpBtn)
    card.appendChild(
      createEl(
        'button',
        'accordion-toggle accordion-btn',
        `<span class="font-semibold text-sm leading-none">Show More</span>
       <i class="fa-solid fa-angle-down text-lg flex items-center justify-center leading-none transition-transform duration-300"></i>`
      )
    )
    const accContent = createEl(
      'div',
      'accordion-content overflow-hidden max-h-0 transition-all duration-300'
    )
    const linksGrid = createEl(
      'div',
      'pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2'
    )
    const addLink = (href, icon, text) => {
      if (!href) return
      const link = createEl(
        'a',
        'btn-social',
        `<i class="${icon}"></i><span>${text}</span>`
      )
      link.href = href
      linksGrid.appendChild(link)
    }
    addLink(
      `https://haven.hackclub.com/${event.slug}`,
      'ph ph-globe',
      'Page'
    )
    if (event.insta)
      addLink(
        `https://instagram.com/${event.insta}`,
        'ph ph-instagram-logo',
        'Instagram'
      )
    if (event.slack)
      addLink(
        `https://hackclub.enterprise.slack.com/archives/${event.slack}`,
        'ph ph-slack-logo',
        'Slack'
      )
    addLink(
      `mailto:${event.slug}@haven.hackclub.com`,
      'ph ph-envelope-simple',
      'Email'
    )
    if (event.wa)
      addLink(`https://wa.me/${event.wa}`, 'ph ph-whatsapp-logo', 'WhatsApp')
    if (event.custom) {
      for (const [key, value] of Object.entries(event.custom)) {
        addLink(value, 'ph ph-' + (key == "Organize" ? 'clipboard' : 'info'), key)
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
      j.id = s[2]?.trim()
      j.insta = s[3]?.trim()
      j.slack = s[4]?.trim()
      j.wa = s[5]?.trim()
      j.custom = {}

      for (let i = 6; i < s.length; i++) {
        if (!s[i].trim()) continue
        const k = s[i].split('=')
        if (k.length === 2) j.custom[k[0].trim()] = k[1].trim()
      }
      out.push(j)
    })
    console.log(out)
    saturate(out)
  })

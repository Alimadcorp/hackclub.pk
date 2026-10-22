document.querySelectorAll('.accordion-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling
    const icon = button.querySelector('svg')
    const isExpanded = content.style.maxHeight
    document.querySelectorAll('.accordion-content').forEach(el => {
      el.style.maxHeight = null
    })
    document.querySelectorAll('.accordion-toggle svg').forEach(el => {
      el.style.transform = 'rotate(0deg)'
    })
    if (!isExpanded) {
      content.style.maxHeight = content.scrollHeight + 'px'
      icon.style.transform = 'rotate(180deg)'
    }
  })
})

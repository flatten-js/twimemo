(async () => {
  const $content = document.createElement('div')
  $content.innerHTML = `
    <div id="memo-content" class="css-1dbjc4n r-x572qd r-1d6w8o1 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x">
      <div class="r-ymttw5 r-1f1sjgu">
        <input type="text" id="calendar" />
        <div>
          <div id="date"></div>
          <textarea id="memo" rows="8"></textarea>
        </div>
      </div>
    </div>
  `

  await new Promise(resolve => {
    setTimeout(function run() {
      if (document.getElementById('memo-content')) return resolve()
      
      let $target = document.querySelector('div.css-1dbjc4n.r-x572qd.r-1d6w8o1.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x')
      if (!$target) return setTimeout(run, 250)

      $target.before($content)
      resolve()
    }, 0)
  })

  const twimemo = JSON.parse(localStorage.getItem('twimemo') || '{}')
  let current_date;

  const $memo = document.getElementById('memo')
  $memo.addEventListener('blur', () => {
    twimemo[current_date] = $memo.value
    localStorage.setItem('twimemo', JSON.stringify(twimemo))
  })

  const update = date => {
    current_date = date
    $memo.value = twimemo[current_date] || ''
  }

  const fp = flatpickr('#calendar', { onChange: (_, date) => update(date) })
  fp.setDate(new Date(), true)
})()

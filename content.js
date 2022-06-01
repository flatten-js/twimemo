window.twimemo = {
  running: false,
  current_date: null,
  async init() {
    if (this.running) return
    if (document.getElementById('twimemo')) return

    this.running = true
    try {
      await new Promise((resolve, reject) => {
        let retry = 8
        setTimeout(function run() {
          const $target = document.querySelector('div.css-1dbjc4n.r-x572qd.r-1d6w8o1.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x')
          if ($target) {
            $target.insertAdjacentHTML('beforebegin', `
              <div id="twimemo" class="css-1dbjc4n r-x572qd r-1d6w8o1 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x">
                <div class="r-ymttw5 r-1f1sjgu">
                  <input type="text" id="calendar" />
                  <div>
                    <div id="date"></div>
                    <div id="editorjs"></div>
                  </div>
                </div>
              </div>
            `)
            resolve()
          } else {
            if (!--retry) return reject()
            setTimeout(run, 250)
          }
        }, 0)
      })

      const data = JSON.parse(localStorage.getItem('twimemo') || '{}')

      const editor = new EditorJS({
        tools: {
          checklist: {
            class: Checklist,
            inlineToolbar: true
          },
          list: {
            class: NestedList,
            inlineToolbar: true
          },
          table: {
            class: Table,
            inlineToolbar: true
          }
        },
        onChange: async () => {
          data[this.current_date] = await editor.save()
          localStorage.setItem('twimemo', JSON.stringify(data))
        },
        minHeight: 0
      })

      await editor.isReady
      new DragDrop(editor)

      const fp = flatpickr('#calendar', {
        onChange: (_, date) => {
          this.current_date = date
          const body = data[this.current_date]
          if (body?.blocks.length) editor.render(body)
          else editor.clear()
        }
      })

      fp.setDate(new Date(), true)
    } finally {
      this.running = false
    }
  }
}

window.twimemo = {
  running: false,
  data: JSON.parse(localStorage.getItem('twimemo') || '{}'),
  current_date: null,
  _update() {
    const $style = document.getElementById('twimemo-style')
    const selector = Object.entries(this.data).reduce((acc, [k, v]) => {
      if (!v.blocks.length) return acc
      return [...acc, `span[aria-label="${k}"]`]
    }, []).join(',')
    $style.innerHTML = `${selector} { text-decoration: underline; }`
  },
  async init() {
    if (this.running) return
    if (document.getElementById('twimemo')) return

    this.running = true
    try {
      await new Promise((resolve, reject) => {
        let retry = 5000 / 250
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
          this.data[this.current_date] = await editor.save()
          localStorage.setItem('twimemo', JSON.stringify(this.data))
          this._update()
        },
        minHeight: 0
      })

      await editor.isReady
      new DragDrop(editor)

      const fp = flatpickr('#calendar', {
        static: true,
        ariaDateFormat: 'Y-m-d',
        onChange: (_, date) => {
          this.current_date = date
          const body = this.data[this.current_date]
          if (body?.blocks.length) editor.render(body)
          else editor.clear()
          scrollBy(0, -0.001)
        }
      })

      fp.setDate(new Date(), true)
    } catch (e) {
      console.error(e)
    } finally {
      this.running = false
    }
  }
}

document.head.insertAdjacentHTML('afterbegin', '<style id="twimemo-style"></style>')
window.twimemo._update()

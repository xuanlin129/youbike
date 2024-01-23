const search = document.querySelector('#search-input')
    const dataBase = document.querySelector('#content').firstElementChild.firstElementChild;

    (async () => {
      try {
        const { data } = await axios.get('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json')
        for (const info of data) {
          // 顏色
          let color = ''
          if (info.sbi / info.tot === 0) {
            color = 'grey'
          } else if (info.sbi / info.tot <= 0.3) {
            color = '#F5303E'
          } else if (info.sbi / info.tot <= 0.7) {
            color = '#FF9D19'
          } else {
            color = '#B9BF0D'
          }
          const stat = info.sna.split('_').at(-1)
          dataBase.insertAdjacentHTML('beforeend', `
              <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card" style="height: 200px;border: 5px solid ${color}">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-center fw-bold">${stat}</h5>
                    <ul class="mt-auto">
                      <li>剩餘: ${info.sbi} 台</li>
                      <li>區域: ${info.sarea}</li>
                      <li>經度: ${info.lng}</li>
                      <li>緯度: ${info.lat}</li>
                    </ul>
                  </div>
                </div>
              </div>
              `)
        }
      } catch (error) {
        console.log(error)
      }
    })()

    search.addEventListener('input', event => {
      // console.log(event.target.value);
      dataBase.innerHTML = '';
      (async () => {
        try {
          const { data } = await axios.get('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json')
          for (const info of data) {
            // 顏色
            color = ''
            if (info.sbi / info.tot === 0) {
              color = 'grey'
            } else if (info.sbi / info.tot <= 0.3) {
              color = '#F5303E'
            } else if (info.sbi / info.tot <= 0.7) {
              color = '#FF9D19'
            } else {
              color = '#B9BF0D'
            }
            const stat = info.sna.split('_').at(-1)
            if (stat.includes(`${event.target.value}`) || info.sarea.includes(`${event.target.value}`)) {
              dataBase.insertAdjacentHTML('beforeend', `
              <div class="col-12 col-sm-6 col-lg-3">
                <div class="card" style="height: 200px;border: 5px solid ${color}">
                  <div class="card-body">
                    <h5 class="card-title text-center fw-bold">${stat}</h5>
                    <ul class="mt-auto">
                      <li>剩餘: ${info.sbi} 台</li>
                      <li>區域: ${info.sarea}</li>
                      <li>經度: ${info.lng}</li>
                      <li>緯度: ${info.lat}</li>
                    </ul>
                  </div>
                </div>
              </div>
              `)
            }
          }
        } catch (error) {
          console.log(error)
        }
      })()
    })

    // 防止搜尋造成網頁跳轉
    search.addEventListener('submit', event => {
      event.preventDefault()
    })

    // setInterval('window.location.reload();', 10000).preventDefault()
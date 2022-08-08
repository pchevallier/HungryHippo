import Request from '../../Request'
import * as cheerio from 'cheerio'
import type { IndividualSiteMuncher } from '../../types'

const BASE_URL = `https://journalsonline.academypublishing.org.sg`
const FULL_URL = `${BASE_URL}/E-First/Singapore-Academy-of-Law-Annual-Review-of-Singapore-Cases`

const annualReviewMuncher: IndividualSiteMuncher = async () => {
  const { data } = await Request.get(FULL_URL)
  const $ = cheerio.load(data)

  const items = $(`#dnn_ctr570_View_grdeFirstDtls > tbody > tr > td`).map((_, element) => ({
    content: $(element).html(),
    date: new Date(
      $(`.artListItem > p:nth-of-type(3)`, element)
        .text().trim()
        .replace(`Published on e-First `, ``)
    ),
    link: $(`a`, element).attr(`href`),
    title: $(`.artListItem > p:nth-of-type(1)`, element).text().trim()
  })).get()

  return {
    items: items.slice(0, -1),
    link: FULL_URL,
    title: $(`title`).text()
  }
}

export default annualReviewMuncher
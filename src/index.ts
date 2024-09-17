import puppeteer from 'puppeteer';

async function scrapeFlightInfo() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = 'https://flight.naver.com/flights/international/AMS-ICN-20241012?adult=1&fareType=Y';
  // 네이버 항공권 페이지로 이동
  await page.goto(url, { waitUntil: 'networkidle2' });

  // .loadingProgress_progress__1aLNo 클래스가 사라질 때까지 기다림
  await page.waitForFunction(() => document.querySelector('.indivisual_inner__6ST3H'));
  await page.waitForFunction(() => !document.querySelector('.loadingProgress_progress__1aLNo'));

  // 예시로 특정 항공권 정보를 가져옴 (실제 페이지의 선택자로 대체 필요)
  const flightInfo = await page.evaluate(() => {
    const wrap = document.querySelectorAll('.indivisual_inner__6ST3H');

    const flightInfoList = Array.from(wrap).map((dom) => {
      const type = dom.querySelector('.airline_text__WWkbY')?.textContent;
      const date = dom.querySelector('.route_Route__HYsDn')?.textContent;
      const price = dom.querySelector('.item_num__aKbk4')?.textContent;

      return { type, date, price: parseInt((price || '0').replace(/,/g, '')) };
    });

    return flightInfoList
      .filter((v) => {
        return !v.date?.includes('경유 2');
      })
      .filter((v) => v.price < 1_300_000);
  });

  console.log('flightInfo', flightInfo);

  await browser.close();
}

scrapeFlightInfo();

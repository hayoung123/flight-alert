"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrapeFlightInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: true });
        const page = yield browser.newPage();
        const url = 'https://flight.naver.com/flights/international/AMS-ICN-20241012?adult=1&fareType=Y';
        // 네이버 항공권 페이지로 이동
        yield page.goto(url, { waitUntil: 'networkidle2' });
        // .loadingProgress_progress__1aLNo 클래스가 사라질 때까지 기다림
        yield page.waitForFunction(() => document.querySelector('.indivisual_inner__6ST3H'));
        yield page.waitForFunction(() => !document.querySelector('.loadingProgress_progress__1aLNo'));
        // 예시로 특정 항공권 정보를 가져옴 (실제 페이지의 선택자로 대체 필요)
        const flightInfo = yield page.evaluate(() => {
            const wrap = document.querySelectorAll('.indivisual_inner__6ST3H');
            const flightInfoList = Array.from(wrap).map((dom) => {
                var _a, _b, _c;
                const type = (_a = dom.querySelector('.airline_text__WWkbY')) === null || _a === void 0 ? void 0 : _a.textContent;
                const date = (_b = dom.querySelector('.route_Route__HYsDn')) === null || _b === void 0 ? void 0 : _b.textContent;
                const price = (_c = dom.querySelector('.item_num__aKbk4')) === null || _c === void 0 ? void 0 : _c.textContent;
                return { type, date, price: parseInt((price || '0').replace(/,/g, '')) };
            });
            return flightInfoList
                .filter((v) => {
                var _a;
                return !((_a = v.date) === null || _a === void 0 ? void 0 : _a.includes('경유 2'));
            })
                .filter((v) => v.price < 1300000);
        });
        console.log('flightInfo', flightInfo);
        yield browser.close();
    });
}
scrapeFlightInfo();

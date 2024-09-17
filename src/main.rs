use fantoccini::{ ClientBuilder, Locator };
use tokio;

#[tokio::main]
async fn main() -> Result<(), fantoccini::error::CmdError> {
    // 1. WebDriver 서버 URL (예: chromedriver 실행 후 http://localhost:9515)
    // chromedriver를 실행한 후 연결할 WebDriver 서버의 URL로 연결을 시도합니다.
    let mut client = ClientBuilder::native()
        .connect("http://localhost:9515").await
        .expect("failed to connect to WebDriver");

    let url = "https://flight.naver.com/flights/international/AMS-ICN-20241012?adult=1&fareType=Y";
    // 2. 네이버 항공권 페이지로 이동
    client.goto(url).await?;

    // 3. 페이지 로드 대기
    client.wait_for_navigation(None).await?;

    // 4. 특정 요소 찾기 (CSS 선택자를 사용)
    // 예시로 항공권 정보를 포함하는 요소를 찾습니다. 실제 페이지 구조에 맞게 선택자를 설정하세요.
    let mut flight_info = client.find(Locator::Css(".flight-info")).await?;

    // 5. 요소의 텍스트 추출
    let text = flight_info.text().await?;
    println!("찾은 항공권 정보: {}", text);

    // 6. 브라우저 세션 종료
    client.close().await?;

    Ok(())
}

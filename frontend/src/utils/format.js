//정규표현식 패턴이나 공통함수 등 공통으로 사용하는 유틸 파일들이 위치

// 날짜 포맷팅 함수
export function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

// 숫자 포맷팅 함수 (예: 천 단위 콤마)
export function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

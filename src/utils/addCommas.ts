export default function addCommas(num: string) {
  let str = num.toString();
  let result = str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return result;
}

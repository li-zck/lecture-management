const url = new URL("http://www.example.com/dogs?breed=husky&fur=white");

console.log(url.toString());

const params = url.searchParams;
const breed = params.get("breed");

/**
  console.log(url.hostname); // 'www.example.com'
  console.log(url.pathname); // '/cats'
  console.log(url.origin); // 'http://www.example.com'
  console.log(breed); // 'husky'
**/

/**
  const newUrl = url.origin + url.pathname;
  console.log(newUrl); // 'http://www.example.com/dogs'
**/

const canonical = new URL(url.origin + url.pathname);
const entries = url.searchParams.entries();
const obj = Object.fromEntries(entries);

console.log(canonical);
console.log(entries);
console.log(obj);

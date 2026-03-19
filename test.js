const fetchRoute = async (url) => {
  try {
    const res = await fetch(url);
    const body = await res.text();
    console.log(`[${url}] -> ${res.status} ${body.substring(0, 50)}...`);
  } catch (e) {
    console.log(`[${url}] -> ERROR: ${e.message}`);
  }
}

async function run() {
  await fetchRoute('http://127.0.0.1:3000/api/health'); // IPv4
  await fetchRoute('http://[::1]:3000/api/health');    // IPv6
}
run();

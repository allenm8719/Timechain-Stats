let btcUSDPrice = 0;

// Function to fetch BTC data from CoinGecko API
async function fetchBTCData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (!response.ok) {
      throw new Error('Failed to fetch BTC data');
    }
    const data = await response.json();

    const latestBTCPrice = data.bitcoin.usd;

    // Only update the BTC data if the price has changed
    if (latestBTCPrice !== btcUSDPrice) {
      btcUSDPrice = latestBTCPrice;
      console.log('BTC Price Updated:', btcUSDPrice);
      displayData(btcUSDPrice);
    }
  } catch (error) {
    console.error('Error fetching BTC data:', error);
    document.getElementById('btcData').innerHTML = '<p>Failed to fetch BTC data.</p>';
  }
}

// Function to calculate sats per dollar based on BTC USD price
function calculateSatsPerDollar(btcUSDPrice) {
  if (typeof btcUSDPrice !== 'number' || isNaN(btcUSDPrice) || btcUSDPrice <= 0) {
    throw new Error('Invalid BTC USD price');
  }

  const satsPerDollar = 100000000 / btcUSDPrice; // 1 Bitcoin = 100,000,000 sats
  return satsPerDollar;
}

// Function to display the BTC data on the HTML page
function displayData(btcUSDPrice) {
  try {
    const satsPerDollar = calculateSatsPerDollar(btcUSDPrice);

    const btcDataDiv = document.getElementById('btcData');
    btcDataDiv.innerHTML = `
      <p>Bitcoin Price (USD): $${btcUSDPrice}</p>
      <p>Sats per Dollar: ${satsPerDollar.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      <p>Current Block Height: <span id="blockHeight">Loading...</span></p>
    `;
    console.log('Data Updated:', btcUSDPrice, satsPerDollar);

    fetchBlockHeight(); // Call this function here to display the block height on initial load
  } catch (error) {
    console.error('Error displaying data:', error);
    document.getElementById('btcData').innerHTML = '<p>Error displaying data.</p>';
  }
}

// Function to fetch current block height from BlockCypher API
async function fetchBlockHeight() {
  try {
    const response = await fetch('https://api.blockcypher.com/v1/btc/main');
    if (!response.ok) {
      throw new Error('Failed to fetch block height');
    }
    const data = await response.json();
    const currentBlockHeight = data.height;

    const blockHeightElement = document.getElementById('blockHeight');
    blockHeightElement.textContent = currentBlockHeight;
    console.log('Block Height Updated:', currentBlockHeight);
  } catch (error) {
    console.error('Error fetching block height:', error);
    const blockHeightElement = document.getElementById('blockHeight');
    blockHeightElement.textContent = 'Failed to fetch block height.';
  }
}

// Function to update BTC data periodically
function updateBTCData() {
  fetchBTCData();
  setInterval(fetchBTCData, 5000); // 5000 milliseconds = 5 seconds
}

// Call the function to start updating BTC data
updateBTCData();

// Update the block height every 10 minutes
setInterval(fetchBlockHeight, 600000); // 600000 milliseconds = 10 minutes

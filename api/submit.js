export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appPoNySjHSzchpOL';

  if (!TOKEN) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const TABLE_MAP = {
    hostSubmissions: 'tblXdL1etEOCoueRb',
    interestExpressions: 'tblYIQaJa2IQ6AbBs',
    progress: 'tblAmfIpzi0CkXKpl'
  };

  const { table, fields } = req.body;

  if (!table || !fields) {
    return res.status(400).json({ error: 'Missing table or fields' });
  }

  const tableId = TABLE_MAP[table];
  if (!tableId) {
    return res.status(400).json({ error: 'Invalid table' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${tableId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

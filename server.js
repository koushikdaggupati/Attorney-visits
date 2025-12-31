import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json({ limit: '100kb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use(express.static(distPath));

const DATAVERSE_API_URL = process.env.DATAVERSE_API_URL;
const DATAVERSE_CLIENT_ID = process.env.DATAVERSE_CLIENT_ID;
const DATAVERSE_CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET;
const DATAVERSE_TENANT_ID = process.env.DATAVERSE_TENANT_ID;
const DATAVERSE_ENTITY_SET = process.env.DATAVERSE_ENTITY_SET || 'doc_inmates';

const getDataverseScope = () => {
  if (!DATAVERSE_API_URL) {
    return undefined;
  }
  const apiUrl = new URL(DATAVERSE_API_URL);
  return `${apiUrl.origin}/.default`;
};

let cachedToken = null;
let tokenExpiresAt = 0;

const sanitizeLeadingDots = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).replace(/^\.+/, '').trimStart();
};

const sanitizeSubmissionPayload = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  return {
    ...payload,
    firstName: sanitizeLeadingDots(payload.firstName ?? ''),
    lastName: sanitizeLeadingDots(payload.lastName ?? ''),
    picFirstName: sanitizeLeadingDots(payload.picFirstName ?? ''),
    picLastName: sanitizeLeadingDots(payload.picLastName ?? '')
  };
};

const getDataverseToken = async () => {
  if (!DATAVERSE_API_URL || !DATAVERSE_CLIENT_ID || !DATAVERSE_CLIENT_SECRET || !DATAVERSE_TENANT_ID) {
    throw new Error('Dataverse credentials are not configured.');
  }

  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60 * 1000) {
    return cachedToken;
  }

  const tokenUrl = `https://login.microsoftonline.com/${DATAVERSE_TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('client_id', DATAVERSE_CLIENT_ID);
  params.append('client_secret', DATAVERSE_CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');
  params.append('scope', getDataverseScope());

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to retrieve Dataverse token: ${response.status} ${errorText}`);
  }

  const tokenData = await response.json();
  cachedToken = tokenData.access_token;
  tokenExpiresAt = now + (tokenData.expires_in ? tokenData.expires_in * 1000 : 0);
  return cachedToken;
};

app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

/**
 * Endpoint: /api/pic-lookup
 * Purpose: Fetch PIC details from Dataverse based on NYSID or Book & Case.
 */
app.get('/api/pic-lookup', apiLimiter, async (req, res) => {
  try {
    const { nysid, bookAndCase } = req.query;

    if (!nysid && !bookAndCase) {
      return res.status(400).json({ error: 'Provide a NYSID or Book & Case number.' });
    }

    const filterValue = (value) => String(value).replace(/'/g, "''");
    const filter = nysid
      ? `doc_nysid eq '${filterValue(nysid)}'`
      : `doc_bookcasenumber eq '${filterValue(bookAndCase)}'`;

    const token = await getDataverseToken();
    const url = new URL(`${DATAVERSE_API_URL.replace(/\/$/, '')}/${DATAVERSE_ENTITY_SET}`);
    url.searchParams.set('$select', 'doc_firstname,doc_lastname,doc_bookcasenumber,doc_nysid,doc_facility');
    url.searchParams.set('$filter', filter);
    url.searchParams.set('$top', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Prefer': 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dataverse request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const record = data?.value?.[0];

    if (!record) {
      return res.status(404).json({ error: 'No matching PIC found.' });
    }

    const facilityName = record?.['doc_facility@OData.Community.Display.V1.FormattedValue'] ?? '';

    return res.status(200).json({
      picFirstName: sanitizeLeadingDots(record.doc_firstname ?? ''),
      picLastName: sanitizeLeadingDots(record.doc_lastname ?? ''),
      nysid: record.doc_nysid ?? '',
      bookAndCase: record.doc_bookcasenumber ?? '',
      facility: facilityName
    });
  } catch (error) {
    console.error('PIC lookup error:', error);
    return res.status(500).json({ error: 'Failed to lookup PIC information.' });
  }
});

/**
 * Endpoint: /api/submit
 * Purpose: Securely forwards form data to Power Apps without exposing the URL/Secret to the client.
 */
app.post('/api/submit', apiLimiter, async (req, res) => {
  try {
    const POWER_APPS_URL = process.env.POWER_APPS_URL;
    const POWER_APPS_SECRET = process.env.POWER_APPS_SECRET;

    if (!POWER_APPS_URL) {
      return res.status(500).json({ error: 'Submission endpoint is not configured.' });
    }

    const sanitizedPayload = sanitizeSubmissionPayload(req.body);
    if (!sanitizedPayload) {
      return res.status(400).json({ error: 'Invalid submission payload.' });
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (POWER_APPS_SECRET) {
      headers['X-Api-Key'] = POWER_APPS_SECRET;
    }

    const response = await fetch(POWER_APPS_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(sanitizedPayload)
    });

    if (!response.ok) {
      throw new Error(`Power Apps responded with status: ${response.status}`);
    }

    const data = await response.json().catch(() => ({})); // Handle cases where response body is empty
    return res.status(200).json(data);

  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ error: 'Failed to submit data.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Mock Auth0 endpoints
app.post('/oauth/token', (req, res) => {
  res.json({
    access_token: 'mock_access_token',
    token_type: 'Bearer',
    expires_in: 86400
  });
});

app.get('/userinfo', (req, res) => {
  res.json({
    sub: 'mock_user_id',
    email: 'user@example.com',
    name: 'Mock User'
  });
});

// Mock Stripe endpoints
app.post('/v1/payment_intents', (req, res) => {
  res.json({
    id: 'pi_mock_payment_intent',
    amount: 2000,
    currency: 'usd',
    status: 'requires_payment_method'
  });
});

app.post('/v1/customers', (req, res) => {
  res.json({
    id: 'cus_mock_customer',
    email: 'customer@example.com',
    created: Date.now() / 1000
  });
});

// Mock GBG endpoints
app.post('/api/verify', (req, res) => {
  res.json({
    verification_id: 'mock_verification_id',
    status: 'verified',
    confidence_score: 0.95
  });
});

// Mock ActiveCampaign endpoints
app.post('/api/3/contacts', (req, res) => {
  res.json({
    contact: {
      id: 'mock_contact_id',
      email: 'contact@example.com'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'mock-external' });
});

app.listen(PORT, () => {
  console.log(`Mock external service running on port ${PORT}`);
});

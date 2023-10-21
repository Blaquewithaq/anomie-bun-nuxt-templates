-- Save your Stripe API key in Vault and retrieve the `key_id`
INSERT INTO vault.secrets (name, secret)
  VALUES (
    'stripe',
    'secret_key'
  )
  RETURNING key_id;

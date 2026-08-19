# Security

All library reads require an authenticated user. Library mutations require an administrator or owner, with authorization performed before request parsing or store operations.

Request bodies are size-limited and validated at the API boundary. Unexpected failures are logged with structured, non-sensitive metadata, while clients receive stable error codes without internal exception details.

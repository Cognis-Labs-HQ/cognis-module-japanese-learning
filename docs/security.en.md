# Security

The Japanese learning module protects its library surfaces with host authentication, role-based authorization, boundary validation, and safe error reporting.

## Usage Examples

- Authenticate every library request through the host-provided `auth:requireAuth` capability.
- Require an administrator or owner before accepting library mutations.
- Return stable client error codes rather than exception messages.

## Technical Specification

### Authorization

All library reads require an authenticated user. Library mutations require an administrator or owner, with authorization performed before request parsing or store operations.

### Validation and Errors

Request bodies are size-limited and validated at the API boundary. Unexpected failures are logged with structured, non-sensitive metadata, while clients receive stable error codes without internal exception details.

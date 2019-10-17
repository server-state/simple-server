# simple-server
Providing a template for a full server-state setup including authentication, server-base, client-base and a few modules.

### Notes
Remove the snake-oil certificate from the directory and use your own for a production environment! \
If you testing your setup, import the given certificate [cert.pem](cert.pem) in your preferred test utility (browser, http pickers, etc.) or add an exception for this specific site [`https://localhost:4434`](https://localhost:4434/api/v1/all).

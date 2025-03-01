
export interface JsonRPCClientConfig {
  endpoint: string;
  headers: Record<string, string>;
  requestIdCounter: number;
}

export interface JsonRPCClientOptions {
  username?: string;
  password?: string;
}

function createBasicAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}


export function configureJsonRPCClient(endpoint: string, options: JsonRPCClientOptions = {}): JsonRPCClientConfig {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (options.username && options.password) {
    headers['Authorization'] = createBasicAuthHeader(options.username, options.password);
  }

  return {
    endpoint,
    headers,
    requestIdCounter: 1,
  };
}

export async function call(
  config: JsonRPCClientConfig, 
  method: string, 
  params?: any
): Promise<any> {
  const id = config.requestIdCounter;

  config.requestIdCounter++;
  
  const request = {
    jsonrpc: '2.0',
    id,
    method,
    params,
  };

    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const jsonResponse = await response.json();

    // In principle error shouldn't be present at all if there was no error
    // In practice it comes back null sometimes
    if ('error' in jsonResponse && jsonResponse.error) {
        throw new Error(jsonResponse.error.message);
    }

    return jsonResponse.result;
}

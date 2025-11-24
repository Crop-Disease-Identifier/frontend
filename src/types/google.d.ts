/* Type definitions for Google Identity Services (minimal) */
interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleAccountsId {
  initialize: (options: {
    client_id: string;
    callback: (resp: GoogleCredentialResponse) => void;
  }) => void;
  prompt: () => void;
  renderButton: (
    container: HTMLElement | null,
    options: Record<string, any>
  ) => void;
}

interface Window {
  google?: { accounts: { id: GoogleAccountsId } };
}

export {};

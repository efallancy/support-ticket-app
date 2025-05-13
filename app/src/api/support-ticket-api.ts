import type { SupportTicket } from '../schemas/support-ticket.schema';

// Define API response types
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Hard coded the API base URL. Ideally, this would be pulled
// in from an environment variable (during build phase) or configuration file.
const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetches all support tickets from the API
 */
export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/support-tickets`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.status}`);
    }

    const { data } = (await response.json()) as ApiResponse<SupportTicket[]>;
    return data;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
}

/**
 * Creates a new support ticket
 */
export async function createSupportTicket(
  ticket: Pick<SupportTicket, 'title' | 'description' | 'priority'>
): Promise<SupportTicket> {
  try {
    const response = await fetch(`${API_BASE_URL}/support-tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ticket: ${response.status}`);
    }

    const { data } = (await response.json()) as ApiResponse<SupportTicket>;
    return data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
}

/**
 * Updates an existing support ticket
 */
export async function updateSupportTicket(
  ticket: SupportTicket
): Promise<SupportTicket> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/support-tickets/${ticket.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update ticket: ${response.status}`);
    }

    const { data } = (await response.json()) as ApiResponse<SupportTicket>;
    return data;
  } catch (error) {
    console.error('Error updating support ticket:', error);
    throw error;
  }
}

/**
 * Deletes a support ticket
 */
export async function deleteSupportTicket(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ticket: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    throw error;
  }
}

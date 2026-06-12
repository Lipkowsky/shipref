export interface ClerkWebhookEvent {
  type: string;
  data: any;
}

export interface CreateUserInput {
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}


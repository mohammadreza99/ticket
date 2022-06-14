export class Operator {
  operator_id?: string;
  name: string;
  username: string;
  password: string;
  status: UserStatus;
  allowed_ips?: string[];
}

export class TransferOperatorTickets {
  operator_id?: string;
  name: string;
  username: string;
  password: string;
  status: UserStatus;
  allowed_ips?: string[];
}

export type UserStatus = 'Active' | 'Inactive';

export interface ActiveAccount {
  Id: string;
  Name: string;
}

export interface CustomerProduct {
  ContactId: string;
  AccountId: string;
  AccountName: string;
  PrimaryProduct: string;
  ProductName: string;
}

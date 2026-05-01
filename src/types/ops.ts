export interface Operator {
  id: number;
  firstName: string;
  lastName: string;
  opsCompleted: number;
  reliability: number;
  endorsements: string[];
}

export interface Op {
  opId: number;
  publicId: string;
  opTitle: string;
  opDate: string;
  filledQuantity: number;
  operatorsNeeded: number;
  startTime: string;
  endTime: string;
  estTotalHours: number;
  checkInCode: string;
  checkOutCode: string;
  checkInExpirationTime: string;
  checkOutExpirationTime: string;
  operators: Operator[];
}

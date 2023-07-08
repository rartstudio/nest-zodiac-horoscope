export interface BasicResponseSuccess {
  data: any;
  status: boolean;
  message: string;
}

export interface BasicResponseError {
  status: boolean;
  error: {
    code: number;
    message: string;
  };
}

export interface FieldResponseError {
  status: boolean;
  error: {
    code: number;
    message: string;
    field: any;
  };
}

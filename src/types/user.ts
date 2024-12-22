// 유저 정보

import { branch } from "./branch";

export interface User {
  id: string;
  password: string;
  role: string; // admin | branch
  name: string;
  phone: string;
  branch: branch;
}

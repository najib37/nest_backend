import { StateType } from "../types/StateType";

export class CreateNotificationDto {
  id?: string;
  type: string;
  content: string;
  state?: StateType
}

export type SelectNotifType = {
  [Property in keyof Partial<CreateNotificationDto>]: number
}

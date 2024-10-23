export interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  traceback?: string;
}

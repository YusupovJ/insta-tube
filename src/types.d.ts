import { AutoChatActionFlavor } from "@grammyjs/auto-chat-action";
import { Context, SessionFlavor } from "grammy";

export type MyContext = Context & SessionFlavor<SessionData> & AutoChatActionFlavor;

export interface IInstagram {
  thumb: string;
  link: string;
  type: string;
  title: string;
}

export interface SessionData {
  formats: string[];
}

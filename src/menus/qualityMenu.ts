import { Menu, MenuRange } from "@grammyjs/menu";
import { MyContext } from "../types";

const qualityMenu = new Menu<MyContext>("qualities").dynamic((ctx: MyContext, range: MenuRange<MyContext>) => {
  ctx.session.formats.forEach((label) => {
    range.text(label.toString(), () => ctx.reply(label));
  });
});

export default qualityMenu;

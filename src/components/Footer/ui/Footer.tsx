import { Link } from "react-router-dom";
import { DiscordIcon } from "../../Icons/DiscordIcon";
import { GithubIcon } from "../../Icons/GithubIcon";
import { TelegramIcon } from "../../Icons/TelegramIcon";
import { XIcon } from "../../Icons/XIcon";
import s from "./Footer.module.scss";

const socLinks = [
  {
    link: "https://x.com/",
    icon: <XIcon />,
  },
  {
    link: "https://github.com/",
    icon: <GithubIcon />,
  },
  {
    link: "https://discord.com/",
    icon: <DiscordIcon />,
  },
  {
    link: "https://t.me/",
    icon: <TelegramIcon />,
  },
];

export const Footer = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        {socLinks.map((item, i) => (
          <Link to={item.link} target="blank" key={i}>
            {item.icon}
          </Link>
        ))}
      </div>
      <div className={s.bottom}>best product of 2024 on ton</div>
    </div>
  );
};

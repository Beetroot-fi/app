import { Link, useLocation } from "react-router-dom";
import { TaskIcon } from "../../Icons/TaskIcon";
import { SwapIcon } from "../../Icons/SwapIcon";
import { InviteIcon } from "../../Icons/InviteIcon";
import clsx from "clsx";
import s from "../ui/Footer.module.scss";

export const useFooter = () => {
  const location = useLocation(); // Получаем объект местоположения
  const currentPath = location.pathname + location.search; // Определяем текущий путь
  const links = [
    {
      link: "/tasks",
      icon: TaskIcon,
    },
    {
      link: "/",
      icon: SwapIcon,
    },
    {
      link: "/invite",
      icon: InviteIcon,
    },
  ];

  const FooterLinks = () => {
    return links.map((item, i) => {
      const IconComponent = item.icon; // Получаем компонент иконки
      const iconColor = currentPath === item.link ? "#fff" : undefined; // Устанавливаем цвет

      return (
        <Link
          to={item.link}
          className={clsx(s.item, currentPath === item.link && s.active)}
          key={i}
        >
          <IconComponent color={iconColor} />
        </Link>
      );
    });
  };
  return { FooterLinks };
};

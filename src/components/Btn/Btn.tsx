import { Link } from "react-router-dom";
import s from "./Btn.module.scss";
import clsx from "clsx";

type ButtonHeight = "small" | "auto" | string;
type ButtonWidth = "auto" | string;

interface Props {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  blank?: boolean;
  type?: "pink" | "clear" | "default" | "transparent";
  onClick?: () => void;
  height?: ButtonHeight;
  width?: ButtonWidth;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  disabled?: boolean;
}

const getHeightStyle = (height: ButtonHeight) =>
  ({
    small: "28px",
    auto: "100%",
  }[height] || `${height}px`);

const getWidthStyle = (width: ButtonWidth) =>
  ({
    auto: "100%",
    full: "100%",
  }[width] || `${width}px`);

const Btn: React.FC<Props> = ({
  children,
  className,
  href,
  blank,
  type = "default",
  onClick,
  height = "58",
  width = "full",
  fontSize = "36",
  fontWeight = "400",
  padding,
  disabled,
}) => {
  const style = {
    height: getHeightStyle(height),
    width: getWidthStyle(width),
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    padding,
  };

  const classes = clsx(
    s.btn,
    {
      [s.default]: type !== "clear" && type,
      [s.pink]: type == "pink",
      [s.transparent]: type == "transparent",
      [s.disabled]: disabled,
    },
    className
  );

  const anchorProps = {
    onClick,
    className: classes,
    style: style,
    ...(blank && { target: "_blank", rel: "noopener noreferrer" }),
  };

  return href ? (
    <Link to={href} {...anchorProps}>
      <button>{children}</button>
    </Link>
  ) : (
    <button {...anchorProps}>{children}</button>
  );
};

export default Btn;

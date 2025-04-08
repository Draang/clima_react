import style from "./Alert.module.css";
import { ReactNode } from "react";

type AlertProps = {
  children: ReactNode;
};
export default function Alert({ children }: AlertProps) {
  return <div className={style.alert}>{children}</div>;
}

import clsx from "clsx";
import { ArrowRightIcon } from "../../../components/Icons/ArrowRightIcon";
import s from "./Tasks.module.scss";
import { ThisInviteLinkIcon } from "../../../components/Icons/ThisInviteLinkIcon";

export const Tasks = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.block}>
        <div className={s.block_title}>new task:</div>
        <div className={s.block_items}>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ArrowRightIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ArrowRightIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ArrowRightIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ArrowRightIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ArrowRightIcon />
            </div>
          </div>
        </div>
      </div>
      <div className={s.block}>
        <div className={s.block_title}>completed tasks:</div>
        <div className={clsx(s.block_items, s.pink)}>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ThisInviteLinkIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ThisInviteLinkIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ThisInviteLinkIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ThisInviteLinkIcon />
            </div>
          </div>
          <div className={s.block_item}>
            <div className={s.block_item_l}>follow x @beetroot</div>
            <div className={s.block_item_r}>
              <ThisInviteLinkIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
